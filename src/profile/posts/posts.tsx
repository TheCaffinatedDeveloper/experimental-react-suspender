import React from 'react';
import { IPosts, IPost } from 'src/utils/fixture-types';
import { DATA_TESTIDS } from 'src/constants';

export function Posts({ posts }: IPosts) {
  const { data } = posts;
  return (
    <div data-testid={DATA_TESTIDS.posts}>
      <span role="heading">Posts</span>
      <ul data-testid={DATA_TESTIDS.postsList}>
        {data.map((post: IPost) => (
          <li key={post.id}>{post.title}</li>
        ))}
      </ul>
    </div>
  );
}
