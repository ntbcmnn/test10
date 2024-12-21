import React, { useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../app/hooks.ts';
import { selectNewsCreating } from '../../store/slices/newsSlice.ts';
import { toast } from 'react-toastify';
import { addNews } from '../../store/thunks/newsThunk.ts';
import { INewsMutation } from '../../types';
import FileInput from '../../Components/FileInput/FileInput.tsx';
import ButtonSpinner from '../../Components/UI/ButtonSpinner/ButtonSpinner.tsx';
import { useNavigate } from 'react-router-dom';

const initialState = {
  title: '',
  content: '',
  image: null,
};

const AddNews = () => {
  const [form, setForm] = useState<INewsMutation>({...initialState});
  const dispatch = useAppDispatch();
  const isCreating = useAppSelector(selectNewsCreating);
  const navigate = useNavigate();

  const onFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!form.title || !form.content) {
      toast.error('Title and content required!');
      return;
    }

    dispatch(addNews({...form}));
    setForm({...initialState});
    navigate('/');
    toast.success('Post added successfully!');
  };


  const onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void = (e: React.ChangeEvent<HTMLInputElement>) => {
    const {name, value} = e.target;
    setForm((prevState: INewsMutation) => ({...prevState, [name]: value}));
  };

  const onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void = (e: React.ChangeEvent<HTMLInputElement>) => {
    const {name, files} = e.target;

    if (files) {
      setForm((prevState: INewsMutation) => ({...prevState, [name]: files[0] || null}));
    }
  };

  return (
    <>
      <h3 className="text-center">Create a new message</h3>
      <form onSubmit={onFormSubmit} className="my-5">
        <div className="mb-3">
          <input
            type="text"
            className="form-control"
            placeholder="Title"
            name="title"
            value={form.title}
            onChange={onInputChange}
            required
          />
        </div>

        <div className="mb-3">
          <input
            type="text"
            className="form-control"
            placeholder="Content"
            name="content"
            value={form.content}
            onChange={onInputChange}
            required
          />
        </div>

        <div className="mb-3">
          <FileInput
            name="image"
            label="Image"
            onGetFile={onFileChange}
            file={form.image}
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

export default AddNews;