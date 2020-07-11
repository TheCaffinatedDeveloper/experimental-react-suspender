import React from 'react';
import { fetchComments, fetchPostsSetTimeout } from '../utils/fixture-fetchers';
import { Profile } from '../profile';

export default function App() {
  // Slowed down for demo purposes
  const posts = fetchPostsSetTimeout();
  // "In the wild" REST API GET Request
  const comments = fetchComments();
  return <Profile posts={posts} comments={comments} />;
}
