import React from 'react';

interface Data {
  data: [
    {
      id: string,
      body: string,
    }
  ]
}

interface Comments {
  comments: Data,
}

export function Comments({ comments }: Comments) {
  const { data } = comments;
  return (
    <div>
      <span>Comments</span>
      <ul>
        {data.map((comment) => (
          <li key={comment.id}>{comment.body}</li>
        ))}
      </ul>
    </div>
  );
}
