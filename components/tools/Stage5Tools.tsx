"use client";
/* Local autosave hydration intentionally restores browser state after mount. */
/* eslint-disable react-hooks/set-state-in-effect */

import { useEffect, useMemo, useRef, useState, type PointerEvent as ReactPointerEvent } from "react";
import Link from "next/link";
import { downloadCanvas, downloadDataUrl } from "@/lib/client-export";
import { createSeededRandom } from "@/lib/seeded-random";
import { calculatePosterTiles, decodeSudokuId, encodeSudokuId, floodFillPixels, generateSudokuPuzzle, paperMillimeters, sudokuBoxDimensions, sudokuClueTargets, type Orientation, type PaperKind, type SudokuDifficulty, type SudokuSize } from "@/lib/stage5-tools";

const input = "w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-base text-slate-900 outline-none focus:border-brand-blue focus:ring-2 focus:ring-blue-100";
const primary = "min-h-11 rounded-full bg-brand-blue px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-50";
const secondary = "min-h-11 rounded-full border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 hover:border-slate-400 disabled:opacity-50";
const panel = "rounded-[28px] border border-slate-200 bg-white p-5 shadow-card sm:p-6";
function Field({label,children}:{label:string;children:React.ReactNode}){return <label className="block text-sm font-semibold text-slate-700">{label}<span className="mt-2 block">{children}</span></label>}
function Workbench({controls,children,status}:{controls:React.ReactNode;children:React.ReactNode;status?:string}){return <div className="grid min-w-0 gap-6 lg:grid-cols-[360px,minmax(0,1fr)]"><aside className={`${panel} min-w-0 h-fit`}>{controls}</aside><section className={`${panel} min-w-0`}><div className="mb-4 flex flex-wrap items-center justify-between gap-2"><div><h2 className="text-xl font-semibold">Live preview</h2>{status&&<p role="status" className="mt-1 text-sm text-slate-500">{status}</p>}</div></div>{children}</section></div>}
function exportSvg(svg:SVGSVGElement|null,name:string){if(!svg)return;const source=new XMLSerializer().serializeToString(svg);downloadDataUrl(`data:image/svg+xml;charset=utf-8,${encodeURIComponent(source)}`,`${name}.svg`)}
async function svgCanvas(svg:SVGSVGElement){const source=new XMLSerializer().serializeToString(svg),image=new Image();await new Promise<void>((resolve,reject)=>{image.onload=()=>resolve();image.onerror=()=>reject(new Error("Preview could not be rendered."));image.src=`data:image/svg+xml;charset=utf-8,${encodeURIComponent(source)}`});const canvas=document.createElement("canvas");canvas.width=Number(svg.getAttribute("width"))||1200;canvas.height=Number(svg.getAttribute("height"))||1600;canvas.getContext("2d")!.drawImage(image,0,0,canvas.width,canvas.height);return canvas}
async function exportSvgAs(svg:SVGSVGElement|null,name:string,kind:"png"|"pdf"){if(!svg)return;await downloadCanvas(await svgCanvas(svg),name,kind)}
function ExportButtons({svg,name,pdf=true}:{svg:React.RefObject<SVGSVGElement|null>;name:string;pdf?:boolean}){return <div className="mt-4 flex flex-wrap gap-2"><button className={primary} onClick={()=>void exportSvgAs(svg.current,name,"png")}>Download PNG</button>{pdf&&<button className={secondary} onClick={()=>void exportSvgAs(svg.current,name,"pdf")}>Download PDF</button>}<button className={secondary} onClick={()=>exportSvg(svg.current,name)}>Download SVG</button><button className={secondary} onClick={()=>window.print()}>Print</button></div>}

export function NumberGridTool(){const [start,setStart]=useState(1),[end,setEnd]=useState(100),[rows,setRows]=useState(10),[cols,setCols]=useState(10),[cell,setCell]=useState(64),[step,setStep]=useState(1),[blanks,setBlanks]=useState(0),[seed,setSeed]=useState(1);const svg=useRef<SVGSVGElement>(null);const values=useMemo(()=>{const count=Math.min(rows*cols,500),out:Array<number|null>=[];for(let i=0;i<count;i++){const value=start+i*step;out.push((step>0?value<=end:value>=end)?value:null)}const candidates=out.map((v,i)=>v===null?-1:i).filter(i=>i>=0);for(let i=0;i<Math.min(blanks,candidates.length);i++){const p=(seed*31+i*47)%candidates.length;out[candidates[p]]=null}return out},[start,end,rows,cols,step,blanks,seed]);const width=cols*cell,height=rows*cell;return <Workbench status={`${values.filter(v=>v!==null).length} numbered cells`} controls={<div className="space-y-4"><div className="grid grid-cols-2 gap-3"><Field label="Start"><input className={input} type="number" value={start} onChange={e=>setStart(+e.target.value)}/></Field><Field label="End"><input className={input} type="number" value={end} onChange={e=>setEnd(+e.target.value)}/></Field><Field label="Rows"><input className={input} type="number" min="1" max="30" value={rows} onChange={e=>setRows(Math.max(1,Math.min(30,+e.target.value||1)))}/></Field><Field label="Columns"><input className={input} type="number" min="1" max="30" value={cols} onChange={e=>setCols(Math.max(1,Math.min(30,+e.target.value||1)))}/></Field><Field label="Cell size"><input className={input} type="number" min="32" max="120" value={cell} onChange={e=>setCell(Math.max(32,Math.min(120,+e.target.value||32)))}/></Field><Field label="Sequence step"><input className={input} type="number" min="-100" max="100" value={step} onChange={e=>setStep(+e.target.value||1)}/></Field><Field label="Blank cells"><input className={input} type="number" min="0" max={rows*cols} value={blanks} onChange={e=>setBlanks(Math.max(0,Math.min(rows*cols,+e.target.value||0)))}/></Field></div><button className={secondary} onClick={()=>setSeed(v=>v+1)}>Shuffle blanks</button><p className="text-xs leading-5 text-slate-500">Rows × columns is capped at 500 rendered cells. Values outside the selected end are left blank.</p></div>}><div className="overflow-auto rounded-2xl bg-slate-100 p-4"><svg ref={svg} width={width} height={height} viewBox={`0 0 ${width} ${height}`} className="mx-auto h-auto max-w-full bg-white" xmlns="http://www.w3.org/2000/svg">{values.map((value,i)=>{const x=(i%cols)*cell,y=Math.floor(i/cols)*cell;return <g key={i}><rect x={x} y={y} width={cell} height={cell} fill="white" stroke="#64748b"/><text x={x+cell/2} y={y+cell/2+7} textAnchor="middle" fontFamily="Arial" fontSize={Math.min(22,cell*.36)} fill="#0f172a">{value}</text></g>})}</svg></div><ExportButtons svg={svg} name="number-grid"/></Workbench>}

export type NumberChartKind = "100" | "99" | "120" | "multiply" | "empty" | "missing";

const numberChartLinks: Array<{ href: string; label: string; kind: NumberChartKind }> = [
  { href: "/printable-number-charts", label: "1–100 chart", kind: "100" },
  { href: "/blank-number-chart", label: "Blank chart", kind: "empty" },
  { href: "/missing-numbers-chart", label: "Missing numbers", kind: "missing" },
  { href: "/number-chart-120", label: "1–120 chart", kind: "120" },
];

export function NumberChartTool({ presetKind }: { presetKind?: NumberChartKind }) {
  const [kind, setKind] = useState<NumberChartKind>(presetKind ?? "100");
  const [highlight, setHighlight] = useState("5,10");
  const [shade, setShade] = useState(0);
  const [paper, setPaper] = useState<PaperKind>("a4");
  const [orientation, setOrientation] = useState<Orientation>("portrait");
  const [gapPercent, setGapPercent] = useState(30);
  const [gapSeed, setGapSeed] = useState(1);
  const [heading, setHeading] = useState("");
  const [showNameDate, setShowNameDate] = useState(false);
  const svg = useRef<SVGSVGElement>(null);
  const answerSvg = useRef<SVGSVGElement>(null);
  const count = kind === "120" ? 120 : 100;
  const cols = kind === "multiply" ? 11 : 10;
  const rows = kind === "multiply" ? 11 : Math.ceil(count / 10);
  const highlights = useMemo(() => new Set(highlight.split(",").map(Number).filter(Number.isFinite)), [highlight]);
  // Missing-numbers cells are chosen by a seeded random draw, so the same
  // gap percentage and shuffle produce the same worksheet.
  const missing = useMemo(() => {
    if (kind !== "missing") return new Set<number>();
    const random = createSeededRandom(`missing-numbers\u001f${gapPercent}\u001f${gapSeed}`);
    const hidden = new Set<number>();
    for (let value = 1; value <= 100; value += 1) if (random() * 100 < gapPercent) hidden.add(value);
    return hidden;
  }, [kind, gapPercent, gapSeed]);
  const [pw, ph] = paperMillimeters[paper];
  const width = (orientation === "portrait" ? pw : ph) * 5;
  const height = (orientation === "portrait" ? ph : pw) * 5;
  const margin = 55;
  const gridTop = showNameDate ? 118 : 80;
  const cell = Math.min((width - margin * 2) / cols, (height - margin * 2 - gridTop) / rows);
  const defaultTitle = kind === "multiply" ? "Multiplication Chart" : kind === "empty" ? "Empty Number Chart" : kind === "99" ? "0–99 Number Chart" : kind === "missing" ? "Missing Numbers Chart" : `1–${count} Number Chart`;
  const title = heading.trim() || defaultTitle;
  const chartCells = Array.from({ length: rows * cols }, (_, i) => {
    const r = Math.floor(i / cols), c = i % cols;
    const value = kind === "multiply" ? (r === 0 && c === 0 ? "×" : r === 0 ? c : c === 0 ? r : r * c) : kind === "99" ? i : i + 1;
    return { r, c, value };
  });
  const cellFill = (value: number | string, r: number, c: number) => typeof value === "number" && highlights.has(value) ? "#fde68a" : kind === "multiply" && (r === 0 || c === 0) ? "#dbeafe" : typeof value === "number" && shade > 0 && value % shade === 0 ? "#e5e7eb" : "white";
  const renderChart = (showAll: boolean, ref: React.RefObject<SVGSVGElement | null>, keyLabel: string) => (
    <svg ref={ref} width={width} height={height} viewBox={`0 0 ${width} ${height}`} className="mx-auto h-auto max-h-[760px] max-w-full bg-white shadow" xmlns="http://www.w3.org/2000/svg">
      <text x={width / 2} y={55} textAnchor="middle" fontFamily="Arial" fontWeight="bold" fontSize="28">{showAll && kind === "missing" ? `${title} — Answer key` : title}</text>
      {showNameDate && <text x={margin} y={92} fontFamily="Arial" fontSize="20" fill="#0f172a">Name: ____________________      Date: ____________</text>}
      {chartCells.map(({ r, c, value }) => {
        const hidden = !showAll && kind === "missing" && typeof value === "number" && missing.has(value);
        const display = kind === "empty" || hidden ? "" : value;
        return <g key={`${keyLabel}-${r}-${c}`}>
          <rect x={margin + c * cell} y={gridTop + r * cell} width={cell} height={cell} fill={hidden ? "#f1f5f9" : cellFill(value, r, c)} stroke="#475569" />
          <text x={margin + c * cell + cell / 2} y={gridTop + r * cell + cell / 2 + 6} textAnchor="middle" fontFamily="Arial" fontSize={Math.min(20, cell * 0.35)}>{display}</text>
        </g>;
      })}
    </svg>
  );
  const activeKind = presetKind ?? "100";
  return <>
    <nav aria-label="Number chart types" className="mb-6 flex flex-wrap gap-2">
      <span className="py-2 text-sm font-semibold text-slate-700">More charts:</span>
      {numberChartLinks.map((link) => (
        <Link key={link.href} href={link.href} aria-current={link.kind === activeKind ? "page" : undefined} className={link.kind === activeKind ? "rounded-full bg-brand-blue px-4 py-2 text-sm font-semibold text-white" : "rounded-full bg-white px-4 py-2 text-sm font-semibold text-brand-blue shadow-sm hover:bg-blue-100"}>{link.label}</Link>
      ))}
    </nav>
    <Workbench status={`${paper.toUpperCase()} ${orientation}${kind === "missing" ? ` · ${missing.size} missing numbers` : ""}`} controls={<div className="space-y-4">
      <Field label="Chart type"><select className={input} value={kind} onChange={e => setKind(e.target.value as NumberChartKind)}><option value="100">1–100 chart</option><option value="99">0–99 chart</option><option value="120">1–120 chart</option><option value="multiply">Multiplication chart</option><option value="empty">Empty 100 chart</option><option value="missing">Missing numbers chart</option></select></Field>
      <Field label="Custom heading (up to 40 characters)"><input className={input} value={heading} maxLength={40} onChange={e => setHeading(e.target.value)} placeholder={defaultTitle} /></Field>
      <label className="flex items-center gap-2 text-sm font-semibold text-slate-700"><input type="checkbox" checked={showNameDate} onChange={e => setShowNameDate(e.target.checked)} /> Add name and date lines</label>
      {kind === "missing" && <>
        <Field label={`Missing numbers — ${gapPercent}% of cells blank`}><input className={input} type="range" min="10" max="90" step="5" value={gapPercent} onChange={e => setGapPercent(+e.target.value)} /></Field>
        <button className={secondary} onClick={() => setGapSeed(v => v + 1)}>Shuffle missing numbers</button>
        <p className="text-xs leading-5 text-slate-500">The answer key below shows the complete chart, so you can hand out the worksheet and keep the solution.</p>
      </>}
      <Field label="Highlight numbers"><input className={input} value={highlight} onChange={e => setHighlight(e.target.value)} placeholder="5, 10, 25" /></Field>
      <Field label="Shade multiples of"><select className={input} value={shade} onChange={e => setShade(+e.target.value)}><option value={0}>Off</option><option value={2}>2</option><option value={3}>3</option><option value={4}>4</option><option value={5}>5</option><option value={10}>10</option></select></Field>
      <div className="grid grid-cols-2 gap-3">
        <Field label="Paper"><select className={input} value={paper} onChange={e => setPaper(e.target.value as PaperKind)}><option value="a4">A4</option><option value="letter">US Letter</option><option value="a3">A3</option><option value="legal">US Legal</option></select></Field>
        <Field label="Orientation"><select className={input} value={orientation} onChange={e => setOrientation(e.target.value as Orientation)}><option>portrait</option><option>landscape</option></select></Field>
      </div>
    </div>}>
      <div className="overflow-auto rounded-2xl bg-slate-100 p-4">{renderChart(false, svg, "chart")}</div>
      <ExportButtons svg={svg} name="printable-number-chart" />
      {kind === "missing" && <div className="mt-8 border-t-2 pt-6">
        <h3 className="text-xl font-semibold">Answer key — keep this page</h3>
        <p className="mt-1 text-sm text-slate-500">The complete chart for the missing-numbers worksheet above.</p>
        <div className="mt-4 overflow-auto rounded-2xl bg-slate-100 p-4">{renderChart(true, answerSvg, "key")}</div>
        <ExportButtons svg={answerSvg} name="missing-numbers-answer-key" />
      </div>}
    </Workbench>
  </>;
}

function SudokuGrid({ board, size = 540 }: { board: number[][]; size?: number }) {
  const n = board.length as SudokuSize;
  const [boxRows, boxCols] = sudokuBoxDimensions[n];
  const cell = size / n;
  const thickVertical = Array.from({ length: n / boxCols + 1 }, (_, i) => i * boxCols);
  const thickHorizontal = Array.from({ length: n / boxRows + 1 }, (_, i) => i * boxRows);
  return <>
    {board.flatMap((row, r) => row.map((value, c) => <g key={`${r}-${c}`}>
      <rect x={c * cell} y={r * cell} width={cell} height={cell} fill="white" stroke="#94a3b8" strokeWidth="1" />
      <text x={c * cell + cell / 2} y={r * cell + cell * 0.68} textAnchor="middle" fontFamily="Arial" fontSize={cell * 0.5}>{value || ""}</text>
    </g>))}
    {thickVertical.map(i => <g key={`v${i}`}><line x1={i * cell} y1="0" x2={i * cell} y2={size} stroke="#0f172a" strokeWidth="4" /></g>)}
    {thickHorizontal.map(i => <g key={`h${i}`}><line x1="0" y1={i * cell} x2={size} y2={i * cell} stroke="#0f172a" strokeWidth="4" /></g>)}
  </>;
}

const sudokuDifficulties: SudokuDifficulty[] = ["easy", "medium", "hard", "expert"];
const sudokuSizes: SudokuSize[] = [4, 6, 9];

function clueDisplay(size: SudokuSize, difficulty: SudokuDifficulty) {
  // 9x9 expert measured 24–26 clues over 60 puzzles; every other
  // combination lands exactly on its target (see lib/stage5-tools.ts).
  return size === 9 && difficulty === "expert" ? "24–26" : String(sudokuClueTargets[size][difficulty]);
}

export function SudokuTool() {
  const [difficulty, setDifficulty] = useState<SudokuDifficulty>("medium");
  const [size, setSize] = useState<SudokuSize>(9);
  const [seed, setSeed] = useState("classroom-1");
  const [count, setCount] = useState(1);
  const [perPage, setPerPage] = useState(1);
  const [showAnswer, setShowAnswer] = useState(true);
  const [version, setVersion] = useState(0);
  const [playIndex, setPlayIndex] = useState(0);
  const [linkStatus, setLinkStatus] = useState("");
  const svg = useRef<SVGSVGElement>(null);
  const answerSvg = useRef<SVGSVGElement>(null);
  const puzzles = useMemo(() => Array.from({ length: count }, (_, i) => generateSudokuPuzzle(`${seed}-${version}-${i}`, difficulty, size)), [seed, version, count, difficulty, size]);
  const safePlayIndex = Math.min(playIndex, puzzles.length - 1);
  const playPuzzle = puzzles[safePlayIndex];
  // The per-puzzle seed string does not include difficulty or size, so the
  // play-reset effect keys on the full combination instead.
  const playKey = `${size}-${difficulty}-${seed}-${version}-${safePlayIndex}`;

  // A ?sudoku=<id> link restores the exact puzzle it was copied from.
  useEffect(() => {
    const id = new URLSearchParams(window.location.search).get("sudoku");
    if (!id) return;
    const decoded = decodeSudokuId(id);
    if (!decoded) return;
    setSize(decoded.size);
    setDifficulty(decoded.difficulty);
    setSeed(decoded.seed);
    setVersion(decoded.version);
    setCount(Math.max(decoded.index + 1, 1));
    setPlayIndex(decoded.index);
  }, []);

  const copyPuzzleLink = () => {
    const id = encodeSudokuId(size, difficulty, seed, version, safePlayIndex);
    const url = `${window.location.origin}${window.location.pathname}?sudoku=${id}`;
    navigator.clipboard.writeText(url).then(() => setLinkStatus(`Link copied — puzzle ID ${id}`)).catch(() => setLinkStatus(`Copy this link: ${url}`));
  };

  // --- Printable layout: puzzles grouped into pages of `perPage` ---
  const gridSize = perPage === 6 ? 360 : 540;
  const pageCols = perPage === 1 ? 1 : perPage === 2 ? 2 : perPage === 4 ? 2 : 3;
  const pageRows = Math.ceil(perPage / pageCols);
  const pageHeight = pageRows * (gridSize + 60) + 20;
  const pages: (typeof puzzles)[] = [];
  for (let i = 0; i < puzzles.length; i += perPage) pages.push(puzzles.slice(i, i + perPage));
  const totalHeight = pages.length * pageHeight;
  const puzzlePosition = (indexInPage: number) => {
    const col = indexInPage % pageCols;
    const row = Math.floor(indexInPage / pageCols);
    return { x: 30 + col * (gridSize + 40), y: row * (gridSize + 60) + 55 };
  };
  const renderPuzzleSheet = (boards: "puzzle" | "solution", ref: React.RefObject<SVGSVGElement | null>) => (
    <svg ref={ref} width="1200" height={totalHeight} viewBox={`0 0 1200 ${totalHeight}`} className="mx-auto h-auto max-w-full bg-white" xmlns="http://www.w3.org/2000/svg">
      {pages.map((page, pageIndex) => <g key={pageIndex} transform={`translate(0 ${pageIndex * pageHeight})`}>
        <text x="30" y="24" fontFamily="Arial" fontWeight="bold" fontSize="20" fill="#64748b">{boards === "puzzle" ? `Puzzles — page ${pageIndex + 1} of ${pages.length}` : `Answer pages — page ${pageIndex + 1} of ${pages.length}`}</text>
        {page.map((p, i) => {
          const pos = puzzlePosition(i);
          const globalIndex = pageIndex * perPage + i;
          return <g key={p.seed} transform={`translate(${pos.x} ${pos.y})`}>
            <text x={gridSize / 2} y="-12" textAnchor="middle" fontFamily="Arial" fontWeight="bold" fontSize="22">{boards === "puzzle" ? `Puzzle ${globalIndex + 1}` : `Answer key ${globalIndex + 1}`} · {size}×{size} · {difficulty} · {clueDisplay(size, difficulty)} clues</text>
            <SudokuGrid board={boards === "puzzle" ? p.puzzle : p.solution} size={gridSize} />
          </g>;
        })}
      </g>)}
    </svg>
  );

  // --- On-screen solving for the selected puzzle ---
  const [entries, setEntries] = useState<number[][]>([]);
  const [notes, setNotes] = useState<number[][][]>([]);
  const [selected, setSelected] = useState<[number, number] | null>(null);
  const [notesMode, setNotesMode] = useState(false);
  const [mistakes, setMistakes] = useState(0);
  const [wrongCells, setWrongCells] = useState<Set<string>>(new Set());
  const [history, setHistory] = useState<Array<{ entries: number[][]; notes: number[][][] }>>([]);
  const [solvedMessage, setSolvedMessage] = useState("");
  // Reset the on-screen game when the played puzzle changes. playKey
  // encodes the puzzle identity (size, difficulty, seed, version, index);
  // depending on playPuzzle itself would also reset whenever the set grows.
  useEffect(() => {
    if (!playPuzzle) return;
    setEntries(playPuzzle.puzzle.map((row) => [...row]));
    setNotes(playPuzzle.puzzle.map((row) => row.map(() => [])));
    setSelected(null);
    setMistakes(0);
    setWrongCells(new Set());
    setHistory([]);
    setSolvedMessage("");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [playKey]);
  const isGiven = (r: number, c: number) => Boolean(playPuzzle?.puzzle[r]?.[c]);
  const pushHistory = () => setHistory((h) => [...h.slice(-49), { entries: entries.map((row) => [...row]), notes: notes.map((row) => row.map((cell) => [...cell])) }]);
  const enterDigit = (digit: number) => {
    if (!selected || !playPuzzle) return;
    const [r, c] = selected;
    if (isGiven(r, c)) return;
    pushHistory();
    if (notesMode) {
      setNotes((current) => current.map((row, ri) => row.map((cell, ci) => ri === r && ci === c ? (cell.includes(digit) ? cell.filter((d) => d !== digit) : [...cell, digit]) : cell)));
      return;
    }
    const correct = playPuzzle.solution[r][c] === digit;
    if (!correct) setMistakes((m) => m + 1);
    setEntries((current) => current.map((row, ri) => row.map((value, ci) => ri === r && ci === c ? digit : value)));
    setNotes((current) => current.map((row, ri) => row.map((cell, ci) => ri === r && ci === c ? [] : cell)));
    setWrongCells((current) => {
      const next = new Set(current);
      if (correct) next.delete(`${r}-${c}`); else next.add(`${r}-${c}`);
      return next;
    });
  };
  const eraseCell = () => {
    if (!selected || !playPuzzle) return;
    const [r, c] = selected;
    if (isGiven(r, c)) return;
    pushHistory();
    setEntries((current) => current.map((row, ri) => row.map((value, ci) => ri === r && ci === c ? 0 : value)));
    setNotes((current) => current.map((row, ri) => row.map((cell, ci) => ri === r && ci === c ? [] : cell)));
    setWrongCells((current) => { const next = new Set(current); next.delete(`${r}-${c}`); return next; });
  };
  const undoPlay = () => setHistory((h) => {
    const last = h.at(-1);
    if (last) { setEntries(last.entries.map((row) => [...row])); setNotes(last.notes.map((row) => row.map((cell) => [...cell]))); }
    return h.slice(0, -1);
  });
  const checkPlay = () => {
    if (!playPuzzle) return;
    const wrong = new Set<string>();
    entries.forEach((row, r) => row.forEach((value, c) => { if (value && value !== playPuzzle.solution[r][c]) wrong.add(`${r}-${c}`); }));
    setWrongCells(wrong);
    setSolvedMessage(wrong.size ? `${wrong.size} cell${wrong.size === 1 ? " is" : "s are"} wrong — highlighted in red.` : "No wrong entries so far.");
  };
  const solved = Boolean(playPuzzle) && entries.length > 0 && entries.every((row, r) => row.every((value, c) => value === playPuzzle.solution[r][c]));
  const [boxRows, boxCols] = sudokuBoxDimensions[size];

  return <>
    <Workbench status={`${puzzles.length} unique-solution ${difficulty} puzzle${count > 1 ? "s" : ""} · ${size}×${size}`} controls={<div className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <Field label="Grid size"><select className={input} value={size} onChange={e => { const next = +e.target.value as SudokuSize; setSize(next); setPlayIndex(0); }}><option value={4}>4 × 4 — kids</option><option value={6}>6 × 6 — classroom</option><option value={9}>9 × 9 — classic</option></select></Field>
        <Field label="Difficulty"><select className={input} value={difficulty} onChange={e => setDifficulty(e.target.value as SudokuDifficulty)}>{sudokuDifficulties.map(d => <option key={d}>{d}</option>)}</select></Field>
      </div>
      <Field label="Deterministic seed"><input className={input} value={seed} maxLength={60} onChange={e => setSeed(e.target.value || "puzzle")} /></Field>
      <div className="grid grid-cols-2 gap-3">
        <Field label="Puzzles in set"><input className={input} type="number" min="1" max="6" value={count} onChange={e => setCount(Math.max(1, Math.min(6, +e.target.value || 1)))} /></Field>
        <Field label="Puzzles per page"><select className={input} value={perPage} onChange={e => setPerPage(+e.target.value)}><option value={1}>1</option><option value={2}>2</option><option value={4}>4</option><option value={6}>6</option></select></Field>
      </div>
      <label className="flex items-center gap-2"><input type="checkbox" checked={showAnswer} onChange={e => setShowAnswer(e.target.checked)} /> Show separate answer pages</label>
      <div className="flex flex-wrap gap-2">
        <button className={primary} onClick={() => setVersion(v => v + 1)}>Regenerate puzzles</button>
        <button className={secondary} onClick={copyPuzzleLink}>Copy puzzle link</button>
      </div>
      {linkStatus && <p className="break-all text-xs leading-5 text-emerald-700" role="status">{linkStatus}</p>}
      <p className="text-xs leading-5 text-slate-500">Each puzzle is checked by a solution counter before display. Reusing the same seed and options reproduces the same puzzle — the link above opens this exact puzzle for anyone who follows it.</p>
    </div>}>
      <div className="overflow-auto">{renderPuzzleSheet("puzzle", svg)}</div>
      <ExportButtons svg={svg} name="sudoku-worksheet" />
      {showAnswer && <div className="mt-8 border-t-2 pt-6">
        <h3 className="text-xl font-semibold">Answer pages — separate download</h3>
        <p className="mt-1 text-sm text-slate-500">Solutions are kept apart from the puzzles so you can print the worksheet and keep the answers.</p>
        <div className="mt-4 overflow-auto">{renderPuzzleSheet("solution", answerSvg)}</div>
        <ExportButtons svg={answerSvg} name="sudoku-answers" />
      </div>}
    </Workbench>

    {playPuzzle && <section className="mt-8 rounded-[28px] border border-slate-200 bg-white p-5 shadow-card sm:p-6">
      <h2 className="text-xl font-semibold">Play on screen</h2>
      <p className="mt-1 text-sm text-slate-500">Solve puzzle {safePlayIndex + 1} here — click a cell, then a number. Notes, undo, and a mistake count are included; there are no hints and no timer.</p>
      {count > 1 && <div className="mt-3 flex flex-wrap gap-2">{puzzles.map((_, i) => <button key={i} className={i === safePlayIndex ? primary : secondary} onClick={() => setPlayIndex(i)}>Puzzle {i + 1}</button>)}</div>}
      <div className="mt-5 grid gap-6 lg:grid-cols-[minmax(0,1fr)_220px]">
        <div className="overflow-x-auto">
          <div className="grid w-fit gap-0 border-2 border-slate-900" style={{ gridTemplateColumns: `repeat(${size}, minmax(34px, 52px))` }}>
            {entries.map((row, r) => row.map((value, c) => {
              const given = isGiven(r, c);
              const isSelected = selected?.[0] === r && selected?.[1] === c;
              const inSameUnit = selected !== null && (selected[0] === r || selected[1] === c || (Math.floor(selected[0] / boxRows) === Math.floor(r / boxRows) && Math.floor(selected[1] / boxCols) === Math.floor(c / boxCols)));
              const wrong = wrongCells.has(`${r}-${c}`);
              return <button key={`${r}-${c}`} type="button" aria-label={`Row ${r + 1} column ${c + 1}${value ? `, ${value}` : ", empty"}`} onClick={() => setSelected([r, c])} className={`relative flex aspect-square items-center justify-center border text-lg font-bold ${given ? "bg-slate-100 text-slate-900" : "text-brand-blue"} ${isSelected ? "bg-blue-200" : inSameUnit ? "bg-blue-50" : "bg-white"} ${wrong ? "text-red-600" : ""} ${(c + 1) % boxCols === 0 && c + 1 < size ? "border-r-2 border-r-slate-900" : "border-slate-300"} ${(r + 1) % boxRows === 0 && r + 1 < size ? "border-b-2 border-b-slate-900" : "border-slate-300"}`}>
                {value || (notes[r]?.[c]?.length ? <span className="grid w-full grid-cols-3 p-0.5 text-[9px] font-semibold leading-none text-slate-500">{Array.from({ length: size }, (_, d) => <span key={d} className="text-center">{notes[r][c].includes(d + 1) ? d + 1 : ""}</span>)}</span> : "")}
              </button>;
            }))}
          </div>
        </div>
        <div>
          <div className="grid grid-cols-3 gap-2">
            {Array.from({ length: size }, (_, i) => <button key={i} className={secondary} onClick={() => enterDigit(i + 1)}>{i + 1}</button>)}
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            <button className={notesMode ? primary : secondary} aria-pressed={notesMode} onClick={() => setNotesMode(v => !v)}>Notes {notesMode ? "on" : "off"}</button>
            <button className={secondary} onClick={eraseCell}>Erase</button>
            <button className={secondary} disabled={!history.length} onClick={undoPlay}>Undo</button>
            <button className={secondary} onClick={checkPlay}>Check</button>
          </div>
          <p className="mt-4 text-sm text-slate-600" role="status">Mistakes: {mistakes}</p>
          {solvedMessage && <p className="mt-1 text-sm text-slate-600">{solvedMessage}</p>}
          {solved && <p className="mt-2 rounded-xl bg-emerald-50 p-3 text-sm font-semibold text-emerald-700" role="status">Solved — every cell matches the solution.</p>}
        </div>
      </div>
    </section>}

    <section className="mt-8 overflow-x-auto rounded-[28px] border border-slate-200 bg-white p-5 shadow-card sm:p-6">
      <h2 className="text-xl font-semibold">How many clues does each puzzle have?</h2>
      <p className="mt-1 text-sm text-slate-500">Clue counts are the exact numbers this generator produces — measured on 10 November 2026 (20 puzzles per combination; 60 for 9×9 expert). Expert 9×9 varies between 24 and 26 clues.</p>
      <table className="mt-4 w-full min-w-[520px] border-collapse text-sm">
        <thead><tr className="border-b text-left"><th className="py-2 pr-3">Grid</th>{sudokuDifficulties.map(d => <th key={d} className="py-2 pr-3 capitalize">{d}</th>)}</tr></thead>
        <tbody>{sudokuSizes.map(s => <tr key={s} className="border-b"><td className="py-2 pr-3 font-semibold">{s} × {s}</td>{sudokuDifficulties.map(d => <td key={d} className="py-2 pr-3">{clueDisplay(s, d)} clues</td>)}</tr>)}</tbody>
      </table>
    </section>
  </>;
}

export function BlankTableTool(){const [rows,setRows]=useState(8),[cols,setCols]=useState(5),[cellW,setCellW]=useState(100),[cellH,setCellH]=useState(54),[headers,setHeaders]=useState(1),[border,setBorder]=useState("#334155"),[headerColor,setHeaderColor]=useState("#dbeafe"),[paper,setPaper]=useState<PaperKind>("a4"),[orientation,setOrientation]=useState<Orientation>("portrait");const svg=useRef<SVGSVGElement>(null),[pw,ph]=paperMillimeters[paper],width=(orientation==="portrait"?pw:ph)*5,height=(orientation==="portrait"?ph:pw)*5,totalW=cols*cellW,totalH=rows*cellH,x=(width-totalW)/2,y=100;const fits=totalW<=width-40&&totalH<=height-140;return <Workbench status={fits?`${paper.toUpperCase()} page fit verified`:"Table exceeds the printable page; reduce cells or use landscape."} controls={<div className="space-y-4"><div className="grid grid-cols-2 gap-3"><Field label="Rows"><input className={input} type="number" min="1" max="30" value={rows} onChange={e=>setRows(Math.max(1,Math.min(30,+e.target.value||1)))}/></Field><Field label="Columns"><input className={input} type="number" min="1" max="20" value={cols} onChange={e=>setCols(Math.max(1,Math.min(20,+e.target.value||1)))}/></Field><Field label="Cell width"><input className={input} type="number" min="35" max="180" value={cellW} onChange={e=>setCellW(Math.max(35,Math.min(180,+e.target.value||35)))}/></Field><Field label="Cell height"><input className={input} type="number" min="28" max="140" value={cellH} onChange={e=>setCellH(Math.max(28,Math.min(140,+e.target.value||28)))}/></Field><Field label="Header rows"><input className={input} type="number" min="0" max={rows} value={headers} onChange={e=>setHeaders(Math.max(0,Math.min(rows,+e.target.value||0)))}/></Field><Field label="Border"><input className={`${input} h-11`} type="color" value={border} onChange={e=>setBorder(e.target.value)}/></Field><Field label="Header color"><input className={`${input} h-11`} type="color" value={headerColor} onChange={e=>setHeaderColor(e.target.value)}/></Field><Field label="Paper"><select className={input} value={paper} onChange={e=>setPaper(e.target.value as PaperKind)}><option value="a4">A4</option><option value="letter">US Letter</option></select></Field></div><Field label="Orientation"><select className={input} value={orientation} onChange={e=>setOrientation(e.target.value as Orientation)}><option>portrait</option><option>landscape</option></select></Field></div>}><div className="overflow-auto rounded-2xl bg-slate-100 p-4"><svg ref={svg} width={width} height={height} className="mx-auto h-auto max-h-[760px] max-w-full bg-white shadow" xmlns="http://www.w3.org/2000/svg"><text x={width/2} y="55" textAnchor="middle" fontFamily="Arial" fontWeight="bold" fontSize="26">Blank Table</text>{Array.from({length:rows*cols},(_,i)=>{const r=Math.floor(i/cols),c=i%cols;return <rect key={i} x={x+c*cellW} y={y+r*cellH} width={cellW} height={cellH} fill={r<headers?headerColor:"white"} stroke={border} strokeWidth="2"/>})}</svg></div><ExportButtons svg={svg} name="blank-table"/></Workbench>}

type Shape={id:number;kind:"line"|"arrow"|"rect"|"circle"|"text"|"path";x1:number;y1:number;x2:number;y2:number;color:string;width:number;text?:string;points?:string};
export function VirtualGraphPaperTool(){const [tool,setTool]=useState<"pencil"|"eraser"|"line"|"arrow"|"rect"|"circle"|"text"|"pan">("pencil"),[grid,setGrid]=useState<"square"|"dot"|"isometric">("square"),[color,setColor]=useState("#1d4ed8"),[width,setWidth]=useState(4),[snap,setSnap]=useState(true),[zoom,setZoom]=useState(1),[shapes,setShapes]=useState<Shape[]>([]),[redo,setRedo]=useState<Shape[]>([]),[draft,setDraft]=useState<Shape|null>(null);const svg=useRef<SVGSVGElement>(null),start=useRef<{x:number;y:number}|null>(null),id=useRef(1);useEffect(()=>{try{const saved=localStorage.getItem("virtual-graph-paper-v1");if(saved)setShapes(JSON.parse(saved))}catch{}},[]);useEffect(()=>{localStorage.setItem("virtual-graph-paper-v1",JSON.stringify(shapes))},[shapes]);const point=(e:ReactPointerEvent<SVGSVGElement>)=>{const rect=e.currentTarget.getBoundingClientRect();let x=(e.clientX-rect.left)*1000/rect.width,y=(e.clientY-rect.top)*700/rect.height;if(snap){x=Math.round(x/20)*20;y=Math.round(y/20)*20}return{x,y}};const down=(e:ReactPointerEvent<SVGSVGElement>)=>{e.currentTarget.setPointerCapture(e.pointerId);const p=point(e);if(tool==="eraser"){const target=(e.target as Element).closest("[data-shape]");if(target)setShapes(s=>s.filter(x=>x.id!==Number(target.getAttribute("data-shape"))));return}if(tool==="text"){const text=prompt("Label text");if(text)setShapes(s=>[...s,{id:id.current++,kind:"text",x1:p.x,y1:p.y,x2:p.x,y2:p.y,color,width,text:text.slice(0,120)}]);return}if(tool==="pan")return;start.current=p;const kind=tool==="pencil"?"path":tool;setDraft({id:id.current++,kind,x1:p.x,y1:p.y,x2:p.x,y2:p.y,color,width,points:`${p.x},${p.y}`});setRedo([])};const move=(e:ReactPointerEvent<SVGSVGElement>)=>{if(!start.current||!draft)return;const p=point(e);setDraft(d=>d?{...d,x2:p.x,y2:p.y,points:d.kind==="path"?`${d.points} ${p.x},${p.y}`:d.points}:d)};const up=()=>{if(draft)setShapes(s=>[...s,draft]);setDraft(null);start.current=null};const undo=()=>setShapes(s=>{const last=s.at(-1);if(last)setRedo(r=>[...r,last]);return s.slice(0,-1)}),redoOne=()=>setRedo(r=>{const last=r.at(-1);if(last)setShapes(s=>[...s,last]);return r.slice(0,-1)});const displayed=draft?[...shapes,draft]:shapes;return <Workbench status={`${shapes.length} object${shapes.length===1?"":"s"} · autosaved locally`} controls={<div className="space-y-4"><Field label="Grid style"><select className={input} value={grid} onChange={e=>setGrid(e.target.value as typeof grid)}><option>square</option><option>dot</option><option>isometric</option></select></Field><div className="grid grid-cols-2 gap-2">{(["pencil","eraser","line","arrow","rect","circle","text","pan"]as const).map(t=><button key={t} className={tool===t?primary:secondary} onClick={()=>setTool(t)}>{t[0].toUpperCase()+t.slice(1)}</button>)}</div><div className="grid grid-cols-2 gap-3"><Field label="Line color"><input className={`${input} h-11`} type="color" value={color} onChange={e=>setColor(e.target.value)}/></Field><Field label="Width"><input className={input} type="range" min="1" max="16" value={width} onChange={e=>setWidth(+e.target.value)}/></Field></div><label className="flex gap-2"><input type="checkbox" checked={snap} onChange={e=>setSnap(e.target.checked)}/> Snap to grid</label><Field label={`Zoom ${Math.round(zoom*100)}%`}><input className={input} type="range" min=".5" max="2" step=".1" value={zoom} onChange={e=>setZoom(+e.target.value)}/></Field><div className="flex flex-wrap gap-2"><button className={secondary} disabled={!shapes.length} onClick={undo}>Undo</button><button className={secondary} disabled={!redo.length} onClick={redoOne}>Redo</button><button className={secondary} onClick={()=>{setShapes([]);setRedo([])}}>Clear</button></div></div>}><div className="overflow-auto rounded-2xl bg-slate-100 p-3"><svg ref={svg} width="1000" height="700" viewBox={`0 0 ${1000/zoom} ${700/zoom}`} onPointerDown={down} onPointerMove={move} onPointerUp={up} onPointerCancel={up} className="mx-auto h-auto min-w-[600px] touch-none bg-white" xmlns="http://www.w3.org/2000/svg"><defs><pattern id="square-grid" width="20" height="20" patternUnits="userSpaceOnUse"><path d="M20 0H0V20" fill="none" stroke="#cbd5e1"/></pattern><pattern id="dot-grid" width="20" height="20" patternUnits="userSpaceOnUse"><circle cx="1" cy="1" r="1.5" fill="#94a3b8"/></pattern><pattern id="iso-grid" width="40" height="34.64" patternUnits="userSpaceOnUse"><path d="M0 0L40 0M0 0L40 34.64M40 0L0 34.64" stroke="#d7dee8" strokeWidth="1"/></pattern><marker id="arrowhead" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto"><path d="M0 0L8 4L0 8Z" fill="context-stroke"/></marker></defs><rect width="1000" height="700" fill={`url(#${grid}-grid)`}/>{displayed.map(s=>s.kind==="path"?<polyline key={s.id} data-shape={s.id} points={s.points} fill="none" stroke={s.color} strokeWidth={s.width} strokeLinecap="round" strokeLinejoin="round"/>:s.kind==="rect"?<rect key={s.id} data-shape={s.id} x={Math.min(s.x1,s.x2)} y={Math.min(s.y1,s.y2)} width={Math.abs(s.x2-s.x1)} height={Math.abs(s.y2-s.y1)} fill="none" stroke={s.color} strokeWidth={s.width}/>:s.kind==="circle"?<ellipse key={s.id} data-shape={s.id} cx={(s.x1+s.x2)/2} cy={(s.y1+s.y2)/2} rx={Math.abs(s.x2-s.x1)/2} ry={Math.abs(s.y2-s.y1)/2} fill="none" stroke={s.color} strokeWidth={s.width}/>:s.kind==="text"?<text key={s.id} data-shape={s.id} x={s.x1} y={s.y1} fill={s.color} fontFamily="Arial" fontSize={Math.max(16,s.width*5)}>{s.text}</text>:<line key={s.id} data-shape={s.id} x1={s.x1} y1={s.y1} x2={s.x2} y2={s.y2} stroke={s.color} strokeWidth={s.width} markerEnd={s.kind==="arrow"?"url(#arrowhead)":undefined}/>)}</svg></div><ExportButtons svg={svg} name="virtual-graph-paper" pdf={false}/></Workbench>}

type PixelToolKind = "pencil" | "eraser" | "fill" | "pick";
type PixelSymmetry = "off" | "vertical" | "horizontal" | "both";

const pixelTemplates: Record<string, { label: string; colors: Record<string, string>; rows: string[] }> = {
  heart: {
    label: "Heart",
    colors: { X: "#ef4444" },
    rows: [".XX.XX.", "XXXXXXX", "XXXXXXX", ".XXXXX.", "..XXX..", "...X..."],
  },
  star: {
    label: "Star",
    colors: { X: "#f59e0b" },
    rows: ["....X....", "...XXX...", "...XXX...", "XXXXXXXXX", ".XXXXXXX.", "...XXX...", "...XXX...", "....X....", "....X...."],
  },
  smiley: {
    label: "Smiley",
    colors: { Y: "#facc15", B: "#111827" },
    rows: ["..YYYYY..", ".YYYYYYY.", "YYBYYYBYY", "YYYYYYYYY", "YYYYYYYYY", "YYBBBBBYY", ".YYYYYYY.", "..YYYYY.."],
  },
  sprite: {
    label: "Sprite",
    colors: { X: "#22c55e" },
    rows: ["..X.....X..", "...X...X...", "..XXXXXXX..", ".XX.XXX.XX.", "XXXXXXXXXXX", "X.XXXXXXX.X", "X.X.....X.X", "...XX.XX..."],
  },
};

/** Median-cut palette reduction: split the colour box with the widest channel range until the palette is full. */
function medianCutPalette(colors: Array<[number, number, number]>, maxColors: number) {
  type Box = Array<[number, number, number]>;
  let boxes: Box[] = [colors];
  const rangeOf = (box: Box, channel: number) => {
    let min = 255, max = 0;
    for (const color of box) { min = Math.min(min, color[channel]); max = Math.max(max, color[channel]); }
    return max - min;
  };
  while (boxes.length < maxColors) {
    let splitIndex = -1, splitChannel = 0, splitRange = 0;
    boxes.forEach((box, index) => {
      if (box.length < 2) return;
      for (let channel = 0; channel < 3; channel += 1) {
        const range = rangeOf(box, channel);
        if (range > splitRange) { splitRange = range; splitIndex = index; splitChannel = channel; }
      }
    });
    if (splitIndex < 0) break;
    const box = [...boxes[splitIndex]].sort((a, b) => a[splitChannel] - b[splitChannel]);
    const mid = Math.floor(box.length / 2);
    boxes = [...boxes.slice(0, splitIndex), box.slice(0, mid), box.slice(mid), ...boxes.slice(splitIndex + 1)];
  }
  return boxes.map((box) => {
    const total = box.reduce<[number, number, number]>((sum, color) => [sum[0] + color[0], sum[1] + color[1], sum[2] + color[2]], [0, 0, 0]);
    return total.map((value) => Math.round(value / box.length)) as [number, number, number];
  });
}

function nearestPaletteColor(color: [number, number, number], palette: Array<[number, number, number]>) {
  let best = palette[0], bestDistance = Number.POSITIVE_INFINITY;
  for (const candidate of palette) {
    const distance = (color[0] - candidate[0]) ** 2 + (color[1] - candidate[1]) ** 2 + (color[2] - candidate[2]) ** 2;
    if (distance < bestDistance) { bestDistance = distance; best = candidate; }
  }
  return best;
}

export function PixelArtTool() {
  const [cols, setCols] = useState(24), [rows, setRows] = useState(24), [cells, setCells] = useState(() => Array(24 * 24).fill("#ffffff")), [color, setColor] = useState("#2563eb"), [tool, setTool] = useState<PixelToolKind>("pencil"), [symmetry, setSymmetry] = useState<PixelSymmetry>("off"), [grid, setGrid] = useState(true), [zoom, setZoom] = useState(1), [history, setHistory] = useState<string[][]>([]), [future, setFuture] = useState<string[][]>([]);
  const [pngScale, setPngScale] = useState(20);
  const [transparentBg, setTransparentBg] = useState(false);
  const [exportGridLines, setExportGridLines] = useState(false);
  const [sourceImage, setSourceImage] = useState<HTMLImageElement | null>(null);
  const [convertCols, setConvertCols] = useState(32);
  const [colorDepth, setColorDepth] = useState(16);
  const [convertError, setConvertError] = useState("");
  const [convertStatus, setConvertStatus] = useState("");
  const svg = useRef<SVGSVGElement>(null), drawing = useRef(false);
  useEffect(() => { try { const saved = localStorage.getItem("pixel-art-v1"); if (saved) { const data = JSON.parse(saved); setCols(data.cols); setRows(data.rows); setCells(data.cells); } } catch {} }, []);
  useEffect(() => { localStorage.setItem("pixel-art-v1", JSON.stringify({ cols, rows, cells })); }, [cols, rows, cells]);
  const resize = (c: number, r: number) => { setHistory(h => [...h, cells]); setCols(c); setRows(r); setCells(Array.from({ length: c * r }, (_, i) => i % c < cols && Math.floor(i / c) < rows ? cells[Math.floor(i / c) * cols + i % c] : "#ffffff")); };
  const mirrorIndexes = (index: number) => {
    const col = index % cols, row = Math.floor(index / cols);
    const targets = new Set([index]);
    if (symmetry === "vertical" || symmetry === "both") targets.add(row * cols + (cols - 1 - col));
    if (symmetry === "horizontal" || symmetry === "both") targets.add((rows - 1 - row) * cols + col);
    if (symmetry === "both") targets.add((rows - 1 - row) * cols + (cols - 1 - col));
    return [...targets];
  };
  const paint = (index: number) => {
    setCells(current => {
      let next = [...current];
      for (const target of mirrorIndexes(index)) {
        if (tool === "fill") next = floodFillPixels(next, cols, rows, target, color);
        else next[target] = tool === "eraser" ? "#ffffff" : color;
      }
      return next;
    });
  };
  const begin = (i: number) => { setHistory(h => [...h.slice(-39), cells]); setFuture([]); drawing.current = true; paint(i); };
  const pick = (i: number) => { setColor(cells[i]); setTool("pencil"); };
  const undo = () => setHistory(h => { const last = h.at(-1); if (last) { setFuture(f => [cells, ...f]); setCells(last); } return h.slice(0, -1); }), redo = () => setFuture(f => { const first = f[0]; if (first) { setHistory(h => [...h, cells]); setCells(first); } return f.slice(1); });
  const loadTemplate = (key: string) => {
    const template = pixelTemplates[key];
    const templateCols = template.rows[0].length, templateRows = template.rows.length;
    const next = template.rows.flatMap((row) => [...row].map((char) => template.colors[char] ?? "#ffffff"));
    setHistory(h => [...h.slice(-39), cells]);
    setFuture([]);
    setCols(templateCols); setRows(templateRows); setCells(next);
  };
  const loadSourceImage = (file?: File) => {
    setConvertError(""); setConvertStatus("");
    if (!file) return;
    if (file.size > 10 * 1024 * 1024) { setConvertError("Choose an image smaller than 10 MB."); return; }
    const objectUrl = URL.createObjectURL(file), img = new Image();
    img.onload = () => { setSourceImage(img); URL.revokeObjectURL(objectUrl); setConvertStatus(`Loaded ${img.naturalWidth} × ${img.naturalHeight} — choose a grid size and colour depth, then convert.`); };
    img.onerror = () => setConvertError("The selected file is not a readable image.");
    img.src = objectUrl;
  };
  const convertImage = () => {
    if (!sourceImage) { setConvertError("Upload an image first."); return; }
    const targetCols = convertCols;
    const targetRows = Math.max(4, Math.min(64, Math.round((targetCols * sourceImage.naturalHeight) / sourceImage.naturalWidth)));
    const sample = document.createElement("canvas");
    sample.width = targetCols; sample.height = targetRows;
    const sampleCtx = sample.getContext("2d")!;
    sampleCtx.drawImage(sourceImage, 0, 0, targetCols, targetRows);
    const data = sampleCtx.getImageData(0, 0, targetCols, targetRows).data;
    const samples: Array<[number, number, number]> = [];
    for (let i = 0; i < targetCols * targetRows; i += 1) {
      // Nearly transparent pixels (for example a transparent PNG
      // background) become white instead of black.
      samples.push(data[i * 4 + 3] < 128 ? [255, 255, 255] : [data[i * 4], data[i * 4 + 1], data[i * 4 + 2]]);
    }
    const palette = medianCutPalette(samples, colorDepth);
    const next = samples.map((sampleColor) => {
      const [r, g, b] = nearestPaletteColor(sampleColor, palette);
      return `#${[r, g, b].map((v) => v.toString(16).padStart(2, "0")).join("")}`;
    });
    setHistory(h => [...h.slice(-39), cells]);
    setFuture([]);
    setCols(targetCols); setRows(targetRows); setCells(next);
    setConvertStatus(`Converted to ${targetCols} × ${targetRows} pixels with ${palette.length} colours. You can keep editing it with the drawing tools.`);
  };
  const exportPng = () => {
    const canvas = document.createElement("canvas");
    canvas.width = cols * pngScale; canvas.height = rows * pngScale;
    const ctx = canvas.getContext("2d")!;
    if (!transparentBg) { ctx.fillStyle = "#ffffff"; ctx.fillRect(0, 0, canvas.width, canvas.height); }
    cells.forEach((fill, i) => {
      // With a transparent background, white cells are left unpainted.
      if (transparentBg && fill.toLowerCase() === "#ffffff") return;
      ctx.fillStyle = fill;
      ctx.fillRect((i % cols) * pngScale, Math.floor(i / cols) * pngScale, pngScale, pngScale);
    });
    if (exportGridLines) {
      ctx.strokeStyle = "rgba(100,116,139,0.55)"; ctx.lineWidth = 1;
      for (let c = 0; c <= cols; c += 1) { ctx.beginPath(); ctx.moveTo(c * pngScale + 0.5, 0); ctx.lineTo(c * pngScale + 0.5, canvas.height); ctx.stroke(); }
      for (let r = 0; r <= rows; r += 1) { ctx.beginPath(); ctx.moveTo(0, r * pngScale + 0.5); ctx.lineTo(canvas.width, r * pngScale + 0.5); ctx.stroke(); }
    }
    downloadDataUrl(canvas.toDataURL("image/png"), "pixel-art.png");
  };
  const cell = 24, width = cols * cell, height = rows * cell;
  return <Workbench status={`${cols} × ${rows} pixels · autosaved locally`} controls={<div className="space-y-4">
    <div className="grid grid-cols-2 gap-3">
      <Field label="Columns"><input className={input} type="number" min="4" max="64" value={cols} onChange={e => resize(Math.max(4, Math.min(64, +e.target.value || 4)), rows)} /></Field>
      <Field label="Rows"><input className={input} type="number" min="4" max="64" value={rows} onChange={e => resize(cols, Math.max(4, Math.min(64, +e.target.value || 4)))} /></Field>
    </div>
    <div className="flex flex-wrap gap-2">{(["pencil", "eraser", "fill", "pick"] as const).map(t => <button key={t} className={tool === t ? primary : secondary} onClick={() => setTool(t)}>{t === "pick" ? "Pick (eyedropper)" : t}</button>)}</div>
    <Field label="Symmetry"><select className={input} value={symmetry} onChange={e => setSymmetry(e.target.value as PixelSymmetry)}><option value="off">Off</option><option value="vertical">Mirror left ↔ right</option><option value="horizontal">Mirror top ↔ bottom</option><option value="both">Both mirrors</option></select></Field>
    <Field label="Color"><input className={`${input} h-11`} type="color" value={color} onChange={e => setColor(e.target.value)} /></Field>
    <div className="flex flex-wrap gap-2">{["#111827", "#ef4444", "#f59e0b", "#22c55e", "#2563eb", "#7c3aed", "#ec4899", "#ffffff"].map(c => <button key={c} aria-label={`Use ${c}`} className="h-9 w-9 rounded-full border shadow-sm" style={{ background: c }} onClick={() => setColor(c)} />)}</div>
    <div>
      <p className="text-sm font-semibold text-slate-700">Quick-start templates</p>
      <div className="mt-2 flex flex-wrap gap-2">{Object.entries(pixelTemplates).map(([key, template]) => <button key={key} className={secondary} onClick={() => loadTemplate(key)}>{template.label}</button>)}</div>
    </div>
    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
      <p className="text-sm font-semibold text-slate-700">Image to pixel art</p>
      <Field label="Image"><input className={`${input} mt-2`} type="file" accept="image/png,image/jpeg,image/webp" onChange={e => loadSourceImage(e.target.files?.[0])} /></Field>
      <div className="mt-3 grid grid-cols-2 gap-3">
        <Field label="Grid width"><select className={input} value={convertCols} onChange={e => setConvertCols(+e.target.value)}>{[16, 24, 32, 48, 64].map(n => <option key={n} value={n}>{n} pixels</option>)}</select></Field>
        <Field label="Colour depth"><select className={input} value={colorDepth} onChange={e => setColorDepth(+e.target.value)}>{[8, 16, 32, 64].map(n => <option key={n} value={n}>{n} colours</option>)}</select></Field>
      </div>
      <button className={`${primary} mt-3`} disabled={!sourceImage} onClick={convertImage}>Convert image to pixels</button>
      {convertError && <p role="alert" className="mt-2 text-xs font-semibold text-red-700">{convertError}</p>}
      {convertStatus && <p className="mt-2 text-xs leading-5 text-slate-600">{convertStatus}</p>}
      <p className="mt-2 text-xs leading-5 text-slate-500">The image stays in your browser. Conversion samples each grid cell and reduces the colours to your chosen depth, so photos become blocky pixel art.</p>
    </div>
    <label className="flex gap-2"><input type="checkbox" checked={grid} onChange={e => setGrid(e.target.checked)} /> Show grid</label>
    <Field label={`Zoom ${Math.round(zoom * 100)}%`}><input className={input} type="range" min=".5" max="2" step=".1" value={zoom} onChange={e => setZoom(+e.target.value)} /></Field>
    <div className="flex flex-wrap gap-2"><button className={secondary} disabled={!history.length} onClick={undo}>Undo</button><button className={secondary} disabled={!future.length} onClick={redo}>Redo</button><button className={secondary} onClick={() => { setHistory(h => [...h, cells]); setCells(Array(cols * rows).fill("#ffffff")); }}>Clear</button></div>
    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
      <p className="text-sm font-semibold text-slate-700">PNG export</p>
      <div className="mt-3 grid grid-cols-2 gap-3">
        <Field label="PNG quality (px per cell)"><select className={input} value={pngScale} onChange={e => setPngScale(+e.target.value)}>{[5, 10, 20, 30].map(n => <option key={n} value={n}>{n} px per cell</option>)}</select></Field>
      </div>
      <label className="mt-3 flex gap-2 text-sm font-semibold text-slate-700"><input type="checkbox" checked={transparentBg} onChange={e => setTransparentBg(e.target.checked)} /> Transparent background (white stays transparent)</label>
      <label className="mt-2 flex gap-2 text-sm font-semibold text-slate-700"><input type="checkbox" checked={exportGridLines} onChange={e => setExportGridLines(e.target.checked)} /> Include grid lines in the PNG</label>
    </div>
  </div>}>
    <div className="overflow-auto rounded-2xl bg-slate-100 p-4"><svg ref={svg} width={width} height={height} viewBox={`0 0 ${width / zoom} ${height / zoom}`} onPointerLeave={() => drawing.current = false} onPointerUp={() => drawing.current = false} className="mx-auto h-auto max-h-[720px] touch-none bg-white [image-rendering:pixelated]" xmlns="http://www.w3.org/2000/svg">{cells.map((fill, i) => <rect key={i} x={(i % cols) * cell} y={Math.floor(i / cols) * cell} width={cell} height={cell} fill={fill} stroke={grid ? "#cbd5e1" : "none"} onPointerDown={e => { e.currentTarget.setPointerCapture(e.pointerId); if (tool === "pick") pick(i); else begin(i); }} onPointerEnter={() => { if (drawing.current && tool !== "fill" && tool !== "pick") paint(i); }} />)}</svg></div>
    <div className="mt-4 flex flex-wrap gap-2"><button className={primary} onClick={exportPng}>Download PNG</button><button className={secondary} onClick={() => exportSvg(svg.current, "pixel-art")}>Download SVG</button><button className={secondary} onClick={() => window.print()}>Print</button></div>
  </Workbench>;
}

function PosterWorkspace({mode}:{mode:"block"|"image"}){const [image,setImage]=useState<HTMLImageElement|null>(null),[url,setUrl]=useState(""),[cols,setCols]=useState(2),[rows,setRows]=useState(2),[paper,setPaper]=useState<PaperKind>("a4"),[orientation,setOrientation]=useState<Orientation>("portrait"),[margin,setMargin]=useState(10),[overlap,setOverlap]=useState(5),[fit,setFit]=useState<"fit"|"fill">("fit"),[crop,setCrop]=useState(0),[error,setError]=useState("");const canvas=useRef<HTMLCanvasElement>(null);const tiles=useMemo(()=>image?calculatePosterTiles(image.width,image.height,cols,rows,overlap/100):[],[image,cols,rows,overlap]);const load=(file?:File)=>{setError("");if(!file)return;if(file.size>20*1024*1024){setError("Choose an image smaller than 20 MB to protect browser memory.");return}const objectUrl=URL.createObjectURL(file),img=new Image();img.onload=()=>{if(img.width*img.height>40_000_000){setError("This image exceeds the safe 40-megapixel limit.");URL.revokeObjectURL(objectUrl);return}setUrl(old=>{if(old)URL.revokeObjectURL(old);return objectUrl});setImage(img)};img.onerror=()=>setError("The selected file is not a readable image.");img.src=objectUrl};useEffect(()=>()=>{if(url)URL.revokeObjectURL(url)},[url]);useEffect(()=>{const c=canvas.current;if(!c)return;const x=c.getContext("2d")!;c.width=900;c.height=640;x.fillStyle="#e2e8f0";x.fillRect(0,0,c.width,c.height);x.fillStyle="#fff";const gap=10,pageW=(820-gap*(cols-1))/cols,pageH=(560-gap*(rows-1))/rows;x.fillRect(40,40,820,560);if(image){const scale=fit==="fit"?Math.min(820/image.width,560/image.height):Math.max(820/image.width,560/image.height);const w=image.width*scale*(1+crop/100),h=image.height*scale*(1+crop/100);x.save();x.beginPath();x.rect(40,40,820,560);x.clip();x.drawImage(image,450-w/2,320-h/2,w,h);x.restore()}x.strokeStyle="#ef4444";x.setLineDash([8,6]);for(let i=1;i<cols;i++){const px=40+i*pageW+(i-1)*gap;x.beginPath();x.moveTo(px,40);x.lineTo(px,600);x.stroke()}for(let i=1;i<rows;i++){const py=40+i*pageH+(i-1)*gap;x.beginPath();x.moveTo(40,py);x.lineTo(860,py);x.stroke()}x.setLineDash([]);x.fillStyle="#0f172a";x.font="16px Arial";x.fillText(`${cols} × ${rows} pages · ${overlap}% overlap`,50,625)},[image,cols,rows,fit,crop,overlap]);const pdf=async()=>{if(!image){setError("Upload an image before exporting.");return}const {jsPDF}=await import("jspdf"),[baseW,baseH]=paperMillimeters[paper],pw=orientation==="portrait"?baseW:baseH,ph=orientation==="portrait"?baseH:baseW,doc=new jsPDF({unit:"mm",format:[pw,ph],orientation});tiles.forEach((tile,i)=>{if(i)doc.addPage([pw,ph],orientation);const temp=document.createElement("canvas");temp.width=Math.min(2400,Math.ceil(tile.sw));temp.height=Math.min(2400,Math.ceil(tile.sh));const ctx=temp.getContext("2d")!;ctx.drawImage(image,tile.sx,tile.sy,tile.sw,tile.sh,0,0,temp.width,temp.height);const printableW=pw-margin*2,printableH=ph-margin*2;doc.addImage(temp.toDataURL("image/jpeg",.9),"JPEG",margin,margin,printableW,printableH,undefined,"FAST");doc.setFontSize(8);doc.text(`Page ${i+1}/${tiles.length} · row ${tile.row+1}, column ${tile.col+1} · print at 100%`,margin,ph-3)});doc.save(mode==="block"?"block-poster.pdf":"multi-page-image-poster.pdf")};return <Workbench status={image?`${tiles.length} tiled pages ready`:"Upload a JPG, PNG, or WebP image to begin"} controls={<div className="space-y-4"><Field label="Image"><input className={input} type="file" accept="image/png,image/jpeg,image/webp" onChange={e=>load(e.target.files?.[0])}/></Field>{error&&<p role="alert" className="rounded-xl bg-red-50 p-3 text-sm text-red-700">{error}</p>}<div className="grid grid-cols-2 gap-3"><Field label="Pages across"><input className={input} type="number" min="1" max="8" value={cols} onChange={e=>setCols(Math.max(1,Math.min(8,+e.target.value||1)))}/></Field><Field label="Pages down"><input className={input} type="number" min="1" max="8" value={rows} onChange={e=>setRows(Math.max(1,Math.min(8,+e.target.value||1)))}/></Field><Field label="Paper"><select className={input} value={paper} onChange={e=>setPaper(e.target.value as PaperKind)}><option value="a4">A4</option><option value="letter">US Letter</option></select></Field><Field label="Orientation"><select className={input} value={orientation} onChange={e=>setOrientation(e.target.value as Orientation)}><option>portrait</option><option>landscape</option></select></Field><Field label="Print margin (mm)"><input className={input} type="number" min="3" max="25" value={margin} onChange={e=>setMargin(Math.max(3,Math.min(25,+e.target.value||3)))}/></Field><Field label="Overlap (%)"><input className={input} type="number" min="0" max="20" value={overlap} onChange={e=>setOverlap(Math.max(0,Math.min(20,+e.target.value||0)))}/></Field></div>{mode==="image"&&<><Field label="Fit mode"><select className={input} value={fit} onChange={e=>setFit(e.target.value as typeof fit)}><option>fit</option><option>fill</option></select></Field><Field label={`Crop/zoom ${crop}%`}><input className={input} type="range" min="0" max="100" value={crop} onChange={e=>setCrop(+e.target.value)}/></Field></>}<button className={primary} disabled={!image} onClick={()=>void pdf()}>Download multipage PDF</button><p className="text-xs leading-5 text-slate-500">Trim along the outer crop edges, keep the overlap strips, align matching content, tape from the back, and print every PDF page at 100% / Actual Size.</p></div>}><canvas ref={canvas} className="h-auto w-full rounded-2xl border bg-slate-100"/><div className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">{tiles.map(tile=><div key={tile.page} className="rounded-xl border p-3 text-sm"><strong>Page {tile.page}</strong><br/>Row {tile.row+1}, column {tile.col+1}</div>)}</div></Workbench>}
export function BlockPosterTool(){return <PosterWorkspace mode="block"/>}
export function ImagePosterTool(){return <PosterWorkspace mode="image"/>}
