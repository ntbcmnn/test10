import { createAsyncThunk } from '@reduxjs/toolkit';
import { Comment, CommentMutation } from '../../types';
import axiosApi from '../../axiosApi.ts';

export const fetchComments = createAsyncThunk<Comment[], string | undefined>(
  'comments/fetchComments',
  async (newsId: string | undefined) => {
    const url: string = newsId ? `/comments?news_id=${newsId}` : '/comments';
    const response = await axiosApi<Comment[]>(url);
    return response.data;
  }
);

export const addComment = createAsyncThunk<void, CommentMutation>(
  'comments/addComment',
  async (commentMutation) => {
    await axiosApi.post('/comments', commentMutation);
  }
);

export const deleteComment = createAsyncThunk<void, string>(
  'comments/deleteComment',
  async (commentId: string) => {
    await axiosApi.delete(`/comments/${commentId}`);
  }
);