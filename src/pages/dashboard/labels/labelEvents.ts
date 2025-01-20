import type { Label } from '@api/label.ts';
import { SwifiEvent } from '@components/event.ts';

export const labelCreateEvent = new SwifiEvent<(label: Label) => void>();
