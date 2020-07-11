import React from 'react';

export function Comments({ comments }) {
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
