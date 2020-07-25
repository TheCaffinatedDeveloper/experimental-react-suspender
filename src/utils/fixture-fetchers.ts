import axios from 'axios';
import { fixtureComments, fixturePosts } from 'src/data';
import {
  BASE_URL,
  POSTS_ROUTE,
  COMMENTS_ROUTE,
  USERNAME_FIXTURE,
} from 'src/constants';
import { IPostData, ICommentData } from './fixture-types';

function fetchUsername() {
  return USERNAME_FIXTURE;
}

function fetchPosts() {
  const posts: Promise<IPostData> = axios.get(`${BASE_URL}${POSTS_ROUTE}`);
  return posts;
}

function fetchComments() {
  const comments: Promise<ICommentData> = axios.get(`${BASE_URL}${COMMENTS_ROUTE}`);
  return comments;
}

function fetchPostsSetTimeout() {
  const posts: Promise<IPostData> = new Promise((resolve) => setTimeout(() => resolve({
    data: fixturePosts,
  }), 3000));
  return posts;
}

function fetchCommentsSetTimeout() {
  const comments: Promise<ICommentData> = new Promise((resolve) => setTimeout(() => resolve({
    data: fixtureComments,
  }), 4000));
  return comments;
}

export {
  fetchPosts,
  fetchComments,
  fetchCommentsSetTimeout,
  fetchPostsSetTimeout,
  fetchUsername,
};
