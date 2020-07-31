# experimental-react-suspender
An alternative approach to React Concurrent Mode Experimental Suspense component

# Disclaimer:
experimental-react-suspender is listed as "experimental" for two reasons.
1) React's Suspense is still in its experimental stage
2) This library is unique in the way it handles async props. While this is being used in production, it is not heavily battle tested and there are likely corner cases that will need to be patched in coming updates.

# What does it do?
experimental-react-suspender exports one component "Suspender". Suspender is responsible for doing an array of things..it will
1) Look for async props passed to any of its children
2) Resolve all async props by calling .then on each of promise (this will add them to the tasks event loop)
3) Will render a fallback loader for each individual component until the data is ready. Note: it will render the actual component immediately once the data is ready.
4) Suspender will render components that do not have async components immediately as expected.
5) Finally, suspender will update internal state whenever something resolves to render the actual component

## INSTALLATION
`npm install experimental-react-suspender`

## USAGE
`import { Suspender } from 'experimental-react-suspender';`

##### Example:
```
const somePromise = axios.get('/posts?ID=1234');
return (
  <Suspender fallback={<MyFallbackComponent />} axios>
    <Child1 asyncProp={axios.get('/user?ID=12345')} regularProp={"I fallback until my data is ready"} />
    <Child2 asyncProp={somePromise} regularProp={"I can render before Child1 if my data is ready first"} />
    <Child3 regularProp={"I render immediately"} />
  </Suspender>
);
```

## PROPS
|Property|Type(Default)|Description|
|--------|-------------|-----------|
|fallback (required)|React.Element|Component to render while async props are resolved.|
|axios (optional)|boolean|Sets axios mode which will autmatically extract resolved data from a "data" key.|
|extractKey (optional)|string|Accepts key as string to be used to extract resolved data by any key provided.|
|children (required)|React.Element[]|Child components nested inside Suspender. Suspender should not be used without children.|


### IMPORTANT
##### Suspender should wrap the child components that will be responsible for rendering the data or the entire tree will suspend

# How does it work?
The implementation used here is the basic idea to give the react community an alternative approach that React's Suspense tries to overcome. With suspense, the general idea is to throw a Promise as an error when something async has yet to resolve. Suspense will then catch the error, call .then() to resolve the promise, and render a fallback. 

Throwing an error to show loading logic just smells. It *feels* like an anti-pattern and so experimental-react-suspender offers an alternative approach to get people and possibly the React team thinking. When a component throws an error it unmounts entirely but this is not so with Suspense. Suspense only unwinds as much as it needs to, keeping as much of the React tree mounted as it can.

With Suspender, there are no errors thrown. Because we know which components require data fetched from outside our app, we should be able to scaffold our application in such a way that follows the fetch-then-render approach while also having some easy to use loading logic. Suspender does this by searching for async props, adding them to a *queue* and resolving them incrementally. As the props resolve, the original element is cloned and the props are overriden with the resolved version.

# Demo

## INSTALLATION
1) Clone Repo
2) `npm install`
3) `npm run hot`

## TESTS
1) `npm run test`

![](suspender-demo.gif)
