import React from 'react';
import { fetchComments, fetchPostsSetTimeout } from 'src/utils/fixture-fetchers';
import { Profile } from 'src/profile';

export default function App() {
  // Slowed down for demo purposes
  const posts: any = fetchPostsSetTimeout();
  // "In the wild" REST API GET Request
  const comments: any = fetchComments();
  return <Profile posts={posts} comments={comments} />;
}
