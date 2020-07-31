import React from 'react';
import { IPosts, IPost } from 'src/utils/fixture-types';
import { DATA_TESTIDS } from 'src/constants';

export function Posts({ posts }: IPosts) {
  return (
    <div data-testid={DATA_TESTIDS.posts}>
      <span role="heading">Posts</span>
      <ul data-testid={DATA_TESTIDS.postsList}>
        {posts.map((post: IPost) => (
          <li key={post.id}>{post.title}</li>
        ))}
      </ul>
    </div>
  );
}
