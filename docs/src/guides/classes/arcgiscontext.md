---
title: Authentication and Context
navTitle: Authentication
description: Working with authentication and configuration in applications, components and modules
order: 15
group: 2-class-api
---

### Authentication and Hub Classes

The Hub Classes are all instantiated via a set of common factory functions:

| Factory Function                    | Description/Use-Case                                       |
| ----------------------------------- | ---------------------------------------------------------- |
| `.load(Partial<entity>, context)`   | Use when application already has an object literal         |
| `.fetch(identifier, context)`       | Fetch the backing entity by id, slug or domain (Site only) |
| `.create(Partial<entity>, context)` | Create an instance for a new entity                        |

In all these functions, `context` refers to an [`IArcGISContext`](/hub.js/api/common/IArcGISContext) object literal, which is a collection of platform and user information an application needs in order to make requests to the right services, pass the correct authentication and easily determine other user/org specific properties.

The `ArcGISContext` class provides a simple container for "context", thereby making it easier for applications and components to write simpler, more consistent code, and to easily leverage shared libraries like [ArcGIS Rest JS](https://esri.github.io/arcgis-rest-js/), [Hub.js](https://esri.github.io/hub.js/), [Solutions.js](https://github.com/Esri/solution.js) etc.

In addition to the portal and sharing api urls, `ArcGISContext` also provides easy access to authentication status, the active [`UserSession`](https://esri.github.io/arcgis-rest-js/api/auth/UserSession/), [`IPortal`](https://esri.github.io/arcgis-rest-js/api/portal/IPortal/) and [`IUser`](https://esri.github.io/arcgis-rest-js/api/types/IUser/) objects, as well as a number of computed properties driven by those objects.

See [`IArcGISContext`](/hub.js/api/common/IArcGISContext) for the list of properties and their descriptions.

### Application State

In the past, this sort of "state" information has typically been managed using one-off patterns, specific to the application itself. With Esri's move towards building web components that are reusable across applications, we saw a need for a consistent means to pass this information into components. What's more, this solution needed to work well with modern, "reactive-style" web frameworks - i.e. React/Vue/Ember/Angular.

These frameworks are designed to operate effectively and efficiently with immutable data, and the `ArcGISContext` class was designed to be used in this manner.

### References and Immutable Objects

The question then becomes, how can we pass a reference to a long-lived object, which can react to a user signing in/out of an application, and still have immutablilty?

The solution to this was split those two things apart. The `ArcGISContextManager` is the long-lived object, which exposes the immutable `ArcGISContext` instance via the `.context` property.

As users sign in/out of the application, the app calls `ArcGISContextManager.setAuthentication(...)` or `ArcGISContextManager.clearAuthentication()` as needed. When those methods are called the `.context` instance is replaced with a new, immutable, object.

The application can then pass that updated `.context` into it's normal state/change tracking system, and the application will re-render as needed.

### ArcGISContextManager Class

This class should be created by your application - i.e. the React/Ember/Vue etc and maintained for the lifetime of the application. As your application allows the user to sign in/out, your app should call the `.setAuthentication(...)` or `.clearAuthentication()` methods as needed. If your application loads a serialized session from localStorage or a cookie, then it can pass the hydrated `UserSession` into the `.create(...)` static factory function, thus saving some xhrs.

#### Example

```js
// Create a context manager, passing in no additional information
// This will default to using https://www.arcgis.com as the portal url
const ctxMgr = await ArcGISContextManager.create();
ctxMgr.context.isAuthenticated; // false
// the context then has a number of properties accessible
ctxMgr.context.sharingApiUrl; //=> https://www.arcgis.com/sharing/rest
ctxMgr.context.hubUrl; //=> https://hub.arcgis.com
// all properties are getters so
// attempting to change values will throw
ctxMgr.context.portal = "https://dcdev.maps.arcgis.com"; //=> throws

// now let's load a session from localStorage (for example)
const session = UserSession.deserialize(localStorage.getItem("_context"));

// we can set this on the context manager, and it will fetch the
// IPortal from portal/self and the IUser from users/self
await ctxMgr.setAuthentication(session);
// at this point ctxMgr.context is now a *new* object
ctxMgr.context.isAuthenticated; // true
ctxMgr.context.portalUrl; //=> https://dcdev.maps.arcgis.com
ctxMgr.context.sharingApiUrl; //=> https://dcdev.maps.arcgis.com/sharing/rest
ctxMgr.context.currentUser; //=> {username: "dave", ...} IUser
ctxMgr.context.portal; //=> {id: "BcRx2", ...} IPortal
```

#### JSAPI Example

```js
// load a session from localStorage
const session = UserSession.deserialize(localStorage.getItem("_context"));
// create a context manager
const ctxMgr = await ArcGISContextManager.create({ authentication: session });
// else where in the code, register the session with the identity manager
esriId.registerToken(ctxMgr.context.session.toCredential());
// do things w/ JSAPI
```

### Framework Integration

Integration of `ArcGISContext` within an application will vary depending on the framework in use. The next section provides general guidance, followed by details of how the ArcGIS Hub Team uses `ArcGISContext` in Ember.

#### General Guidance

The `ArcGISContextManager` should be created as early in the application lifecycle as possible, and should exist for the lifetime of the application.

When adding web components in a template, the `context` property on the element should be set to the `.context` property of the `ArcGISContextManager`

When the authentication status changes, the application should call the `.setAuthentication(session: UserSession)` or `.clearAuthentication()` methods on the context manager instance. This will replace the object that backs the `.context` property. Depending on how the framework handles change tracking, the application may also need to set that context onto some state management system so that the application knows that the context has changed and it can re-render as needed.

#### Ember.js

In Ember we create the `ArcGISContextManager` in the application route's `beforeModel` hook, as that's the very first thing to run as the app boots up. We store the context manager on an Ember Service. In Ember, services are singletons that exist for the lifetime of the application, and can easily be accessed from routes, controllers, components or even other services.

When users sign in/out, the application gets a reference to the context manager from the service, and calls the necessary methods.
In order to work with Ember's change tracking system, we also set a reference to the `.context` on the service itself. This allows the rest of the application to bind to the `service.context` property without any additional complexity.

### ArcGISContext

This class is simply holds some properties and then exposes a large set of read only properties to streamline access to commonly accessed information or structures.

In the case that an application opts not to use `ArcGISContextManager`, the [`ArcGISContext`](https://esri.github.io/hub.js/api/common/ArcGISContext/) class could be manually created, and takes an [`IArcGISContextOptions`](https://esri.github.io/hub.js/api/common/IArcGISContextOptions/) in the constructor.

### Questions and Answers

Q: Should hub.js functions take an `IArcGISContext`?

A: No. Hub.js function parameters should expect one of the lower level interfaces - `IHubRequestOptions`, `IUserRequestOptions` or `IRequestOptions`. The `ArcGISContext` should be used in components which need to easily access any of those interfaces, or other platform configuration properties, in order to make calls to modules from hub.js, or arcgis-rest-js.

Q: Should my application bind to `ArcGISContextManager.context` directly?

A: This depends on your application framework. For Ember's tracking system, when the authentication changes, we call the cooresponding methods on the `ArcGISContextManager`, and then set the `context` onto a property on a service. The rest of the application reads the context from the service. This enables Ember's change tracking system to be aware of the change and thus computed properties re-fire and templates know to re-render.
