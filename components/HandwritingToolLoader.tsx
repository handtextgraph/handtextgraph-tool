import { HandwritingTool } from "./HandwritingTool";
import type { ToolProfile } from "@/lib/tool-profiles";

const handwritingFontsUrl = "https://fonts.googleapis.com/css2?family=Architects+Daughter&family=Caveat:wght@400;500;600;700&family=Caveat+Brush&family=Indie+Flower&family=Kalam:wght@300;400;700&family=Patrick+Hand&family=Schoolbell&family=Shadows+Into+Light&display=swap";

export function HandwritingToolLoader({ profile = "default" }: { profile?: ToolProfile }) {
  return (
    <>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link rel="stylesheet" href={handwritingFontsUrl} />
      <div id="tool">
        <HandwritingTool profile={profile} />
      </div>
    </>
  );
}
