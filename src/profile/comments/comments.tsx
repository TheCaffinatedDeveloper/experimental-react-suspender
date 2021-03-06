import React from 'react';
import { IComments, IComment } from 'src/utils/fixture-types';
import { DATA_TESTIDS } from 'src/constants';

export function Comments({ comments }: IComments) {
  return (
    <div data-testid={DATA_TESTIDS.comments}>
      <span role="heading">Comments</span>
      <ul data-testid={DATA_TESTIDS.commentsList}>
        {comments.map((comment: IComment) => (
          <li key={comment.id}>{comment.body}</li>
        ))}
      </ul>
    </div>
  );
}
