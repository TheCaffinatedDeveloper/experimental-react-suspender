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
