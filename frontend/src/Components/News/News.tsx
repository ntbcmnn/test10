import React from 'react';
import NoPictureImage from '../../assets/noPicture.jpg';
import { api_URL } from '../../globalConstants.ts';
import { NavLink } from 'react-router-dom';
import { useAppDispatch } from '../../app/hooks.ts';
import { deleteNews, fetchNews } from '../../store/thunks/newsThunk.ts';
import { INews } from '../../types';
import { toast } from 'react-toastify';

interface Props {
  news: INews;
  image: string | null | undefined;
}

const News: React.FC<Props> = ({news, image}) => {
  const dispatch = useAppDispatch();

  let productsImage: string = NoPictureImage;

  if (image) {
    productsImage = api_URL + '/' + image;
  }

  const handleDelete: () => Promise<void> = async () => {
    if (!news) {
      toast.error('Cannot delete: news not found');
      return;
    }

    if (confirm('Are you sure you want to delete this post?')) {
      await dispatch(deleteNews(news.id));
      await dispatch(fetchNews());
      toast.success('Post deleted successfully!');
    } else {
      toast.info('You declined post deletion');
    }
  };

  return (
    <>
      <div className="card mb-5">
        <div className="card-body">
          <div className="d-flex gap-5">
            <img className="w-25 rounded-4" src={productsImage} alt={news.title}/>
            <h5 className="card-title mt-4">{news.title}</h5>
          </div>
          <div className="d-flex justify-content-between align-items-center mt-4">
            <p className="text-muted m-0 p-0">{new Date(news.publication_date).toLocaleString()}</p>
            <div className="d-flex gap-4 align-items-center">
              <NavLink to={`/news/${news.id}`} className="card-link">
                Read full post
              </NavLink>
              <button
                className="btn btn-dark d-inline-flex gap-2"
                onClick={handleDelete}
              >
                Delete
                <i className="bi bi-trash3"></i>
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default News;