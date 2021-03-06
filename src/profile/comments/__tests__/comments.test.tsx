import React from 'react';
import { render } from '@testing-library/react';
import { fetchComments } from 'src/utils';
import {
  COMMENTS_HEADER,
  COMMENTS_LIST_ID,
} from 'src/constants';
import { Comments } from 'src/profile/comments/comments';
import { ICommentData, IComment } from 'src/utils/fixture-types';

let numComments: number;
const textContent: string[] = [];

// Scan data needed by comments component
beforeAll(async () => {
  const { data }: ICommentData = await fetchComments();
  numComments = data.length;
  data.forEach((comment: IComment) => { textContent.push(comment.body); });
});

test('Renders the comments list', async () => {
  // fetch data
  const { data }: ICommentData = await fetchComments();
  // mount component
  const { getByRole, getByTestId } = render(<Comments comments={data} />);
  // Comments header should be accurately present
  expect(getByRole('heading')).toHaveTextContent(COMMENTS_HEADER);
  // Grab list node
  const listNode = getByTestId(COMMENTS_LIST_ID);
  // Number of list items should match number of comments
  expect(listNode.childElementCount).toBe(numComments);
  // Each list item should have expected text
  Array.from(listNode.children).forEach((listItem, idx) => {
    expect(listItem).toHaveTextContent(textContent[idx]);
  });
});
