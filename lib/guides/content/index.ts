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
import { SudokuGuideBody, sudokuFaqs } from "./sudoku";
import {
  HandwritingPracticeGuideBody,
  handwritingPracticeFaqs,
} from "./handwriting-practice";
import {
  CornellNotesGuideBody,
  cornellNotesFaqs,
} from "./cornell-notes";
import {
  GraphPaperGuideBody,
  graphPaperFaqs,
} from "./graph-paper";
import {
  LinedPaperGuideBody,
  linedPaperFaqs,
} from "./lined-paper";
import {
  HandwritingToTextReverseGuideBody,
  handwritingToTextReverseFaqs,
} from "./handwriting-to-text-reverse";
import {
  SemiLogLogLogPaperGuideBody,
  semiLogLogLogPaperFaqs,
} from "./semi-log-log-log-paper";
import {
  IsometricPaperGuideBody,
  isometricPaperFaqs,
} from "./isometric-paper";
import {
  HandwrittenNotesGuideBody,
  handwrittenNotesFaqs,
} from "./handwritten-notes";
import {
  EngineeringPaperGuideBody,
  engineeringPaperFaqs,
} from "./engineering-paper";

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
  sudoku: {
    Body: SudokuGuideBody,
    faqs: sudokuFaqs,
  },
  "handwriting-practice": {
    Body: HandwritingPracticeGuideBody,
    faqs: handwritingPracticeFaqs,
  },
  "cornell-notes": {
    Body: CornellNotesGuideBody,
    faqs: cornellNotesFaqs,
  },
  "graph-paper": {
    Body: GraphPaperGuideBody,
    faqs: graphPaperFaqs,
  },
  "lined-paper": {
    Body: LinedPaperGuideBody,
    faqs: linedPaperFaqs,
  },
  "handwriting-to-text-reverse": {
    Body: HandwritingToTextReverseGuideBody,
    faqs: handwritingToTextReverseFaqs,
  },
  "semi-log-log-log-paper": {
    Body: SemiLogLogLogPaperGuideBody,
    faqs: semiLogLogLogPaperFaqs,
  },
  "isometric-paper": {
    Body: IsometricPaperGuideBody,
    faqs: isometricPaperFaqs,
  },
  "handwritten-notes": {
    Body: HandwrittenNotesGuideBody,
    faqs: handwrittenNotesFaqs,
  },
  "engineering-paper": {
    Body: EngineeringPaperGuideBody,
    faqs: engineeringPaperFaqs,
  },
};

export function getGuideContent(slug: string): GuideContent | undefined {
  return guideContent[slug];
}
