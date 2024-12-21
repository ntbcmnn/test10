import { useAppDispatch, useAppSelector } from '../../app/hooks.ts';
import { selectAllNews, selectNewsFetching } from '../../store/slices/newsSlice.ts';
import { useEffect } from 'react';
import { fetchNews, getNewsById } from '../../store/thunks/newsThunk.ts';
import { CommentMutation, INews } from '../../types';
import News from '../../Components/News/News.tsx';
import Loader from '../../Components/UI/Loader/Loader.tsx';
import { Link, useParams } from 'react-router-dom';
import { addComment, deleteComment, fetchComments } from '../../store/thunks/commentsThunk.ts';
import { selectCommentsByNewsId, selectCommentsFetching } from '../../store/slices/commentsSlice.ts';
import AddComment from '../../Components/AddComment/AddComment.tsx';

const AllNews = () => {
  const dispatch = useAppDispatch();
  const isLoading = useAppSelector(selectNewsFetching);
  const allNews = useAppSelector(selectAllNews);
  const {newsId} = useParams<{ newsId: string }>();
  const comments = useAppSelector(selectCommentsByNewsId(newsId!));
  const isCommentsFetching = useAppSelector(selectCommentsFetching);

  useEffect(() => {
    if (newsId) {
      dispatch(getNewsById(newsId));
      dispatch(fetchComments(newsId));
    } else {
      dispatch(fetchNews());
    }
  }, [dispatch, newsId]);

  const handleAddComment = (commentMutation: CommentMutation) => {
    dispatch(addComment(commentMutation));
  };

  const handleDeleteComment = (commentId: string) => {
    dispatch(deleteComment(commentId));
  };

  return (
    <>
      <div className="d-flex justify-content-between align-items-center mb-5">
        <h3>Posts</h3>
        <Link to="/news/addNews">Add news</Link>
      </div>

      {isLoading ? (
        <Loader/>
      ) : (
        <>
          {allNews.length !== 0 ? (
            allNews.map((news: INews) => (
                <>
                  <News key={news.id} news={news} image={news.image}/>
                  <>
                    {isCommentsFetching ? <Loader/> :
                      <>
                        {comments.length === 0 ?
                          <h3 className="text-center my-4">No comments found for this post</h3>
                          :
                          <>
                            <h3 className="text-center my-4">Comments for this post:</h3>
                            {comments.map(comment => (
                              <div key={comment.id}>
                                <p>{comment.author}: {comment.content}</p>
                                <button onClick={() => handleDeleteComment(comment.id)}>Delete</button>
                              </div>
                            ))}
                          </>
                        }
                        <AddComment onSubmit={handleAddComment} newsId={Number(newsId)}/>
                      </>
                    }
                  </>
                </>
              )
            )
          ) : (
            <h4 className="text-center">No news found</h4>
          )}
        </>
      )}
    </>
  );
};

export default AllNews;