---
title: Hub.js Utilities
navTitle: Utilities
description: Learn leverage the lowest-level utilities that power @esri/hub.js.
order: 60
group: 3-functional-api
instanceColor: "{% raw %}{{instance.color}}{% endraw %}"
outputItemId: "{% raw %}{{outputItem.id}}{% endraw %}"
teamsCollaborationId: "{% raw %}{{teams.collaborationId}}{% endraw %}"
---

## Hub Utilities

Hub.js exports a collection of utility functions that the Hub team has come to rely on across all the projects we work on.

This page lists some of the more prominent functions, but there are dozens of others that are extremely useful and we invite you to explore them.

## Working with Objects

The philosophy behind Hub.js (as well as ArcGIS Rest Js) is that the libraries are composed of functions that work with data.

The output of the functions depends only on the data passed into them. Unless otherwise noted, the functions do not mutate the data passed into them - instead they return new copies of the data.

### Getting Deeply Nested Properties

In Hub we frequently deal with deeply nested objects. For example, given an object like

```js
let itm = {
  id: "3ef",
  properties: {
    parentId: "bc7",
    children: ["cc0", "02a"],
  },
};
```

We can safely get the value of `itm.properties.parentId` because we know it's defined. But what if there is a possibility that the `properties` object itself was `undefined`? Typically we would have to write guard code like this:

```js
if (itm.properties && itm.properties.parentId) {
  // do something
}
```

... or with ES6 we can use

```js
if (itm.properties?.parentId) {
  // do something
}
```

Writing that sort of code for deeply nested property paths is cumbersome and error prone, so we created two helper functions `getProp`, and `getPropWithDefault`, which allow us to write code like

```js
if (getProp(itm, "properties.parentId")) {
  // do something...
}

if (!getProp(itm, "values.settings.catalog")) {
  // setup that property
}

// get a property and if it's undefined, return
// a value that will allow the code to proceed
const childIds = getPropWithDefault(itm, "properties.children", []).map(
  (e) => e.id
);

// if properties.children is defined, `childIds`
// will contain the id properties from each entry
//
// if properties.children is undefined, we will be
// mapping over an empty array which will return an empty array
```

### Avoid Mutating Shared State

One of the most complex problems we face as application developers is how to manage state in our applications. One prominent technique to simplify this is to write functions which do not mutate data that is passed in; rather they return new objects. This minimizes unexpected mutation of shared objects. In order to do this, we leverage [cloneObject](/hub.js/api/common/cloneObject/).

We also make us of this extensively in our unit tests.

**Note**: `cloneObject` does not clone functions, and thus should not be used with instances of classes

```js
const obj1 = {
  id: "3ef",
  properties: {
    parentId: "bc7",
    children: ["cc0", "02a"],
  },
};

const clone = cloneObject(obj1);
// clone === obj1 -> false
// clone.properties === obj1.properties -> false
```

## Working with Arrays

Hub.js code relies heavily on manipulation of arrays, so we have created some convenience functions that provide syntax short-cuts

```js
// Examples below assume this input
const input = [
  { id: '1bc', title: 'Fellowship of the Ring'}
  { id: 'bc4', title: 'The Two Towers'}
  { id: '3ef', title: 'Return of the King'}
];
```

### Removing an Element

#### `without(arr, value)`

```js
const toRemove = input[1];
const result = without(input, toRemove);
// result => [
//   { id: '1bc', title: 'Fellowship of the Ring'},
//   { id: '3ef', title: 'Return of the King'}
// ]
// result !== input - a new array is returned
// result[0] === input[0] - references are returned
```

### Removing an Element basd on a (deep) property value

#### `without(propertyPath, value, arr)`

If the property path has `undefined` at any depth, the match returns false, and the entry is included in the output

```js
const left = without("title", "The Two Towers", input);
// result => [{ id: '1bc', title: 'Fellowship of the Ring'}, { id: '3ef', title: 'Return of the King'} ]
// result !== input - a new array is returned
// result[0] === input[0] - references are returned
```

### Extracting a (deep) property value from all elements in the array

#### `mapBy(propertyPath, arr)`

Property path can be deep (i.e. `data.values.settings.catalog`) but must exist on each entry.

```js
const titles = mapBy("title", input);
// titles = ['Fellowship of the Ring', 'The Two Towers', 'Return of the King']
```

### Finding Elements based on a (deep) Property value

#### `findBy(arr, propertyPath, value)`

```js
const entry = findBy(input, "title", "The Two Towers");
// entry => { id: 'bc4', title: 'The Two Towers'}
// entry === input[1] - returns the instance in the array
```

## Json Templates

Many of the objects the Hub works with are large, deep graphs - i.e. the Layout for a site/page can contain deeply nested sections > rows > cards. Manually constructing these graphs by building up objects in code is both error prone and difficult to manage. Instead, we employ JSON templates. Simple put this lets us define deep object graphs using the simplest possible notation, while still making it simple to inject custom values into any part of the graph.

### Interpolating values into a Template object

While simple in concept, interpolating values into json templates results in a very powerful pattern. It allows us to manage complex object graphs as objects, while still injecting per-user/per-organization configuration at run-time.

```js
const template: {
  value: '{{instanceColor}}'
};

const settings: {
  instance: {
    color: 'red'
  }
};

const result = interpolate(template, settings);
// > { value: 'red' }
```

More details can be found in the [adlib](https://github.com/Esri/adlib) repository.

### Replacing string values through an object graph

Sometimes there are scenarios where we need to take a deep object, and convert it into a template, at run-time. Alternatively we may need to swap tokens at run-time.

```js
const itm = {
  item: {
    id: "3ef",
    properties: {
      collaborationGroupId: "bc7",
    },
  },
  data: {
    catalogGroups: ["bc7"],
  },
};
// define array of replacements
const replacements = [
  { match: "3ef", replacement: "{{outputItemId}}" },
  { match: "bc7", replacement: "{{teamsCollaborationId}}" },
];
// reduce over them, starting with the initial object
const tmpl = replacements.reduce((tmpl, entry) => {
  return deepStringReplace(itm, entry.match, entry.replacement);
}, itm);

// tmpl = {
//   item: {
//     id: '{{outputItemId}}',
//     properties: {
//       collaborationGroupId: '{{teamsCollaborationId}}'
//     }
//   },
//   data: {
//     catalogGroups: ['{{teamsCollaborationId}}']
//   }
// }
```
