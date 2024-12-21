export interface INews {
  id: string;
  title: string;
  content: string;
  image: string | null;
  publication_date: string;
}

export interface Comment {
  id: string;
  news_id: number;
  author: string;
  content: string;
}

export interface INewsMutation {
  title: string;
  content: string;
  image: File | null;
}

export interface CommentMutation {
  news_id: number;
  author: string;
  content: string;
}