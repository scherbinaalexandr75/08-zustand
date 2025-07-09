import type { Note } from '@/types/note';

export interface Response {
  notes: Note[];
  totalPages: number;
}
