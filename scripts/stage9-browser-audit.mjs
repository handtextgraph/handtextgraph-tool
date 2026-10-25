import assert from "node:assert/strict";
import { existsSync, mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { spawn } from "node:child_process";
import { createServer } from "node:net";
import { publicToolCatalog } from "../lib/tool-catalog.ts";

const base = process.env.HANDWRITING_TEST_BASE_URL || "http://127.0.0.1:3105";
const chrome = ["C:/Program Files/Google/Chrome/Application/chrome.exe", "C:/Program Files (x86)/Google/Chrome/Application/chrome.exe"].find(existsSync);
assert.ok(chrome, "Chrome is required");
const work = mkdtempSync(path.join(tmpdir(), "handtextgraph-stage9-"));
const port = await new Promise((resolve, reject) => { const server=createServer();server.once("error",reject);server.listen(0,"127.0.0.1",()=>{const address=server.address();server.close(()=>resolve(address.port))}) });
const browser = spawn(chrome,["--headless=new","--disable-gpu",`--remote-debugging-port=${port}`,`--user-data-dir=${path.join(work,"profile")}`,"--no-first-run","about:blank"],{stdio:"ignore"});
const pause=(ms)=>new Promise((resolve)=>setTimeout(resolve,ms));let target;
for(let attempt=0;attempt<120;attempt+=1){try{target=await fetch(`http://127.0.0.1:${port}/json/new?${encodeURIComponent(base)}`,{method:"PUT"}).then((response)=>response.json());break}catch{await pause(100)}}
assert.ok(target?.webSocketDebuggerUrl,"Chrome debugging endpoint did not start");
const socket=new WebSocket(target.webSocketDebuggerUrl);await new Promise((resolve,reject)=>{socket.addEventListener("open",resolve,{once:true});socket.addEventListener("error",reject,{once:true})});
let sequence=0;const pending=new Map();let errors=[];
socket.addEventListener("message",({data})=>{const message=JSON.parse(data);if(message.method==="Runtime.exceptionThrown")errors.push(message.params.exceptionDetails.text);if(message.method==="Runtime.consoleAPICalled"&&message.params.type==="error")errors.push(message.params.args.map((arg)=>arg.value||arg.description).join(" "));if(!message.id)return;const waiter=pending.get(message.id);if(!waiter)return;pending.delete(message.id);message.error?waiter.reject(new Error(message.error.message)):waiter.resolve(message.result)});
const send=(method,params={})=>new Promise((resolve,reject)=>{const id=++sequence;pending.set(id,{resolve,reject});socket.send(JSON.stringify({id,method,params}))});
const evaluate=async(expression)=>{const result=await send("Runtime.evaluate",{expression,awaitPromise:true,returnByValue:true});if(result.exceptionDetails)throw new Error(result.exceptionDetails.exception?.description||result.exceptionDetails.text);return result.result.value};
const waitFor=async(expression,label)=>{for(let attempt=0;attempt<240;attempt+=1){if(await evaluate(expression))return;await pause(100)}throw new Error(`Timed out waiting for ${label}`)};
const navigate=async(pathname)=>{errors=[];await send("Page.navigate",{url:`${base}${pathname}`});await waitFor('document.readyState==="complete"&&!!document.querySelector("h1")',pathname);await pause(150)};

try{
  await send("Page.enable");await send("Runtime.enable");await send("Performance.enable");
  const routes=[...new Set(publicToolCatalog.map((tool)=>tool.href.split("#")[0]||"/"))];
  assert.equal(publicToolCatalog.length,40,"Registered tool count");
  for(const route of routes){
    await navigate(route);
    const state=await evaluate(`({title:document.title,h1:document.querySelector('h1')?.textContent?.trim(),interactive:document.querySelectorAll('input,select,textarea,button').length,overlay:!!document.querySelector('[data-nextjs-dialog]')})`);
    assert.ok(state.title.length>8,`${route} title`);assert.ok(state.h1,`${route} H1`);assert.equal(state.overlay,false,`${route} hydration overlay`);
    if(route!=="/templates")assert.ok(state.interactive>0,`${route} interactive controls`);
    for(const [width,height] of [[390,844],[768,1024],[1440,1000]]){await send("Emulation.setDeviceMetricsOverride",{width,height,deviceScaleFactor:1,mobile:width<768});assert.equal(await evaluate('document.documentElement.scrollWidth<=document.documentElement.clientWidth'),true,`${route} overflow at ${width}px`)}
    assert.deepEqual(errors,[],`${route} console errors`);
  }

  await navigate("/");
  await waitFor('!!document.querySelector("#handwriting-text")',"main handwriting editor");
  await evaluate(`(()=>{const input=document.querySelector('#handwriting-text');const setter=Object.getOwnPropertyDescriptor(HTMLTextAreaElement.prototype,'value').set;setter.call(input,'Stage nine browser verification text that should render visibly.');input.dispatchEvent(new Event('input',{bubbles:true}))})()`);
  await waitFor('document.body.innerText.includes("Page 1")||document.querySelectorAll(".paper-frame img").length>0',"handwriting preview update");

  await navigate("/sudoku-generator");
  await waitFor(`(()=>{const button=[...document.querySelectorAll('button')].find((node)=>node.textContent.includes('Regenerate puzzles'));return button&&Object.keys(button).some((key)=>key.startsWith('__reactProps'))})()`,"Sudoku hydration");
  const sudokuBefore=await evaluate(`document.querySelector('svg text')?.textContent`);
  await evaluate(`([...document.querySelectorAll('button')].find((node)=>node.textContent.includes('Regenerate puzzles'))).click()`);
  await waitFor(`document.querySelector('svg text')?.textContent!==${JSON.stringify(sudokuBefore)}`,"Sudoku regeneration");

  await navigate("/pixel-art-generator");
  await waitFor(`Object.keys(document.querySelector('svg rect')||{}).some((key)=>key.startsWith('__reactProps'))`,"pixel editor hydration");
  await evaluate(`document.querySelector('svg rect').dispatchEvent(new PointerEvent('pointerdown',{bubbles:true,pointerId:1}))`);
  await waitFor(`localStorage.getItem('pixel-art-v1')?.includes('#2563eb')`,"pixel autosave");

  await navigate("/virtual-graph-paper");
  await waitFor(`Object.keys([...document.querySelectorAll('button')].find((node)=>node.textContent==='pan')||{}).some((key)=>key.startsWith('__reactProps'))`,"graph editor hydration");
  await evaluate(`([...document.querySelectorAll('button')].find((node)=>node.textContent==='pan')).click()`);
  const viewBoxBefore=await evaluate(`document.querySelector('svg[width="1000"][height="700"]')?.getAttribute('viewBox')`);
  const graphPoint=await evaluate(`(()=>{const rect=document.querySelector('svg[width="1000"][height="700"]').getBoundingClientRect();return{x:rect.left+rect.width/2,y:rect.top+rect.height/2}})()`);
  await send("Input.dispatchMouseEvent",{type:"mousePressed",x:graphPoint.x,y:graphPoint.y,button:"left",buttons:1,clickCount:1});
  await send("Input.dispatchMouseEvent",{type:"mouseMoved",x:graphPoint.x+50,y:graphPoint.y+35,button:"left",buttons:1});
  await send("Input.dispatchMouseEvent",{type:"mouseReleased",x:graphPoint.x+50,y:graphPoint.y+35,button:"left",buttons:0,clickCount:1});
  await waitFor(`document.querySelector('svg[width="1000"][height="700"]')?.getAttribute('viewBox')!==${JSON.stringify(viewBoxBefore)}`,"pointer drag-to-pan");

  await send("Emulation.setDeviceMetricsOverride",{width:390,height:844,deviceScaleFactor:1,mobile:true});
  await navigate("/blog");
  await evaluate(`document.querySelector('button[aria-label="Open menu"]')?.click()`);
  assert.equal(await evaluate('!![...document.querySelectorAll("nav")].find((node)=>node.getAttribute("aria-label")==="Mobile navigation"&&!node.hidden)'),true,"mobile menu opens");

  const performanceRows=[];
  for(const route of ["/","/tools","/templates","/blog"]){
    await send("Emulation.setDeviceMetricsOverride",{width:1440,height:1000,deviceScaleFactor:1,mobile:false});await navigate(route);
    performanceRows.push(await evaluate(`(()=>{const nav=performance.getEntriesByType('navigation')[0];const resources=performance.getEntriesByType('resource');const js=resources.filter((item)=>item.name.includes('/_next/')&&item.name.includes('.js'));return{route:${JSON.stringify(route)},domContentLoadedMs:Math.round(nav.domContentLoadedEventEnd),loadMs:Math.round(nav.loadEventEnd),transferKb:Math.round(resources.reduce((sum,item)=>sum+(item.transferSize||0),0)/1024),jsTransferKb:Math.round(js.reduce((sum,item)=>sum+(item.transferSize||0),0)/1024),jsRequests:js.length,domNodes:document.getElementsByTagName('*').length}})()`));
  }
  console.log(JSON.stringify({message:`Stage 9 browser audit passed for ${publicToolCatalog.length}/40 registered tool cards across 390/768/1440 viewports.`,performanceRows},null,2));
}finally{socket.close();browser.kill();if(browser.exitCode===null)await new Promise((resolve)=>browser.once("exit",resolve));await pause(300);rmSync(work,{recursive:true,force:true,maxRetries:20,retryDelay:250})}
