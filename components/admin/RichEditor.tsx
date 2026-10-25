"use client";
import { useEffect, useState } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import TextAlign from "@tiptap/extension-text-align";

function ToolbarButton({label,onClick,active=false}:{label:string;onClick:()=>void;active?:boolean}){return <button type="button" onClick={onClick} className={`rounded-lg border px-2.5 py-1.5 text-xs font-semibold ${active?"border-blue-600 bg-blue-50 text-blue-700":"bg-white"}`}>{label}</button>}
export function RichEditor({name="contentHtml",initial=""}:{name?:string;initial?:string}){
  const[html,setHtml]=useState(initial);
  const editor=useEditor({immediatelyRender:false,extensions:[StarterKit,Underline,Link.configure({openOnClick:false,HTMLAttributes:{rel:"noopener noreferrer"}}),Image.configure({allowBase64:false}),TextAlign.configure({types:["heading","paragraph"]})],content:initial,onUpdate:({editor})=>setHtml(editor.getHTML())});
  useEffect(()=>()=>editor?.destroy(),[editor]);
  if(!editor)return <div className="h-64 animate-pulse rounded-xl bg-slate-100"/>;
  const addLink=()=>{const href=window.prompt("URL");if(href&&/^(https?:\/\/|\/|#)/i.test(href))editor.chain().focus().setLink({href}).run()};
  const addImage=()=>{const src=window.prompt("Image URL from Media Library");if(src&&/^(https?:\/\/|\/media\/)/i.test(src)){const alt=window.prompt("Describe this image for accessibility (alt text)")||"";editor.chain().focus().setImage({src,alt:alt.trim()}).run()}};
  return <div><div className="flex flex-wrap gap-2 rounded-t-xl border border-b-0 bg-slate-50 p-2">
    <ToolbarButton label="Undo" onClick={()=>editor.chain().focus().undo().run()}/><ToolbarButton label="Redo" onClick={()=>editor.chain().focus().redo().run()}/>
    <ToolbarButton label="H2" active={editor.isActive("heading",{level:2})} onClick={()=>editor.chain().focus().toggleHeading({level:2}).run()}/><ToolbarButton label="H3" active={editor.isActive("heading",{level:3})} onClick={()=>editor.chain().focus().toggleHeading({level:3}).run()}/><ToolbarButton label="H4" active={editor.isActive("heading",{level:4})} onClick={()=>editor.chain().focus().toggleHeading({level:4}).run()}/>
    <ToolbarButton label="Bold" active={editor.isActive("bold")} onClick={()=>editor.chain().focus().toggleBold().run()}/><ToolbarButton label="Italic" active={editor.isActive("italic")} onClick={()=>editor.chain().focus().toggleItalic().run()}/><ToolbarButton label="Underline" active={editor.isActive("underline")} onClick={()=>editor.chain().focus().toggleUnderline().run()}/>
    <ToolbarButton label="Bullets" onClick={()=>editor.chain().focus().toggleBulletList().run()}/><ToolbarButton label="Numbers" onClick={()=>editor.chain().focus().toggleOrderedList().run()}/><ToolbarButton label="Quote" onClick={()=>editor.chain().focus().toggleBlockquote().run()}/><ToolbarButton label="Code" onClick={()=>editor.chain().focus().toggleCodeBlock().run()}/><ToolbarButton label="Divider" onClick={()=>editor.chain().focus().setHorizontalRule().run()}/>
    <ToolbarButton label="Left" onClick={()=>editor.chain().focus().setTextAlign("left").run()}/><ToolbarButton label="Center" onClick={()=>editor.chain().focus().setTextAlign("center").run()}/><ToolbarButton label="Right" onClick={()=>editor.chain().focus().setTextAlign("right").run()}/><ToolbarButton label="Link" onClick={addLink}/><ToolbarButton label="Image" onClick={addImage}/>
  </div><EditorContent editor={editor} className="prose prose-slate min-h-80 max-w-none rounded-b-xl border bg-white p-5 focus-within:border-blue-500 [&_.tiptap]:min-h-72 [&_.tiptap]:outline-none"/><input type="hidden" name={name} value={html}/></div>
}
