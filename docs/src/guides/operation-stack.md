---
title: OperationStack
navTitle: OperationStack
description: Manage multi-step operations with OperationStack.
order: 70
group: 2-concepts
---

## OperationStack

When processing data, it is common to have long running tasks that leverage recursive function, work on tree data structures and/or leverage chained asynchronous operations (i.e. http requests).

Our work on the previous versions of Solution.js and it's Ember based precursor proved just how complex and time consuming it is to debug these sorts of systems by watching network requests in a browser, something that's not viable when running in node.

Thus, when embaring on this version of Solution.js, we designed in a system to ease this pain right from the start: [OperationStack](../../hub.js/api/common/OperationStack).

## What is an OperationStack?

Not as formal as an audit trail, but similar in concept, an `OperationStack` is used to track "operations" as they are started, and completed, attaching in useful debugging information along the way. Each substantial function in the process creates an instance of an `OperationStack`, adds operations to it, and returns a serialized stack along with it's usual payload, or in an exception should an error occur.

With this in place, we have a clean means to see where in the process a failure occured.

In addition, the OperationStack is very useful when you want to combine a set of atomic actions into a larger atomic transaction.

i.e. a series of HTTP POST calls to create a number of inter-related entities, and if any of the calls fail, all of the already created entities should be removed.

While `OperationStack` itself does not attempt to handle "rollback", the information in the "operations" should provide enough information to write code that can perform the needed cleanup.

Note: While this works well for "creational" workflows, however, for flows where you are destroying entities, typically there is no means to "undo" a HTTP DELETE operation, and typically API's do not allow a HTTP POST to create an entity and specify it's unique identifier, so re-constructing already deleted entities is typically not viable.

In these scenarios, combining the OperationStack with Errors should provide deeper insights into why the operation did not succeed, as compared to a stack trace alone.

## Usage Example

Let's use the example of creating a Hub Site Application item. There are a number of things that happen when a Site is created:

- create item
- create domain system entry
- register item as application w/ oauth
- create team groups (depending on licensing and user privs)
- create Hub Initiative item (depending on licensing)

Let's use some psuedo code to show how this process can be orchestrated, and how we would use an OperationStack to keep track of things:

```js
import OperationStack from '@esri/hub-common`;
// NOTE: the site related functions are fictional
import { ... } from '@esri/hub-sites';


export function createSite(siteModel, session) {
  // create a name that's specific to the entity we are working with
  // this will be used as part of the id in our operations
  const name = siteModel.item.title.camelize();
  const stack = new OperationStack();
  // add an operation
  stack.start({
    id: `createSite-${name}`,
    type: 'createSite',
    inputs: {
      url: siteModel.url,
      owner: siteModel.owner
      }
    });
  return createSiteItem(siteModel)
  .then((newSiteId) => {
    // finish the operation, and hold the id of the new item
    stack.finish(`createSite-${name}`, {id: newSiteId});
    siteModel.item.id = newSiteId
    // start a new operation for registering the domain
    stack.start({
      id: `registerDomain-${name}`,
      type: 'registerDomain',
      inputs: {
        url: siteModel.item.url,
        org: session.orgId,
        id: newSiteId
      }
    });
    return registerDomain(siteModel, session);
  })
  .then((domainId) => {
    stack.finish(`registerDomain-${name}`, {domainId});
    stack.start({
      id: `registerOAuth-${name}`,
      type: 'registerOAuth',
      inputs: {
        id: siteModel.item.id,
        redirectUris: [
          siteModel.item.url,
          siteModel.data.defaultHostname
        ]
      }
    });
    return registerSiteWithOAuth(siteModel, session);
  })
  .then((_) => {
    stack.finish(`registerOAuth-${name}`);
    stack.start({
      id: `createSiteTeams-${name}`,
      type: 'createSiteTeams',
      inputs: {
        id: siteModel.item.id,
      }
    });
    // createSiteTeams is a complex multi-step process itself
    // so it's response returns a serialized operation stack
    return createSiteTeams(siteModel, session)
  })
  .then((teamsResponse) => {
    // merge in the stack from createSiteTeams
    stack.merge(teamsResponse.stack);
    // then finish the operation started here
    stack.finish(`createSiteTeams-${name}`, {
      groups: mapBy(teamsResponse.teams, 'id')
    });
    stack.start({
      id: `createInitiative-${name}`,
      type: 'createInitiative',
      inputs: {
        id: siteModel.item.id,
      }
    })
    return createInitiative(siteModel, teamsResponse.teams, session);
  })
  .then((initiative) => {
    stack.finish(`createInitiative-${name}`, {id: initiative.item.id});
    return {
      siteModel,
      stack: stack.serialize()
    };
  })
  .catch((err) => {
    // see if the err has a .operationStack property
    // and if so, merge it into the current stack and return a new
    // SolutionError
    if (err.operationStack) {
      stack.merge(err.operationStack);
    }
    // Set the message of the error to be the stringified stack
    const msg = `${
      err.message
    } \n Operation Stack: \n ${stack.toString()}`;
    // stack.toString() emits this format
    // <timestamp> <type> <id> <started|completed in {ms}> with inputs <JSON.stringify(inputs)>
    const solErr = new SolutionError('convertFromItemIds', msg, err);
    solErr.operationStack = stack.serialize();
    // the code that called this function will have access to the full stack
    // and can thus conduct rollback operations as needed
    return Promise.reject(solErr);
  })

}

```

For more details please see [OperationStack](../../hub.js/api/common/OperationStack) documentation.
