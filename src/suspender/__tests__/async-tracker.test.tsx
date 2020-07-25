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

// Presentational component without async props
const NoAsyncPropsHere = () => (<div>No async props here</div>);

// prepare mock data before reach test - resets settimeout logic
beforeEach(() => {
  comments = fetchCommentsSetTimeout();
  posts = fetchPostsSetTimeout();
});

/**
 * Async tracker should only concern itself with keeping track of components
 * that have at least one async prop
 */
test('creates tracker with only async components provided', () => {
  // Mock props.children
  reactChildren = [<Comments comments={comments} />, <Posts posts={posts} />];
  // init new tracker from mock children
  asyncTracker = new AsyncTracker(reactChildren);
  // Check structure / behavior of async tracker
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

// async tracker should ignore components that do not have async props
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

/**
 * Async tracker will update the state of Suspender instance via a CB called
 * when each individual async prop resolves. This is done by calling .then on
 * each async prop in rapid sucession.
 */
test('tracker resolves async props', (done) => {
  reactChildren = [
    <Comments comments={comments} />,
    <Posts posts={posts} />,
  ];
  asyncTracker = new AsyncTracker(reactChildren);
  // simple counter to keep track of expected CB calls for .then
  let resolvedCount = 0;
  function callback(tracker: Record<string, Record<string, unknown>>) {
    resolvedCount++;
    if (resolvedCount === reactChildren.length) {
      reactChildren.forEach((child: JSX.Element, idx: number) => {
        const { name } = child.type;
        // name of component in tracker
        const component = tracker[`${name}-${idx}`];
        Object.values(component).forEach((prop: Record<string, unknown>) => {
          // each prop in tracker should now have a resolved key value pair
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

/**
 * At the appropriate time, suspender will ask for the resolved props for a component.
 * Async tracker will construct resolved props to replace what was once async props.
 * constructed props will be assigned to the same name as the original prop
 */
test('tracker constructs resolved props correctly', (done) => {
  reactChildren = [
    <Comments comments={comments} />,
    <Posts posts={posts} />,
  ];
  asyncTracker = new AsyncTracker(reactChildren);
  let resolvedCount = 0;
  asyncTracker.resolveAsnycProps(() => {
    // make sure everything has resolved before performing expectations
    resolvedCount++;
    if (resolvedCount === reactChildren.length) {
      reactChildren.forEach((child: JSX.Element, idx: number) => {
        const { name } = child.type;
        const propName = Object.keys(child.props)[FIRST_PROP];
        const props = asyncTracker.constructResolvedProps(`${name}-${idx}`);
        const { data } = props[propName];
        // compare the resolved prop data to the mock data schema to ensure accuracy
        // using JSON.stringify hack for quick object comparison without Lodash dependency
        expect(JSON.stringify(data)).toEqual(JSON.stringify(propNameToFixtureData[propName]));
      });
      done();
    }
  });
});
