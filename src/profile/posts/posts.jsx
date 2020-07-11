import React from 'react';

export function Posts({ posts }) {
  const { data } = posts;
  return (
    <div>
      <span>Posts</span>
      <ul>
        {data.map((post) => (
          <li key={post.id}>{post.title}</li>
        ))}
      </ul>
    </div>
  )
}
