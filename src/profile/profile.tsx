import React from 'react';
import { Suspender } from 'lib';
import { IComment, IPost } from 'src/utils/fixture-types';
import { FallbackLoader } from 'src/loaders';
import { DATA_TESTIDS } from 'src/constants';
import { Posts } from './posts/posts';
import { Comments } from './comments/comments';

// posts and comments will be promises entering suspender but not leaving :)
interface IUsername {
  username: string,
}
interface Profile {
  posts: IPost[],
  comments: IComment[],
  username: string,
}

const Username = ({ username }: IUsername) => (
  <h1 data-testid={DATA_TESTIDS.username} style={{ marginBottom: 10 }}>
    {username}
  </h1>
);

export function Profile({ posts, comments, username }: Profile) {
  return (
    <Suspender fallback={<FallbackLoader />} axios>
      <Username username={username} />
      <Posts posts={posts} />
      <Comments comments={comments} />
    </Suspender>
  );
}
