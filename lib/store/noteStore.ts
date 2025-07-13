import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

const initialDraft: NoteDraft = {
  title: '',
  content: '',
  tag: 'Todo',
};

interface NoteDraft {
  title: string;
  content: string;
  tag: 'Todo' | 'Work' | 'Personal' | 'Meeting' | 'Shopping';
}

interface NoteStoreState {
  draft: NoteDraft;
  setDraft: (note: NoteDraft) => void;
  clearDraft: () => void;
}

export const useNoteStore = create<NoteStoreState>()(
  persist(
    set => ({
      draft: { ...initialDraft },
      setDraft: (note: NoteDraft) => set({ draft: note }),
      clearDraft: () => set({ draft: { ...initialDraft }}),
    }),
    {
      name: 'note-draft-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
