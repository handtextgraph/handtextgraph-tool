import type { ComponentType } from "react";
import {
  TextToHandwritingGuideBody,
  textToHandwritingFaqs,
} from "./text-to-handwriting";
import {
  SignatureGeneratorGuideBody,
  signatureGeneratorFaqs,
} from "./signature-generator";
import {
  WordSearchMakerGuideBody,
  wordSearchMakerFaqs,
} from "./word-search-maker";
import {
  InvitationMakerGuideBody,
  invitationMakerFaqs,
} from "./invitation-maker";
import {
  AssignmentMakerGuideBody,
  assignmentMakerFaqs,
} from "./assignment-maker";

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
  "signature-generator": {
    Body: SignatureGeneratorGuideBody,
    faqs: signatureGeneratorFaqs,
  },
  "word-search-maker": {
    Body: WordSearchMakerGuideBody,
    faqs: wordSearchMakerFaqs,
  },
  "invitation-maker": {
    Body: InvitationMakerGuideBody,
    faqs: invitationMakerFaqs,
  },
  "assignment-maker": {
    Body: AssignmentMakerGuideBody,
    faqs: assignmentMakerFaqs,
  },
};

export function getGuideContent(slug: string): GuideContent | undefined {
  return guideContent[slug];
}
