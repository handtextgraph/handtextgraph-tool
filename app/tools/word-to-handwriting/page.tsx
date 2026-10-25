import { createToolMetadata, ToolExperiencePage } from "@/components/ToolExperiencePage";

export const metadata = createToolMetadata("word");

export default function WordToHandwritingPage() {
  return <ToolExperiencePage profile="word" />;
}
