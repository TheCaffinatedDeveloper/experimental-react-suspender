/**
 * Class responsible for keeping track of all components that have async props and
 * resolving them
 *
 * @export
 * @class AsyncTracker
 */
export class AsyncTracker {
  /**
   * Creates an instance of AsyncTracker.
   * @param {*} reactChildren - components inside suspender
   * @memberof AsyncTracker
   */
  constructor(reactChildren) {
    this.children = reactChildren;
    this.asyncTracker = {};
    this.asyncComponentNames = [];
    this.extractAsyncProps();
  }

  /**
   * Getter for asyncTracker object
   *
   * @readonly
   * @memberof AsyncTracker
   */
  get tracker() {
    return this.asyncTracker;
  }

  /**
   * Utility function for checking to see if all props for a given component
   * have resolved
   *
   * @param {string} componentName - name of component as component.type.name
   * @returns {bool} True / false if everything has resolved
   * @memberof AsyncTracker
   */
  hasAllResolved(componentName) {
    if (componentName in this.asyncTracker) {
      const asyncProps = Object.keys(this.asyncTracker[componentName]);
      return !asyncProps.some(
        (prop) => !this.asyncTracker[componentName][prop].resolved
      );
    }
    return true;
  }

  /**
   * helper function for creating props object that contains resolved values
   * to be cloned into original component
   *
   * @param {string} componentName
   * @returns {Object} newProps to be passed to rendered component
   * @memberof AsyncTracker
   */
  constructResolvedProps(componentName) {
    const asyncProps = Object.keys(this.asyncTracker[componentName]);
    const newProps = {};
    asyncProps.forEach((prop) => {
      newProps[prop] = this.asyncTracker[componentName][prop].resolved;
    });
    return newProps;
  }

  /**
   * Looks into children of Suspender and extracts all async props for
   * a given component.
   *
   * @memberof AsyncTracker
   */
  extractAsyncProps() {
    // traverse each component
    this.children.forEach(({ props, type: { name }}, idx) => {
      const propDict= {};
      const propsAsEntries = Object.entries(props);
      // traverse the props of that component
      propsAsEntries.forEach(([propName, propValue]) => {
        // If the prop encountered is a promise
        if (Promise.resolve(propValue) === propValue) {
          propDict[propName] = { promise: propValue, resolved: null };
        }
      });
      // Only track components that have some async props
      if (Object.keys(propDict).length > 0) {
        // Keep the component names unique...<Comp /> <Comp /> is a problem
        const uniqueKey = `${name}-${idx}`;
        this.asyncTracker[uniqueKey] = propDict;
        this.asyncComponentNames.push(uniqueKey);
      }
    });
  }

  /**
   * Calls .then() on all props queing them up. Saves resolved value when ready
   * and re-renders by saving the async tracker in state
   *
   * @param {*} stateUpdater
   * @memberof AsyncTracker
   */
  resolveAsnycProps(stateUpdater) {
    // For each component with async props
    this.asyncComponentNames.forEach((component) => {
      // traverse each async prop
      Object.keys(this.asyncTracker[component]).forEach((prop) => {
        // call .then() to queue in event loop
        this.asyncTracker[component][prop].promise.then((res) => {
          // If the prop has not been previously resolved
          if (!this.asyncTracker[component][prop].resolved) {
            // save resolved value
            this.asyncTracker[component][prop].resolved = res;
            stateUpdater({...this.asyncTracker});
          }
        });
      });
    });
  }
}
