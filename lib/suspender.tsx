/* eslint-disable react/no-array-index-key */
import React, {
  useState,
  useRef,
  useEffect,
} from 'react';
import { AsyncTracker } from './async-tracker';

interface SuspenderProps {
  children: JSX.Element[] | JSX.Element,
  /**
   * Fallback component that will be displayed while component still has unresolved
   * async props
   *
   * @type {React.ReactElement}
   * @memberof SuspenderProps
   */
  fallback: React.ReactElement,
  /**
   * Optional param that if passed, will extract resolved values
   * from "data" key when resolving promise
   *
   * @type {boolean}
   * @memberof SuspenderProps
   */
  axios?: boolean,
  extractKey?: string,
}

function checkPropsForExtractionType(axios: boolean | undefined, extractKey: string | undefined) {
  if (extractKey) return extractKey;
  if (axios) return 'data';
  return undefined;
}

/**
 * Experimental alternative apprach to how components can handle async
 * props. Suspender will extract any async props of its children and
 * show a fallback while they are resolved. There are no waterfall effects,
 * any component with fully resolved data with be rendered.
 *
 * @export
 * @param {*} props children of Suspender and fallback loader
 * @returns Either non async component immediately, fallback loader, or
 * the component with resolved props
 */
export function Suspender(props: SuspenderProps) {
  const { axios, extractKey } = props;
  // eslint-disable-next-line react/destructuring-assignment
  const children: any[] = React.Children.toArray(props.children);
  const extractType = checkPropsForExtractionType(axios, extractKey);
  // maintain the async tracker between reders
  const asyncTracker = useRef(new AsyncTracker(children, extractType)).current;
  // Use to abort state updates if Suspender unmounts before completion
  const mounted = useRef(true);

  // use for rendering
  const [values, setValues] = useState(asyncTracker.tracker);
  useEffect(() => () => { mounted.current = false; }, []);

  // controlled state update - checks to make sure Suspender is mounted
  const stateUpdater = (newState: any) => {
    if (mounted.current) {
      setValues(newState);
    }
  };
  // resolves all async request and updates values
  asyncTracker.resolveAsnycProps(stateUpdater);

  return (
    <>
      { children.map((component: JSX.Element, key: number) => {
        const currentComponent = `${component.type.name}-${key}`;
        const hasAllResolved = asyncTracker.hasAllResolved(currentComponent);

        // component is still waiting for some data
        if (!hasAllResolved) {
          return React.cloneElement(props.fallback, { key });
        }
        // component has resolved and needs it's props overriden
        if (values[currentComponent]) {
          const resolvedProps = asyncTracker.constructResolvedProps(currentComponent);
          return React.cloneElement(component, { ...resolvedProps, key });
        }
        // component never had async data but was in suspender
        return React.cloneElement(component, { key });
      }) }
    </>
  );
}

Suspender.defaultProps = {
  axios: false,
  extractKey: null,
};
