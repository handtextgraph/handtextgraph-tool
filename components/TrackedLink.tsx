"use client";

import Link, { type LinkProps } from "next/link";
import type { AnchorHTMLAttributes, ReactNode } from "react";
import { trackEvent, type AnalyticsEventName, type LinkTarget } from "@/lib/analytics";
import { runTrackedActivation } from "@/lib/tracked-interaction";

type Props = LinkProps & Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href"> & {
  children: ReactNode;
  eventName: Extract<AnalyticsEventName, "related_tool_clicked" | "guide_clicked">;
  eventTarget: LinkTarget;
};

export function TrackedLink({ children, eventName, eventTarget, onClick, ...props }: Props) {
  return (
    <Link {...props} onClick={(event) => runTrackedActivation(event, onClick, () => trackEvent(eventName, { link_target: eventTarget }))}>
      {children}
    </Link>
  );
}
