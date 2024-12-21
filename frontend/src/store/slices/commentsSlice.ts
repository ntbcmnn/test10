import { Comment } from '../../types';
import { createSelector, createSlice } from '@reduxjs/toolkit';
import { addComment, deleteComment, fetchComments } from '../thunks/commentsThunk.ts';
import { RootState } from '../../app/store.ts';

interface ICommentsState {
  items: Comment[];
  fetching: boolean;
  creating: boolean;
  deleting: boolean | string;
  error: boolean;
}

const initialState: ICommentsState = {
  items: [],
  fetching: false,
  creating: false,
  deleting: false,
  error: false,
};

export const selectAllComments = (state: RootState) => state.comments.items;

export const selectCommentsByNewsId = (newsId: string) =>
  createSelector(selectAllComments, (comments) =>
    comments.filter((comment) => comment.news_id === Number(newsId))
  );

export const selectCommentsFetching = (state: RootState) => state.comments.fetching;
export const selectCommentsCreating = (state: RootState) => state.comments.creating;

export const commentsSlice = createSlice({
  name: 'comments',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchComments.pending, (state) => {
        state.fetching = true;
        state.error = false;
      })
      .addCase(fetchComments.fulfilled, (state, {payload: comments}) => {
        state.fetching = false;
        state.items = comments;
      })
      .addCase(fetchComments.rejected, (state) => {
        state.fetching = false;
        state.error = true;
      })
      .addCase(addComment.pending, (state) => {
        state.creating = true;
        state.error = false;
      })
      .addCase(addComment.fulfilled, (state) => {
        state.creating = false;
      })
      .addCase(addComment.rejected, (state) => {
        state.creating = false;
        state.error = true;
      })
      .addCase(deleteComment.pending, (state, {meta}) => {
        state.deleting = meta.arg;
        state.error = false;
      })
      .addCase(deleteComment.fulfilled, (state) => {
        state.deleting = false;
      })
      .addCase(deleteComment.rejected, (state) => {
        state.deleting = false;
        state.error = true;
      });
  }
});

export const commentsReducer = commentsSlice.reducer;