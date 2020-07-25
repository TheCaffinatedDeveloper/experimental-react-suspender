import { IPost, IComment } from 'src/utils/fixture-types';

const fixtureComments: IComment[] = [
  {
    id: 1,
    body: 'some comment',
    postId: 1,
  },
  {
    id: 2,
    body: 'some comment',
    postId: 1,
  },
];

const fixturePosts: IPost[] = [
  {
    id: 1,
    title: 'Post 1',
  },
  {
    id: 2,
    title: 'Post 2',
  },
  {
    id: 3,
    title: 'Post 3',
  },
];

export {
  fixtureComments,
  fixturePosts,
};
