import React from 'react';
import { AsyncTracker } from 'src/suspender/async-tracker';
import { Posts } from 'src/profile/posts/posts';
import { Comments } from 'src/profile/comments/comments';
import { fixturePosts, fixtureComments } from 'src/data';
import { fetchPostsSetTimeout, fetchCommentsSetTimeout } from 'src/utils';
import { IPostData, ICommentData } from 'src/utils/fixture-types';

let reactChildren: JSX.Element[];
let asyncTracker: AsyncTracker;
let comments: Promise<ICommentData> | any;
let posts: Promise<IPostData> | any;

const propNameToFixtureData = {
  comments: fixtureComments,
  posts: fixturePosts,
};

const FIRST_PROP = 0;

const NoAsyncPropsHere = () => (<div>No async props here</div>);

beforeEach(() => {
  comments = fetchCommentsSetTimeout();
  posts = fetchPostsSetTimeout();
});

test('creates tracker with only async components provided', () => {
  reactChildren = [<Comments comments={comments} />, <Posts posts={posts} />];
  asyncTracker = new AsyncTracker(reactChildren);
  Object.entries(asyncTracker.tracker).forEach(([key, value]: [string, any], idx) => {
    const trackerPropName = Object.keys(value)[FIRST_PROP];
    const componentPropName = Object.keys(reactChildren[idx].props)[FIRST_PROP];
    // Expect components with async props to be added with unqiue key
    expect(key).toEqual(`${reactChildren[idx].type.name}-${idx}`);
    // Expect tracker to have the same prop name as the async prop
    expect(trackerPropName).toEqual(componentPropName);
    // Expect props to be promises
    expect(value[trackerPropName].promise).toBeInstanceOf(Promise);
  });
});

test('tracker does not include components without async props', () => {
  reactChildren = [
    <Comments comments={comments} />,
    <Posts posts={posts} />,
    <NoAsyncPropsHere />,
  ];
  const NON_ASYNC_COMPONENT = 'NoAsyncPropsHere-0';
  asyncTracker = new AsyncTracker(reactChildren);
  const components = Object.keys(asyncTracker.tracker);
  expect(NON_ASYNC_COMPONENT in components).toBeFalsy();
});

test('tracker resolves async props', (done) => {
  reactChildren = [
    <Comments comments={comments} />,
    <Posts posts={posts} />,
  ];
  asyncTracker = new AsyncTracker(reactChildren);
  let resolvedCount = 0;
  function callback(tracker: Record<string, Record<string, unknown>>) {
    resolvedCount++;
    if (resolvedCount === reactChildren.length) {
      reactChildren.forEach((child: JSX.Element, idx: number) => {
        const { name } = child.type;
        const component = tracker[`${name}-${idx}`];
        Object.values(component).forEach((prop: Record<string, unknown>) => {
          expect(prop.resolved).toBeTruthy();
        });
        // hasAllResolved should be truthy in this test
        expect(asyncTracker.hasAllResolved(name)).toBeTruthy();
      });
      done();
    }
  }
  asyncTracker.resolveAsnycProps(callback);
});

test('tracker constructs resolved props correctly', (done) => {
  reactChildren = [
    <Comments comments={comments} />,
    <Posts posts={posts} />,
  ];
  asyncTracker = new AsyncTracker(reactChildren);
  let resolvedCount = 0;
  asyncTracker.resolveAsnycProps(() => {
    resolvedCount++;
    if (resolvedCount === reactChildren.length) {
      reactChildren.forEach((child: JSX.Element, idx: number) => {
        const { name } = child.type;
        const propName = Object.keys(child.props)[FIRST_PROP];
        const props = asyncTracker.constructResolvedProps(`${name}-${idx}`);
        const { data } = props[propName];
        expect(JSON.stringify(data)).toEqual(JSON.stringify(propNameToFixtureData[propName]));
      });
      done();
    }
  });
});
