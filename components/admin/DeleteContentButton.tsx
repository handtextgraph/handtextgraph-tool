"use client";
export function DeleteContentButton(){return <button type="submit" className="ml-3 font-semibold text-red-600" onClick={(event)=>{if(!window.confirm("Delete this item? It will immediately disappear from the public website."))event.preventDefault()}}>Delete</button>}
