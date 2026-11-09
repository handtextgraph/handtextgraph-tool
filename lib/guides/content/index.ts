import type { ComponentType } from "react";
import {
  TextToHandwritingGuideBody,
  textToHandwritingFaqs,
} from "./text-to-handwriting";

export type GuideContent = {
  Body: ComponentType;
  faqs: readonly { question: string; answer: string }[];
};

/**
 * Published guides only. A guide is added here when its content file is
 * written and its registry entry is flipped to `published: true`.
 */
export const guideContent: Record<string, GuideContent> = {
  "text-to-handwriting": {
    Body: TextToHandwritingGuideBody,
    faqs: textToHandwritingFaqs,
  },
};

export function getGuideContent(slug: string): GuideContent | undefined {
  return guideContent[slug];
}
