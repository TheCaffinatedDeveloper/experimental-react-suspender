/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import { Profile } from 'src/profile';
import { render, waitFor, waitForElementToBeRemoved } from '@testing-library/react';
import { POSTS_ROUTE_TIMEOUT } from 'src/constants';
import {
  fetchComments,
  fetchPostsSetTimeout,
  fetchUsername,
} from 'src/utils';

const NUMBER_ASYNC_PROPS = 2;

let comments: any;
let posts: any;
let username: string;

beforeAll(() => {
  comments = fetchComments();
  posts = fetchPostsSetTimeout();
  username = fetchUsername();
});

test('Profile renders username, posts, and comments', async () => {
  const { getByTestId, getAllByTestId, queryByTestId } = render(
    <Profile
      comments={comments}
      posts={posts}
      username={username}
    />,
  );
  // Username has no async props so it shoudl render right away
  expect(getByTestId('username')).toHaveTextContent(username);
  // Comments and Posts both have async props, suspender should fallback twice
  expect(getAllByTestId('fallback-loader')).toHaveLength(NUMBER_ASYNC_PROPS);
  // Comments should resolve first
  await waitFor(() => getByTestId('comments'));
  // Now there should only be one loader
  expect(getAllByTestId('fallback-loader')).toHaveLength(1);
  // wait for posts to resolve
  await waitForElementToBeRemoved(getAllByTestId('fallback-loader'), {
    timeout: POSTS_ROUTE_TIMEOUT,
  });
  // No more loaders
  expect(queryByTestId('fallback-loader')).toBeNull();
  // posts should be truthy now
  expect(getByTestId('posts')).toBeTruthy();
});
