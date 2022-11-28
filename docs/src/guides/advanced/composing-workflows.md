---
title: Composing Workflows
navTitle: Composing Workflows
description: Constructing Pipelines with createOperationPipeline.
order: 50
group: 4-advanced
---

# Composing Workflows

When building complex features using the ArcGIS platform, many times you will need to orchestrate complex workflows.

For example - converting a Site into a Template for use in [Templates.js](https://github.com/Esri/templates-js) involves the following (abbreviated) steps:

- fetch the Site item
- fetch the Site item's /data
- walk the layout, and determine what other items the Site depends upon
- check other parts of the Site configuration for dependencies on Page items
- verify that all those dependency items exist by fetching them
- get a list of all the site item's resources

While we can write and test a single function that has a single promise chain that executes all the steps...

```js
// Pseudo code - this the actual site template process is much more complex
export function convertToTemplate(id) {
  const tmpl = {};
  // get the item
  return getItem(id)
    .then((item) => {
      tmpl.item = item;
      // get the data
      return getItemData(id);
    })
    .then((itemData) => {
      tmpl.data = itemData;
      // extract dependencies from layout cards
      tmpl.dependencies = itemData.layout.sections.reduce((deps, section) => {
        return deps.concat(
          section.rows.reduce((rowDeps, row) => {
            return rowDeps.concat(
              row.cards.reduce((cardDeps, card) => {
                const cardDeps = getCardDependencies(card);
                if (cardDeps.length) {
                  deps = deps.concat(cardDeps);
                }
                return deps;
              }, [])
            );
          }, [])
        );
      }, []);
      // verify dependendencies exist
      tmpl.dependencies = tmpl.dependencies.concat(itemData.layout.pages);
      const q = `id: ${tmpl.dependencies.join(" OR id:")}`;
      return searchItems(q);
    })
    .then((searchResponse) => {
      const existingIds = searchResponse.results.map((itm) => itm.id);
      // filter out items which no longer exist, or which the current user can't access
      tmpl.dependencies = tmpl.dependencies.reduce((acc, entry) => {
        if (existingIds.includes(entry)) {
          acc.push(entry);
        }
        return acc;
      });
      // get the resources
      return getResources(id);
    })
    .then((resources) => {
      tmpl.resources = resources;
      return tmpl;
    });
}
```

However that type of solution is very complex to write, difficult to understand, and - since all the logic is inside a single promise chain - we have no means to re-use any of those steps (i.e. Page items also need to walk a layout and determine dependencies).

A better pattern is to break up the steps into focused functions, and then compose those functions into a workflow.

```js
export function convertToTemplate(id) {
  const tmpl = {};
  // we've moved a lot of the work out of this promise chain
  // but we're still managing the composition of the template
  return getItem(id)
    .then((item) => {
      tmpl.item = item;
      return getItemData(id);
    })
    .then((itemData) => {
      tmpl.data = itemData;
      tmpl.dependencies = getLayoutDependencies(tmpl.data.layout);
      tmpl.dependencies = tmpl.data.pages.concat(tmpl.dependencies);
      return verifyDependencies(tmpl.dependencies);
    })
    .then((verifiedDeps) => {
      tmpl.dependencies = verifiedDeps;
      return getResources(id);
    })
    .then((resources) => {
      tmpl.resources = resources;
      return tmpl;
    });
}

// now this can be used for pages or sites
export function getLayoutDependencies(layout) {
  return layout.sections.reduce((deps, section) => {
    return deps.concat(
      section.rows.reduce((rowDeps, row) => {
        return rowDeps.concat(
          row.cards.reduce((cardDeps, card) => {
            const cardDeps = getCardDependencies(card);
            if (cardDeps.length) {
              deps = deps.concat(cardDeps);
            }
            return deps;
          }, [])
        );
      }, [])
    );
  }, []);
}

export function verifyDependencies(ids) {
  const q = `id: ${ids.join(" OR id:")}`;
  return searchItems(q).then((searchResponse) => {
    const existingIds = searchResponse.results.map((itm) => itm.id);
    return ids.reduce((acc, entry) => {
      if (existingIds.includes(entry)) {
        acc.push(entry);
      }
      return acc;
    });
  });
}
```

Having separate functions allows us to work with smaller units of code, thus making things easier to understand, and maintain, as well as opens opportunities for re-use in different scenarios. However, we still have significant logic in the main promise chain, and each function has a different signature which adds complexity, and we have no good means to understand the system state when a failure does occur. So let's address those issues next

## Functional Composition

In the last refactor, we still have some logic within the main promise chain. To make this even cleaner, we can design the functions to take and return the same structure. This allows us to chain the functions, effectively executing them in series, with no "connective logic" - aka a "pipeline". This is exactly what `createOperationPipeline` does for us.

### Consistent Arguments and Return Values

To leverage an operation pipeline, we need to ensure that all the functions that will be composed take the same argument and return the same value. In order to make this flexible, we use a "Container Type" `IPipeable<Type>`

```js
export interface IPipeable<Type> {
  data: Type;
  stack: OperationStack;
  requestOptions?: IHubRequestOptions | IRequestOptions;
}
```

What's important is that the `IPipeable<Type>` has a `data` property that can be of whatever type your pipeline is using. If we are "building up" an object we can also leverage the `Partial<Type>` type.

`IPipeable` also includes an `OperationStack` which allows each function in the pipeline to add information about what it is doing internally, effectively providing state information in the event of an exception. This greatly simplifies debugging when things to wrong. Read more in the [OperationStack Guide](../operation-stack)

Since many of the operations we do will be asynchronous, all the functions should return a Promise, even if they do not have to make any async calls. From a typing perspectives, the functions adhere to the `PipelineFn<Type>` signature:

```js
export type PipelineFn<T> = (value: IPipeable<T>) => Promise<IPipeable<T>>;
```

Working from the previous example, we could define an `ITemplate` as

```js
// Note: This is also simpified to demonstrate the concept
export interface ITemplate {
  id: string;
  item: IItem;
  data: Record<string, unknown>;
  dependencies: string[];
  resources: IResource[];
}
```

And have functions like

```js
export function getItemAndData(
  input: IPipable<Partial<ITemplate>>
): Promise<IPipable<Partial<ITemplate>>> {
  // Add wrapper operation to the stack.
  let opId = input.stack.startOperation("getItemAndData");
  // add a more detailed operation specific to the xhr getting the site item
  // this includes more details on the request, and when we finish it we can
  // provide additional information that may be useful in debugging
  input.stack.start({
    id: `getItem - ${input.data.id}`,
    type: "getItem",
    inputs: {
      id: input.data.id,
    },
  });
  return getItem(input.data.id, input.requestOptions)
    .then((item) => {
      // finish the getItem operation...
      input.stack.finish(`getItem - ${input.data.id}`, { success: true });
      // start one for getItemData
      input.stack.start({
        id: `getItemData - ${input.data.id}`,
        type: "getItemData",
        inputs: {
          id: input.data.id,
        },
      });
      input.data.item = item;
      return getItemData(input.data.id, input.requestOptions);
    })
    .then((itemData) => {
      input.stack.finish(`getItemData - ${input.data.id}`, { success: true });
      input.stack.finish(opId);
      input.data.data = itemData;
      return input;
    })
    .catch((err) => {
      // construct an OperationError so the stack is serialized and returned
      // If somethign failed
      const msg = `getSite Error \n Operation Stack: \n ${input.stack.toString()}`;
      const opErr = new OperationError("pipeline execution error", msg);
      opErr.operationStack = input.stack.serialize();
      return Promise.reject(opErr);
    });
}

export function getLayoutDependencies(
  input: IPipable<Partial<ITemplate>>
): Promise<IPipable<Partial<ITemplate>>> {
  const opId = input.stack.startOperation("getLayoutDependencies");
  input.data.dependencies = input.data.data.layout.sections.reduce(
    (deps, section) => {
      return deps.concat(
        section.rows.reduce((rowDeps, row) => {
          return rowDeps.concat(
            row.cards.reduce((cardDeps, card) => {
              const cardDeps = getCardDependencies(card);
              if (cardDeps.length) {
                deps = deps.concat(cardDeps);
              }
              return deps;
            }, [])
          );
        }, [])
      );
    },
    []
  );
  input.stack.finish(opId);
  // although this is all sycn operations, we still resolve a promise
  return Promise.resolve(input);
}

export function verifyDependencies(
  input: IPipable<Partial<ITemplate>>
): Promise<IPipable<Partial<ITemplate>>> {
  const ids = input.data.dependencies || [];
  const q = `id: ${ids.join(" OR id:")}`;
  // create the wrapper operation for this function
  const opId = input.stack.startOperation("verifyDependencies");
  // start a second operation for the search
  input.stack.start({
    id: `dependenciesSearch`,
    type: "dependency search request",
    inputs: {
      q: q,
    },
  });
  return searchItems(q)
    .then((searchResponse) => {
      input.stack.finish("dependenciesSearch", {
        count: searchResponse.results.length,
      });
      const existingIds = searchResponse.results.map((itm) => itm.id);
      input.data.dependencies = ids.reduce((acc, entry) => {
        if (existingIds.includes(entry)) {
          acc.push(entry);
        }
        return acc;
      });
      // finish the wrapper operation
      input.stack.finish(opId);
      return input;
    })
    .catch((err) => {
      // construct OperationError and reject with that
    });
}

export function getResources(
  input: IPipable<Partial<ITemplate>>
): Promise<IPipable<Partial<ITemplate>>> {
  let opId = input.stack.startOperation("getResources");
  return getItemResources(input.data.id)
    .then((resources) => {
      input.stack.finish(opId);
      input.data.resources = resources;
      return input;
    })
    .catch((err) => {
      // construct OperationError and reject with that
    });
}
```

With these functions setup we can then compose them using `createOperationPipeline`

```js
export function createSiteTemplate(
  id: string,
  requestOptions: IHubRequestOptions
) {
  // create the pipeline function...
  const pipeline = createOperationPipeline([
    getItemAndData,
    getLayoutDependencies,
    verifyDependencies,
    getResources,
  ]);
  // create the initial input
  const input = {
    data: {},
    stack: new OperationStack(),
    requestOptions,
  };
  // execute the pipeline
  return pipeline(input);
}
```

What's more, we can make these pipelines configurable... so let's abstract this further...

```js
export function createTemplate(id: string, type: string, requestOptions: IRequestOptions) {
  const pipeline = createOperationPipeline(getPipelineFnsByType(type));
  // create the initial input
  const input = {
    data: {},
    stack: new OperationStack(),
    requestOptions
  };
  // execute the pipeline
  return pipeline(input);
}

function getPipelineFnsByType(type: string): PipelineFn<T>[] {
  const fns = [getItemAndData];
  // implement whatever sort of logic
  if type === "Hub Site Application" {
    fns.push(getLayoutDependencies, verifyDependencies, getResources);
  }
  if type === "Web Map" {
    fns.push(getLayerDependencies);
  }
  return fns;
}
```

### Summary

Creating pipeline functions via `createOperationPipeline` allows us to compose complex workflows, dyanmically, from a set of focused functions that all share a consistent API.
