import React from 'react';
import { Suspender } from '../suspender';
import { Posts } from './posts/posts';
import { Comments } from './comments/comments';

const Username = () => <h1 style={{ marginBottom: 10 }}>John Doe</h1>;

export function Profile({ posts, comments }) {
  return (
    <Suspender fallback={<div>Loading...</div>}>
      <Username />
      <Posts posts={posts} />
      <Comments comments={comments} />
    </Suspender>
    
  );
}
