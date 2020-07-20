import axios from 'axios';
import { IPostData, ICommentData } from './fixture-types';

const BASE_URL = 'https://my-json-server.typicode.com/typicode/demo';
const POSTS = '/posts';
const COMMENTS = '/comments';

export function fetchPosts() {
  const posts: Promise<IPostData> = axios.get(`${BASE_URL}${POSTS}`);
  return posts;
}

export function fetchComments() {
  const comments: Promise<ICommentData> = axios.get(`${BASE_URL}${COMMENTS}`);
  return comments;
}

export function fetchPostsSetTimeout() {
  const posts: Promise<IPostData> = new Promise((resolve) => setTimeout(() => resolve({
    data: [
      {
        "id": 1,
        "title": "Post 1"
      },
      {
        "id": 2,
        "title": "Post 2"
      },
      {
        "id": 3,
        "title": "Post 3"
      }
    ],
  }), 5000));
  return posts;
}
