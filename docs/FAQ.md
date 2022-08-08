## Is this a _supported_ Esri product?

No, it is an open source project that was initially developed to scratch an itch of our own. That said, we are actively recruiting outside contributors and fully expect that the tools here will be useful to a subset of our customers.

## Why TypeScript

Using TypeScript allows us to add type information to request params and response structures. This vastly simplifies development. TypeScript also has excellent support for newer `async`/`await` patterns and for generating API documentation with [TypeDoc](http://typedoc.org/).

TypeScript compiles to JavaScript so you can use @esri/hub.js in any JavaScript project. However if you use TypeScript you will get the benefits of type checking for free.

We include [`tslib`](https://www.npmjs.com/package/tslib) as a dependency of individual npm packages to make usage of `_extends` and `_assign` in our compiled code more concise.