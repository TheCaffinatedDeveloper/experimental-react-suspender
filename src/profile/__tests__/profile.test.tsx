import React from 'react';
import { Profile } from 'src/profile';
import { render } from '@testing-library/react';
import { fetchComments,
  fetchPostsSetTimeout,
  USERNAME_FIXTURE } from 'src/utils/fixture-fetchers';

let comments: any;
let posts: any;

beforeAll(() => {
  comments = fetchComments();
  posts = fetchPostsSetTimeout();
});

test('Profile renders username, posts, and comments', async () => {
  const { getByTestId } = render(
    <Profile
      comments={comments}
      posts={posts}
      username={USERNAME_FIXTURE}
    />
  );
  expect(getByTestId('username')).toHaveTextContent(USERNAME_FIXTURE);
});
