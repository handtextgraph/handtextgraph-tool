import { createToolMetadata, ToolExperiencePage } from "@/components/ToolExperiencePage";

export const metadata = createToolMetadata("pdf");

export default function TextToHandwritingPdfPage() {
  return <ToolExperiencePage profile="pdf" />;
}
