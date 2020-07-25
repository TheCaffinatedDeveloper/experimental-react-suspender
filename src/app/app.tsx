/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import {
  fetchComments,
  fetchPostsSetTimeout,
  fetchUsername,
} from 'src/utils';
import { Profile } from 'src/profile';

export function App() {
  // Slowed down for demo purposes
  const posts: any = fetchPostsSetTimeout();
  // "In the wild" REST API GET Request
  const comments: any = fetchComments();
  const username: string = fetchUsername();

  return (
    <Profile
      posts={posts}
      comments={comments}
      username={username}
    />
  );
}
