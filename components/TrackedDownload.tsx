"use client";

import type { AnchorHTMLAttributes, ReactNode } from "react";
import { trackEvent, type TemplateType } from "@/lib/analytics";
import { runTrackedActivation } from "@/lib/tracked-interaction";

type Props = AnchorHTMLAttributes<HTMLAnchorElement> & { children: ReactNode; templateType: TemplateType };

export function TrackedDownload({ children, templateType, onClick, ...props }: Props) {
  return (
    <a {...props} onClick={(event) => runTrackedActivation(event, onClick, () => trackEvent("template_downloaded", { template_type: templateType }))}>
      {children}
    </a>
  );
}
