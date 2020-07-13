import React from 'react';
import { Suspender } from '/suspender';
import { Posts } from './posts/posts';
import { Comments } from './comments/comments';

// posts and comments may or may not be a promise, typescript doesn't seem to allow
// this is to be ambigous via union
interface Profile {
  posts: any,
  comments: any
}

const Username = () => <h1 style={{ marginBottom: 10 }}>John Doe</h1>;

export function Profile({ posts, comments }: Profile) {
  return (
    <Suspender fallback={<div>Loading...</div>}>
      <Username />
      <Posts posts={posts} />
      <Comments comments={comments} />
    </Suspender>
  );
}
