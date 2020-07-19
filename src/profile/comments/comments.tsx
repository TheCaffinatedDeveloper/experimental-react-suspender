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
      <span role="heading" >Comments</span>
      <ul>
        {data.map((comment) => (
          <li key={comment.id}>{comment.body}</li>
        ))}
      </ul>
    </div>
  );
}
