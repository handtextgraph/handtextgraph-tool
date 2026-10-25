export function runTrackedActivation<Event extends { defaultPrevented: boolean }>(
  event: Event,
  consumer: ((event: Event) => void) | undefined,
  track: () => void,
) {
  consumer?.(event);
  if (!event.defaultPrevented) track();
}
