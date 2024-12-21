import { createAsyncThunk } from '@reduxjs/toolkit';
import { INews, INewsMutation } from '../../types';
import axiosApi from '../../axiosApi.ts';

export const fetchNews = createAsyncThunk<INews[], void>(
  'news/fetchNews',
  async () => {
    const response = await axiosApi<INews[]>('/news');
    return response.data;
  }
);

export const getNewsById = createAsyncThunk<INews | null, string>(
  'news/getNewsById',
  async (newsId: string) => {
    const response = await axiosApi<INews | null>(`/news/${newsId}`);

    if (!response.data) return null;

    return response.data;
  }
);

export const addNews = createAsyncThunk<void, INewsMutation>(
  'news/addNews',
  async (newsMutation) => {
    const formData = new FormData();
    const keys = Object.keys(newsMutation) as (keyof INewsMutation)[];

    keys.forEach(key => {
      const value = newsMutation[key];

      if (value !== null) {
        formData.append(key, value);
      }
    });

    await axiosApi.post('/news', formData);
  }
);

export const deleteNews = createAsyncThunk<void, string>(
  'news/deleteNews',
  async (newsId: string) => {
    await axiosApi.delete(`/news/${newsId}`);
  }
);