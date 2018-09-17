# Hub.js Development Plan

## Overview
When complete, Hub.js will provide a set of stateless functions that encapsulate a huge amount of logic that was originally written in ES6, inside "Ember Services", which have access to application state - principally the Portal and User objects.

The process of extraction involves: 

- determining what functions are core to the CRUD operations of Initiatives & Solutions
- translating those functions into TypeScript and adding useful jsDoc comments
- ensuring any platform-level dependant "services" are available in ArcGIS-REST-js 
  - i.e. working with oAuth application registration, image resources etc
- ensuring any hub-level dependant "services" are available in Hub.js
  - i.e. registering site domains w/ the Hub API
- writing comprehensive unit tests
  - goal is 100% code-coverage
- swapping the implementation in the Ember Services to use the Hub.js functions

As we work through this project, the intent is to migrate the Hub applications to using the Hub.js fine-grained functions as they are implemented. This will ensure that our production code is using the same logic as any other consumer of the Hub.js modules.

## Work Scheduling

### Fine-Grained Initiative CRUD operations
- [DONE] `fetchInitiative` (with schema upgrades)
- [DONE] `createInitiativeModelFromTemplate`
- [DONE] `addInitiative`
- [DONE] `updateInitiative`
- [WIP] `removeInitiative`

### Updates to ArcGIS Rest JS
- move `geometryService.project` into `@esri/arcgis-rest-geometry::projectGeometry`
- fix the item resource calls in `@esri/arcgis-rest-items` so they work with images

### Hub Integration #1
- [WIP] merge Hub.js integration into Hub `master` and have it in production

### Fine-Grained Solution Template Fetching
- `fetchSolutionTemplate` (with schema upgrades)

### Fine-Grained Site Solution CRUD
- Front end this so Urban can create a site from a template

### Web Map, Web App, Page Solution CRUD
- Web Map solution is super generic.
- The Web App creation is the same for *most* types of web apps
- Page creation is only slightly different from a Web Map

### Survey Solution CRUD
- utilize the S123 API

### Coarse-Grained Wrapper Calls
- these will validate access/priviledges, and orchestrate calls to the fine-grained functions
- *TODO: they are long-running tasks, and we need to work out how best to return "status" information to the caller*

### Hub API in Node
- Hub API will expose the coarse-grained calls via REST API
- *TODO: they are long-running tasks, and we need to work out how best to return "status" information to the caller, perhaps via Web Sockets*


## Status Callback Payloads

The coarse-grained functions in hub.js orchestrate many, sometimes dozens of calls to the Portal API, and as such, can be quite long-running. In order to provide the user with incremental feedback, assuring them that things are working, the coarse grained methods accept a callback function.

The callback will be called at minimum three times...

### Process Initialization - Steps Payload
At the start of the coarse-grained call, the `progressCallback` will be called with a payload listing the distinct steps along with the `processId`. The caller is responsible for displaying the status to the user, along with any required internationalization.

```json
{
  "processId": "activation-bc432c",
  "steps": [
    {
      "id": "createGroup",
      "status": "not-started"
    },
    {
      "id": "copyTemplate",
      "status": "not-started"
    },
    {
      "id": "createInitiative",
      "status": "not-started"
    },
    {
      "id": "shareInitiative",
      "status": "not-started"
    }
  ]
}

```

### Step Activation
As each step is started, the `progressCallback` is called with a payload indicating the `activeStep`, along with the `processId`. 

```json
{ 
  "processId": "activation-bc432c",
  "status": "working",
  "activeStepId": "createInitiative" 
}
```

The assumtion here should be that all prior steps are now `complete`. For the example json shown, when this payload arrives, the calling application should conclude that the `createGroup` and `copyTemplate` tasks are complete, and the `createInitiative` step is being worked on. It is up to the calling application to determine how to convey this to the user.

### Process Complete

When the process is complete, a final call is made with `status` of `complete`.

```json
{ 
  "processId": "activation-bc432c",
  "status": "complete",
  "duration": 4530
}
```

### Process Failure

In the event of a failure, the Promise returned from the coarse-grained call will reject, and the consuming application should take appropriate action.

All intermediate products (items/groups etc) will be removed.