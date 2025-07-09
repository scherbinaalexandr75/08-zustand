import axios from 'axios';
import { type Note, type NoteInput } from '../types/note';

export interface FetchNotesResponse {
  notes: Note[];
  totalPages: number;
  tag?: string;
}

interface paramsProps {
  page: number;
  perPage: number;
  search?: string;
  tag?: string;
}

axios.defaults.baseURL = 'https://notehub-public.goit.study/api';

const headersToken = {
  Authorization: `Bearer ${process.env.NEXT_PUBLIC_NOTEHUB_TOKEN}`,
  Accept: 'application/json',
};

export async function fetchNotes(
  search: string,
  page: number,
  tag?: string | null
): Promise<FetchNotesResponse> {
  const params: paramsProps = {
    page,
    perPage: 12,
  };

  if (search.trim()) params.search = search;
  if (tag) params.tag = tag;

  const { data } = await axios.get<FetchNotesResponse>(`/notes`, {
    params,
    headers: headersToken,
  });
  return data;
}

export async function createNote(noteData: NoteInput): Promise<Note> {
  const { data } = await axios.post<Note>('/notes', noteData, {
    headers: headersToken,
  });
  return data;
}

export async function deleteNote(noteId: number): Promise<Note> {
  const { data } = await axios.delete<Note>(`/notes/${noteId}`, {
    headers: headersToken,
  });
  return data;
}

export async function fetchNoteById(id: number): Promise<Note> {
  const { data } = await axios.get<Note>(`/notes/${id}`, {
    headers: headersToken,
  });
  return data;
}
