import React, { useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../app/hooks.ts';
import { CommentMutation } from '../../types';
import ButtonSpinner from '../UI/ButtonSpinner/ButtonSpinner.tsx';
import { selectCommentsCreating } from '../../store/slices/commentsSlice.ts';
import { fetchComments } from '../../store/thunks/commentsThunk.ts';

const initialState = {
  news_id: 0,
  author: '',
  content: '',
};

interface Props {
  newsId: number;
  onSubmit: (commentMutation: CommentMutation) => void;
}

const AddComment: React.FC<Props> = ({newsId, onSubmit}) => {
  const [form, setForm] = useState<CommentMutation>({...initialState});
  const dispatch = useAppDispatch();
  const isCreating = useAppSelector(selectCommentsCreating);

  const onFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSubmit({...form, news_id: newsId});
    dispatch(fetchComments(String(newsId)));
  };

  const onFieldChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const {name, value} = e.target;
    setForm((prevState: CommentMutation) => ({...prevState, [name]: value}));
  };

  return (
    <>
      <form onSubmit={onFormSubmit} className="my-5">
        <div className="mb-3">
          <input
            type="text"
            className="form-control"
            placeholder="Author"
            name="author"
            value={form.author}
            onChange={onFieldChange}
          />
        </div>

        <div className="mb-3">
          <textarea
            className="form-control"
            placeholder="Content"
            name="content"
            value={form.content}
            onChange={onFieldChange}
            required
          />
        </div>

        <div className="d-flex gap-3 justify-content-center">
          <button
            disabled={isCreating}
            type="submit"
            className="btn btn-dark d-flex align-items-center"
          >
            <span className="me-2">
              Create
            </span>
            {isCreating ? <ButtonSpinner/> : null}
          </button>
        </div>
      </form>
    </>
  );
};

export default AddComment;