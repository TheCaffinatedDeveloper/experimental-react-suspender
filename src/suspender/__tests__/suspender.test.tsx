import React from 'react';
import { render, waitFor } from '@testing-library/react';
import { Suspender } from 'src/suspender/suspender';
import { Posts } from 'src/profile/posts/posts';
import { Comments } from 'src/profile/comments/comments';
import { fetchPostsSetTimeout, fetchCommentsSetTimeout } from 'src/utils';
import { FallbackLoader } from 'src/loaders';
import {
  POSTS_ROUTE_TIMEOUT,
  COMMENTS_ROUTE_TIMEOUT,
  LOADING_TEXT,
  DATA_TESTIDS,
  POSTS_TEXT_CONTENT,
} from 'src/constants';
import { IPostData, ICommentData } from 'src/utils/fixture-types';

let comments: Promise<ICommentData> | any;
let posts: Promise<IPostData> | any;

/**
 * Prepare posts and comments as set timeout promises before each test.
 * Using mock data to avoid reliance on axios in tests
 */
beforeEach(() => {
  posts = fetchPostsSetTimeout();
  comments = fetchCommentsSetTimeout();
});

/**
 * Ensure that when rendering a component that has at least one async prop while
 * wrapped in suspender will render fallback loader while prop resolves.
 */
test('Suspender renders fallback while resolving props', () => {
  const { container } = render(
    <Suspender fallback={<FallbackLoader />}>
      <Posts posts={posts} />
    </Suspender>,
  );
  // Expect to see the loader
  expect(container).toHaveTextContent(LOADING_TEXT);
});

/**
 * Components who have at least one async prop should have their prop
 * resolved by suspender and then render appropriately.
 */
test('Suspender resolves props and renders component', async () => {
  const { getByTestId } = render(
    <Suspender fallback={<FallbackLoader />}>
      <Posts posts={posts} />
    </Suspender>,
  );

  // Fallback loader initially, wait for prop to resolve
  await waitFor(() => expect(getByTestId(DATA_TESTIDS.posts))
    .toHaveTextContent(POSTS_TEXT_CONTENT), {
    timeout: POSTS_ROUTE_TIMEOUT,
  });
});

/**
 * You can mix components who have async props with those that don't.
 * Any component that does not have an async prop should resolve
 * immediately.
 */
test('Suspender renders non async component immediately', () => {
  const { container } = render(
    <Suspender fallback={<FallbackLoader />}>
      <div>Hello, World!</div>
    </Suspender>,
  );
  // Ensure there was never a loader
  expect(container).not.toHaveTextContent(LOADING_TEXT);
  // ensure component rendered correctly
  expect(container).toHaveTextContent('Hello, World!');
});

/**
 * Components should be able to render in the order their props were resolved.
 * In this test, posts have a shorter timeout (come back from the server faster).
 * Since posts and comments are siblings, post should render first while
 * comments will still be loading.
 * Comments will eventually resolve.
 */
test('Suspender renders multiple components in correct order', () => {
  const POSTS_LIST_ID = 2;
  const { getAllByText, queryByTestId, queryAllByText } = render(
    <Suspender fallback={<FallbackLoader />}>
      <Comments comments={comments} />
      <Posts posts={posts} />
      <div>Hello, World!</div>
    </Suspender>,
  );
  // Start with two loaders since there are two components with async props
  expect(getAllByText(LOADING_TEXT)).toHaveLength(POSTS_LIST_ID);
  // posts should resolve first with comments still loading
  waitFor(() => {
    expect(queryByTestId(DATA_TESTIDS.posts)).toBeTruthy();
    expect(queryByTestId(DATA_TESTIDS.comments)).toBeFalsy();
  }, {
    timeout: COMMENTS_ROUTE_TIMEOUT,
  });
  // Comments should now be rendered and no loaders present;
  waitFor(() => {
    expect(queryByTestId(DATA_TESTIDS.comments)).toBeTruthy();
    expect(queryAllByText(LOADING_TEXT)).toBeNull();
  });
});
