'use client'; 

import React, { useState, useEffect } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast'; 
import { createNote } from '../../lib/api'; 
import type { NoteInput } from '../../types/note'; 
import { useNoteStore } from '@/lib/store/noteStore';
import { useRouter } from 'next/navigation'; 
import css from './NoteForm.module.css';


const initialFormState: NoteInput = {
  title: '',
  content: '',
  tag: 'Todo',
};

export default function NoteForm() {
  const queryClient = useQueryClient();
  const router = useRouter(); 

  const { draft, setDraft, clearDraft } = useNoteStore();

  const [title, setTitle] = useState(initialFormState.title);
  const [content, setContent] = useState(initialFormState.content);
  const [tag, setTag] = useState<NoteInput['tag']>(initialFormState.tag);
  const [errors, setErrors] = useState<{
    title?: string;
    content?: string;
    tag?: string;
  }>({});
  
  useEffect(() => {
    if (draft.title || draft.content) {
      setTitle(draft.title);
      setContent(draft.content);
      setTag(draft.tag);
      toast('Завантажено збережену чернетку.');
    } else {
    
      setTitle(initialFormState.title);
      setContent(initialFormState.content);
      setTag(initialFormState.tag);
    }
  }, [draft]);

  const validate = (): boolean => {
    const newErrors: { title?: string; content?: string; tag?: string } = {};
    let isValid = true;

    if (!title || title.trim().length < 3) {
      newErrors.title = 'Назва повинна містити щонайменше 3 символи.';
      isValid = false;
    } else if (title.trim().length > 50) {
      newErrors.title = 'Назва занадто довга (макс. 50 символів).';
      isValid = false;
    }
    if (content.trim().length > 500) {
      newErrors.content = 'Вміст занадто довгий (макс. 500 символів).';
      isValid = false;
    }
    const validTags = ['Todo', 'Work', 'Personal', 'Meeting', 'Shopping'];
    if (!validTags.includes(tag)) {
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
    if (name === 'title') {
      setTitle(value);
    } else if (name === 'content') {
      setContent(value);
    } else if (name === 'tag') {
      setTag(value as NoteInput['tag']);
    }

    setErrors(prev => ({ ...prev, [name]: undefined }));

    setDraft({
      title: name === 'title' ? value : title,
      content: name === 'content' ? value : content,
      tag: name === 'tag' ? (value as NoteInput['tag']) : tag,
    });
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

    const noteData: NoteInput = { title, content, tag };
    mutate(noteData);
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
          value={title}
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
          value={content}
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
          value={tag}
          onChange={handleChange}
        >
          <option value="Todo">Todo</option>
          <option value="Work">Work</option>
          <option value="Personal">Private</option>
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
          {isPending ? 'Створюється...' : 'Опублікувати замітку'}
        </button>
      </div>
    </form>
  );
}
