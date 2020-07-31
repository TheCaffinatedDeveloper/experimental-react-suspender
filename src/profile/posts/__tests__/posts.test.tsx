import React from 'react';
import { render } from '@testing-library/react';
import { fetchPosts } from 'src/utils';
import {
  POSTS_HEADER,
  POSTS_LIST_ID,
} from 'src/constants';
import { Posts } from 'src/profile/posts/posts';
import { IPostData, IPost } from 'src/utils/fixture-types';

let numPosts: number;
const textContent: string[] = [];

// Scan data needed by posts component
beforeAll(async () => {
  const { data }: IPostData = await fetchPosts();
  numPosts = data.length;
  data.forEach((comment: IPost) => { textContent.push(comment.title); });
});

test('Renders the list header', async () => {
  // fetch data
  const { data } = await fetchPosts();
  // mount component
  const { getByRole, getByTestId } = render(<Posts posts={data} />);
  // Comments header should be accurately present
  expect(getByRole('heading')).toHaveTextContent(POSTS_HEADER);
  // Grab list node
  const listNode = getByTestId(POSTS_LIST_ID);
  // Number of list items should match number of comments
  expect(listNode.childElementCount).toBe(numPosts);
  // Each list item should have expected text
  Array.from(listNode.children).forEach((listItem, idx) => {
    expect(listItem).toHaveTextContent(textContent[idx]);
  });
});
