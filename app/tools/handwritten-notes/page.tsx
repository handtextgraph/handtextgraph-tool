import { createToolMetadata, ToolExperiencePage } from "@/components/ToolExperiencePage";

export const metadata = createToolMetadata("notes");

export default function HandwrittenNotesPage() {
  return <ToolExperiencePage profile="notes" />;
}
