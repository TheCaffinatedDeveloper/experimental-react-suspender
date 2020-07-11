import React from 'react';
import { fetchPosts, fetchComments } from '../utils/fixture-fetchers';
import { Profile } from '../profile';

export default function App() {
  const posts = fetchPosts();
  const comments = fetchComments();
  return <Profile posts={posts} comments={comments} />;
}
