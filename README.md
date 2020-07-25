# experimental-react-suspender
An experimental alternative approach to React Concurrent Mode Experimental Suspense component

experimental-react-suspender exports one component "Suspender". Suspender is responsible for doing an array of things..it will
1) Look for async props passed to any of its children
2) Resolve all async props by calling .then on each of promise (this will add them to the tasks event loop)
3) Will render a fallback loader for each individual component until the data is ready. Note: it will render the actual component immediately once the data is ready.
4) Suspender will render components that do not have async components immediately as expected.
5) Finally, suspender will update internal state whenever something resolves to render the actual component

## INSTALLATION
`npm install experimental-react-suspender`

## USAGE
`import { Suspender } from 'experimental-react-suspender`

### IMPORTANT
##### Suspender should wrap the child components that will be responsible for rendering the data or the entire tree will suspend

##### Example:
```
<Suspender fallback={<MyFallbackComponent />}>
  <Child1 asyncProp={somePromiseHere} regularProp={"I fallback until my data is ready"} />
  <Child2 asyncProp={somePromiseHere} regularProp={"I can render before child1 if my data is ready first"} />
  <Child3 regularProp={"I render immediately"} />
</Suspender>
```

# How does it work?
The implementation used here is very basic to give the react community an idea of how to approach the challenges React Conccurent Mode is trying to overcome with suspense. With suspense, the general idea is to throw a Promise as an error when something async has yet to resolve. Suspense will then catch the error, call .then() to resolve the promise, and render a fallback. 

Throwing an error to show loading logic just smells to me. It *feels* like an anti-pattern and so I wanted to offer an alternative approach to get people and possible the React team thinking. Suspense is cool because typically, when a component throws an error, it unmounts, to my understanding, Suspense has some complex logic that only unwinds as much as it needs to keeping as much of the React tree mounted as it can. 

With Suspender, there are no errors thrown because we as the developers know which components require data fetched outside our app before we even deploy. This means, we should be able to scaffold our application in such a way that follows the fetch-then-render approach while also having some easy to use loading logic. Suspender does this by searching for async props, adding them to a *queue* and resolving them incrementally. As the props resolve, the original element is cloned and the props are overriden with the resolved version.

# Demo

## INSTALLATION
1) Clone Repo
2) `npm install`
3) `npm run hot`

## TESTS
1) `npm run test`

![](suspender-demo.gif)
