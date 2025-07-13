'use client';

import React, { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { createNote } from '../../lib/api';
import type { NoteInput } from '../../types/note';
import { useNoteStore } from '@/lib/store/noteStore';
import { useRouter } from 'next/navigation';
import css from './NoteForm.module.css';

export default function NoteForm() {
  const queryClient = useQueryClient();
  const router = useRouter();
  const { draft, setDraft, clearDraft } = useNoteStore();

  const [errors, setErrors] = useState<{
    title?: string;
    content?: string;
    tag?: string;
  }>({});

  const validate = (): boolean => {
    const newErrors: { title?: string; content?: string; tag?: string } = {};
    let isValid = true;

    if (!draft.title || draft.title.trim().length < 3) {
      newErrors.title = 'Назва повинна містити щонайменше 3 символи.';
      isValid = false;
    } else if (draft.title.trim().length > 50) {
      newErrors.title = 'Назва занадто довга (макс. 50 символів).';
      isValid = false;
    }

    if (draft.content.trim().length > 500) {
      newErrors.content = 'Вміст занадто довгий (макс. 500 символів).';
      isValid = false;
    }

    const validTags = ['Todo', 'Work', 'Personal', 'Meeting', 'Shopping'];
    if (!validTags.includes(draft.tag)) {
      newErrors.tag = 'Недійсний тег.';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const { mutate, isPending } = useMutation({
    mutationFn: (newNote: NoteInput) => createNote(newNote),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['note'] });
      clearDraft();
      toast.success('Замітка успішно створена!');
      router.back();
    },
    onError: error => {
      console.error('Помилка створення замітки:', error);
      toast.error('Не вдалося створити замітку. Спробуйте ще раз!');
    },
  });

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;

    setDraft({
      ...draft,
      [name]: value,
    });

    setErrors(prev => ({ ...prev, [name]: undefined }));
  };

  const handleCancel = () => {
    router.back();
  };

  const handlePublish = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const isValid = validate();
    if (!isValid) {
      toast.error('Будь ласка, виправте помилки форми перед публікацією.');
      return;
    }

    mutate(draft);
  };

  return (
    <form className={css.form} onSubmit={handlePublish}>
      <div className={css.formGroup}>
        <label htmlFor="title">Name</label>
        <input
          id="title"
          type="text"
          name="title"
          className={css.input}
          value={draft.title}
          onChange={handleChange}
          required
        />
        {errors.title && <span className={css.error}>{errors.title}</span>}
      </div>
      <div className={css.formGroup}>
        <label htmlFor="content">Content</label>
        <textarea
          id="content"
          name="content"
          rows={8}
          className={css.textarea}
          value={draft.content}
          onChange={handleChange}
        />
        {errors.content && <span className={css.error}>{errors.content}</span>}
      </div>
      <div className={css.formGroup}>
        <label htmlFor="tag">Tag</label>
        <select
          id="tag"
          name="tag"
          className={css.select}
          value={draft.tag}
          onChange={handleChange}
        >
          <option value="Todo">Todo</option>
          <option value="Work">Work</option>
          <option value="Personal">Personal</option>
          <option value="Meeting">Meeting</option>
          <option value="Shopping">Shopping</option>
        </select>
        {errors.tag && <span className={css.error}>{errors.tag}</span>}
      </div>
      <div className={css.actions}>
        <button
          type="button"
          className={`${css.button} ${css.cancelButton}`}
          onClick={handleCancel}
        >
          Cancel
        </button>
        <button
          type="submit"
          className={`${css.button} ${css.publishButton}`}
          disabled={isPending}
        >
          {isPending ? 'Creating...' : 'Create note'}
        </button>
      </div>
    </form>
  );
}
