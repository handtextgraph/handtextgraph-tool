import { ToolPage } from "@/components/tools/ToolPage";
import { WorksheetLibrary } from "@/components/tools/WorksheetLibrary";
import { toolMetadata } from "@/components/tools/toolMetadata";

export function generateMetadata() { return toolMetadata("printable-worksheets"); }

export default function Page() {
  return (
    <ToolPage slug="printable-worksheets">
      <WorksheetLibrary />
    </ToolPage>
  );
}
