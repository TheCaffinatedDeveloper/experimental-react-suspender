import React from 'react';
import '@testing-library/jest-dom';
import { render } from '@testing-library/react';
import { fetchComments } from 'src/utils/fixture-fetchers';
import { Comments } from 'src/profile/comments/comments';

test('Renders the list header', async () => {
  const comments = await fetchComments();
  const { getByRole } = render(<Comments comments={comments} />);
  expect(getByRole('heading')).toHaveTextContent('Comments');
});
