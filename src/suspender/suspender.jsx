import React, { useState, useRef } from 'react';
import { AsyncTracker } from './async-tracker';

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
export function Suspender(props) {
  const children = React.Children.toArray(props.children);
  // maintain the async tracker between reders
  const asyncTracker = useRef(new AsyncTracker(children)).current;

  // use for rendering
  const [values, setValues] = useState(asyncTracker.tracker);
  // resolves all async request and updates values
  asyncTracker.resolveAsnycProps(setValues);

  return children.map((component, key) => {
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
  });
}
