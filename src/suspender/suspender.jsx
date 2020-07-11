import React, { useState } from 'react';

function extractAsyncProps({ props, type: { name } }) {
  const asyncProps = Object.entries(props).filter(
    ([key, value]) => Promise.resolve(value) === value
  );
  return { name, asyncProps };
}

function constructResolvedProps(propKeys, values) {
  const newProps = {};
  propKeys.forEach(prop => {
    newProps[prop] = values[prop].resolved;
  });
  return newProps;
}

export function Suspender(props) {
  const children = React.Children.toArray(props.children);

  const asyncProps = children.map(child => extractAsyncProps(child));
  // [ [key, value], [key, value]  ]
  const asyncTracker = {};
  asyncProps.forEach(component => {
    const { name } = component;
    const async = {};
    component.asyncProps.forEach(([key, value]) => {
      async[key] = { promise: value, resolved: null };
    });
    asyncTracker[name] = async;
  });

  const [values, setValues] = useState(asyncTracker);

  Object.keys(values).forEach(component => {
    Object.keys(values[component]).forEach(prop => {
      values[component][prop].promise.then(res => {
        if (!values[component][prop].resolved) {
          const newState = { ...values };
          newState[component][prop].resolved = res;
          setValues(newState);
        }
      });
    });
  });

  return children.map((component, i) => {
    const currentComponent = component.type.name;
    const waitingProps = Object.keys(values[currentComponent]);
    const hasAllResolved = !waitingProps.some(
      prop => !values[currentComponent][prop].resolved
    );

    // component is still waiting for some data
    if (!hasAllResolved) {
      return React.cloneElement(props.fallback, { key: i });
    }
    // component has resolved and needs it's props overriden
    if (values[currentComponent]) {
      const resolvedProps = constructResolvedProps(
        waitingProps,
        values[currentComponent]
      );
      return React.cloneElement(component, { ...resolvedProps, key: i });
    }
    // component never had async data but was in suspender
    return React.cloneElement(component, { key: i});
  });
}
