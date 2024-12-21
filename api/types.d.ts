export interface News {
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

export type CommentMutation = Omit<Comment, 'id'>;
export type NewsMutation = Omit<News, 'id', 'publication_date'>;