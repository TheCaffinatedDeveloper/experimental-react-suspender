import axios from 'axios';

const BASE_URL = 'https://my-json-server.typicode.com/typicode/demo';
const POSTS = '/posts';
const COMMENTS = '/comments';

export function fetchPosts() {
  const posts = axios.get(`${BASE_URL}${POSTS}`);
  return posts;
}

export function fetchComments() {
  const comments = axios.get(`${BASE_URL}${COMMENTS}`);
  return comments;
}

export function fetchPostsSetTimeout() {
  const posts = new Promise((resolve) => setTimeout(() => resolve({
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
