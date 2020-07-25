import React from 'react';
import { IPosts, IPost } from 'src/utils/fixture-types';

export function Posts({ posts }: IPosts) {
  const { data } = posts;
  return (
    <div data-testid="posts">
      <span role="heading">Posts</span>
      <ul data-testid="posts-list">
        {data.map((post: IPost) => (
          <li key={post.id}>{post.title}</li>
        ))}
      </ul>
    </div>
  );
}
