import { INews } from '../../types';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../../app/store.ts';
import { addNews, deleteNews, fetchNews, getNewsById } from '../thunks/newsThunk.ts';

interface INewsState {
  items: INews[];
  fetching: boolean;
  oneItem: INews | null;
  creating: boolean;
  deleting: boolean | string;
  error: boolean;
}

const initialState: INewsState = {
  items: [],
  fetching: false,
  oneItem: null,
  creating: false,
  deleting: false,
  error: false,
};

export const selectAllNews = (state: RootState) => state.news.items;
export const selectOneNews = (state: RootState) => state.news.oneItem;

export const selectNewsFetching = (state: RootState) => state.news.fetching;
export const selectNewsCreating = (state: RootState) => state.news.creating;

export const newsSlice = createSlice({
  name: 'news',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchNews.pending, (state) => {
        state.fetching = true;
        state.error = false;
      })
      .addCase(fetchNews.fulfilled, (state, {payload: news}) => {
        state.fetching = false;
        state.items = news;
      })
      .addCase(fetchNews.rejected, (state) => {
        state.fetching = false;
        state.error = true;
      })
      .addCase(getNewsById.pending, (state) => {
        state.fetching = true;
        state.error = false;
      })
      .addCase(getNewsById.fulfilled, (state, action: PayloadAction<INews | null>) => {
        state.fetching = false;
        state.oneItem = action.payload;
      })
      .addCase(getNewsById.rejected, (state) => {
        state.fetching = false;
        state.error = true;
      })
      .addCase(addNews.pending, (state) => {
        state.creating = true;
        state.error = false;
      })
      .addCase(addNews.fulfilled, (state) => {
        state.creating = false;
      })
      .addCase(addNews.rejected, (state) => {
        state.creating = false;
        state.error = true;
      })
      .addCase(deleteNews.pending, (state, {meta}) => {
        state.deleting = meta.arg;
        state.error = false;
      })
      .addCase(deleteNews.fulfilled, (state) => {
        state.deleting = false;
      })
      .addCase(deleteNews.rejected, (state) => {
        state.deleting = false;
        state.error = true;
      });
  }
});

export const newsReducer = newsSlice.reducer;