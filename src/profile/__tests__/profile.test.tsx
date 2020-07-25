/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import { Profile } from 'src/profile';
import { render, waitFor, waitForElementToBeRemoved } from '@testing-library/react';
import { POSTS_ROUTE_TIMEOUT, DATA_TESTIDS } from 'src/constants';
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
  expect(getByTestId(DATA_TESTIDS.username)).toHaveTextContent(username);
  // Comments and Posts both have async props, suspender should fallback twice
  expect(getAllByTestId(DATA_TESTIDS.fallbackLoader)).toHaveLength(NUMBER_ASYNC_PROPS);
  // Comments should resolve first
  await waitFor(() => getByTestId(DATA_TESTIDS.comments));
  // Now there should only be one loader
  expect(getAllByTestId(DATA_TESTIDS.fallbackLoader)).toHaveLength(1);
  // wait for posts to resolve
  await waitForElementToBeRemoved(getAllByTestId(DATA_TESTIDS.fallbackLoader), {
    timeout: POSTS_ROUTE_TIMEOUT,
  });
  // No more loaders
  expect(queryByTestId(DATA_TESTIDS.fallbackLoader)).toBeNull();
  // posts should be truthy now
  expect(getByTestId(DATA_TESTIDS.posts)).toBeTruthy();
});
