import React from 'react';
import { fetchComments, fetchPostsSetTimeout } from 'src/utils/fixture-fetchers';
import { Profile } from 'src/profile';

export default function App() {
  // Slowed down for demo purposes
  const posts: Promise<Object> = fetchPostsSetTimeout();
  // "In the wild" REST API GET Request
  const comments: Promise<Object> = fetchComments();
  return <Profile posts={posts} comments={comments} />;
}
