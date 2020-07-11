import React from 'react';
import { Suspender } from '../suspender';
import { Posts } from './posts/posts';
import { Comments } from './comments/comments';

const usernameStyle = {
  fontWeight: 'bold',
  marginBottom: 10,
};

const Username = () => <div style={usernameStyle}>Sample Username</div>;

export function Profile({ posts, comments }) {
  return (
    <Suspender fallback={<div>Loading...</div>}>
      <Username />
      <Posts posts={posts} />
      <Comments comments={comments} />
    </Suspender>
  );
}
