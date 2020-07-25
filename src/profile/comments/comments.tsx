import React from 'react';
import { IComments, IComment } from 'src/utils/fixture-types';

export function Comments({ comments }: IComments) {
  const { data } = comments;
  return (
    <div data-testid="comments">
      <span role="heading">Comments</span>
      <ul data-testid="comments-list">
        {data.map((comment: IComment) => (
          <li key={comment.id}>{comment.body}</li>
        ))}
      </ul>
    </div>
  );
}
