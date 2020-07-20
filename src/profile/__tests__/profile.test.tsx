import React from 'react';
import { Profile } from 'src/profile';
import { render } from '@testing-library/react';
import { fetchComments, fetchPostsSetTimeout } from 'src/utils/fixture-fetchers';

let comments: any;
let posts: any;

beforeAll(() => {
  comments = fetchComments();
  posts = fetchPostsSetTimeout();
});

test('Profile renders username, posts, and comments', async () => {
  const { getByTestId } = render(<Profile comments={comments} posts={posts} />);
  expect(getByTestId('username')).toHaveTextContent('John Doe');
});
