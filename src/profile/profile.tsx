import React from 'react';
import { Suspender } from 'src/suspender';
import { Posts } from './posts/posts';
import { ICommentData, IPostData } from 'src/utils/fixture-types';
import { Comments } from './comments/comments';

// posts and comments will be promises entering suspender but not leaving :)
interface Profile {
  posts: IPostData,
  comments: ICommentData
}

const Username = () => <h1 data-testid="username" style={{ marginBottom: 10 }}>John Doe</h1>;

export function Profile({ posts, comments }: Profile) {
  return (
    <Suspender fallback={<div>Loading...</div>}>
      <Username />
      <Posts posts={posts} />
      <Comments comments={comments} />
    </Suspender>
  );
}
