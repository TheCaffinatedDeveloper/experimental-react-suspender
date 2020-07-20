import React from 'react';
import { Suspender } from 'src/suspender';
import { Posts } from './posts/posts';
import { ICommentData, IPostData } from 'src/utils/fixture-types';
import { Comments } from './comments/comments';

// posts and comments will be promises entering suspender but not leaving :)
interface IUsername {
  username: string,
}
interface Profile extends IUsername {
  posts: IPostData,
  comments: ICommentData,
}

const Loader = () => <div>Loading...</div>;

const Username = ({ username }: IUsername) => (
  <h1 data-testid="username" style={{ marginBottom: 10 }}>
    {username}
  </h1>
);

export function Profile({ posts, comments, username }: Profile) {
  return (
    <Suspender fallback={<Loader />}>
      <Username username={username}/>
      <Posts posts={posts} />
      <Comments comments={comments} />
    </Suspender>
  );
}
