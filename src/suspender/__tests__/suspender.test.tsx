import React from 'react';
import { render, waitFor } from '@testing-library/react';
import { Suspender } from 'src/suspender/suspender';
import { Posts } from 'src/profile/posts/posts';
import { Comments } from 'src/profile/comments/comments';
import { fetchPostsSetTimeout, fetchCommentsSetTimeout } from 'src/utils';
import { POSTS_ROUTE_TIMEOUT, COMMENTS_ROUTE_TIMEOUT } from 'src/constants';
import { IPostData, ICommentData } from 'src/utils/fixture-types';

let comments: Promise<ICommentData> | any;
let posts: Promise<IPostData> | any;

const Fallback = <div data-testid="fallback-loader">Loading...</div>;

beforeEach(() => {
  posts = fetchPostsSetTimeout();
  comments = fetchCommentsSetTimeout();
});

test('Suspender renders fallback while resolving props', () => {
  const { container } = render(
    <Suspender fallback={Fallback}>
      <Posts posts={posts} />
    </Suspender>,
  );
  expect(container).toHaveTextContent('Loading...');
});

test('Suspender resolves props and renders component', async () => {
  const { getByTestId } = render(
    <Suspender fallback={Fallback}>
      <Posts posts={posts} />
    </Suspender>,
  );

  await waitFor(() => expect(getByTestId('posts'))
    .toHaveTextContent('PostsPost 1Post 2Post 3'), {
    timeout: POSTS_ROUTE_TIMEOUT,
  });
});

test('Suspender renders non async component immediately', () => {
  const { container } = render(
    <Suspender fallback={Fallback}>
      <div>Hello, World!</div>
    </Suspender>,
  );
  expect(container).not.toHaveTextContent('Loading...');
  expect(container).toHaveTextContent('Hello, World!');
});

test('Suspender renders multiple components in correct order', () => {
  const POSTS_LIST_ID = 2;
  const { getAllByText, queryByTestId, queryAllByText } = render(
    <Suspender fallback={Fallback}>
      <Comments comments={comments} />
      <Posts posts={posts} />
      <div>Hello, World!</div>
    </Suspender>,
  );
  expect(getAllByText('Loading...')).toHaveLength(POSTS_LIST_ID);
  waitFor(() => {
    expect(queryByTestId('posts')).toBeTruthy();
    expect(queryByTestId('comments')).toBeFalsy();
  }, {
    timeout: COMMENTS_ROUTE_TIMEOUT,
  });
  waitFor(() => {
    expect(queryByTestId('comments')).toBeTruthy();
    expect(queryAllByText('Loading...')).toBeNull();
  });
});
