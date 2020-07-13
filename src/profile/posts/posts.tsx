import React from 'react';

interface Post {
  id: string,
  title: string,
}

export interface PostData {
  data: [Post],
}

interface Posts {
  posts: PostData,
}

export function Posts({ posts }: Posts) {
  const { data } = posts;
  return (
    <div>
      <span>Posts</span>
      <ul>
        {data.map((post: Post) => (
          <li key={post.id}>{post.title}</li>
        ))}
      </ul>
    </div>
  )
}
