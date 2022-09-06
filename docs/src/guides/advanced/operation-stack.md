---
title: OperationStack
navTitle: OperationStack
description: Manage multi-step operations with OperationStack.
order: 20
group: 4-advanced
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

## Examples

Example output of a large process

```
1614199528247 : Operation canDeployTemplates-ini44h96n took 167 ms with inputs {"username":"qa_bas_sol_admin"} and output n/a
1614199528414 : Operation deploy-ini44h96n took 108163 ms with inputs {"username":"qa_bas_sol_admin","canDeploy":true} and output n/a
1614199528414 : Operation createVars-i98pqph5s took 1100 ms with inputs {"username":"qa_bas_sol_admin"} and output n/a
1614199529514 : Operation deployItemTemplates-i98pqph5s took 32099 ms with inputs {} and output n/a
1614199529515 : Operation deployTemplate-Hub Page-d541623471414e2fb4200deb91a6f47d took 7217 ms with inputs {"sourceId":"d541623471414e2fb4200deb91a6f47d"} and output {"deployedItems":[{"id":"b89311d4d2f24d3dadc34c0645841085","type":"Hub Page"}]}
1614199529515 : Operation deployHubPageProcessor-d541623471414e2fb4200deb91a6f47d took 7217 ms with inputs {"sourceId":"d541623471414e2fb4200deb91a6f47d","type":"Hub Page"} and output n/a
1614199529515 : Operation createHubRO-d541623471414e2fb4200deb91a6f47d took 249 ms with inputs {"username":"qa_bas_sol_admin"} and output n/a
1614199529764 : Operation createPageModel-d541623471414e2fb4200deb91a6f47d took 2 ms with inputs {"sourceId":"d541623471414e2fb4200deb91a6f47d"} and output n/a
1614199529766 : Operation createPage-d541623471414e2fb4200deb91a6f47d took 1405 ms with inputs {"sourceId":"d541623471414e2fb4200deb91a6f47d"} and output n/a
1614199531171 : Operation deployResources-d541623471414e2fb4200deb91a6f47d took 5561 ms with inputs {"sourceId":"d541623471414e2fb4200deb91a6f47d"} and output n/a
1614199531171 : Operation fetchThumbnailResource-b89311d4d2f24d3dadc34c0645841085-abstract-architecture-black-building-277576.jpg took 3479 ms with inputs {"sourceUrl":"https://qa-bas-hub.mapsqa.arcgis.com/sharing/rest/content/items/d541623471414e2fb4200deb91a6f47d/resources/abstract-architecture-black-building-277576.jpg?token=4FLZcllB4c4nBuiucdVraRPh0lIq5Kl1QAJUkM2r-ydBGS9lEtjDVAmU_rxoOjZfOGejYUQ--IQE51509I2BphS__3pMOzScuKyORe4kjXLZS2dBW3kdU95O4Js6evr-yQbnRmkda_lQeW1eapMECn9Us5c-my2_RFak4uo_opN9YdcGlvae8KyYjtFKmG7Z"} and output n/a
1614199531172 : Operation fetchThumbnailResource-b89311d4d2f24d3dadc34c0645841085-IMG_0420.jpg took 2470 ms with inputs {"sourceUrl":"https://qa-bas-hub.mapsqa.arcgis.com/sharing/rest/content/items/d541623471414e2fb4200deb91a6f47d/resources/IMG_0420.jpg?token=4FLZcllB4c4nBuiucdVraRPh0lIq5Kl1QAJUkM2r-ydBGS9lEtjDVAmU_rxoOjZfOGejYUQ--IQE51509I2BphS__3pMOzScuKyORe4kjXLZS2dBW3kdU95O4Js6evr-yQbnRmkda_lQeW1eapMECn9Us5c-my2_RFak4uo_opN9YdcGlvae8KyYjtFKmG7Z"} and output n/a
1614199533642 : Operation addResource-b89311d4d2f24d3dadc34c0645841085-IMG_0420.jpg took 1186 ms with inputs {"targetItemId":"b89311d4d2f24d3dadc34c0645841085"} and output n/a
1614199534650 : Operation addResource-b89311d4d2f24d3dadc34c0645841085-abstract-architecture-black-building-277576.jpg took 2081 ms with inputs {"targetItemId":"b89311d4d2f24d3dadc34c0645841085"} and output n/a
1614199536732 : Operation movePage-b89311d4d2f24d3dadc34c0645841085 took 0 ms with inputs {"id":"b89311d4d2f24d3dadc34c0645841085"} and output n/a
1614199536732 : Operation deployTemplate-Hub Site Application-79d2924052f4457995816e1554aa74bf took 24880 ms with inputs {"sourceId":"79d2924052f4457995816e1554aa74bf"} and output {"deployedItems":[{"id":"76852f77eca64b6eacea137f8f2a50b6","type":"Hub Site Application"}]}
1614199536732 : Operation deployHubSiteProcessor-79d2924052f4457995816e1554aa74bf took 24880 ms with inputs {"sourceId":"79d2924052f4457995816e1554aa74bf","type":"Hub Site Application"} and output n/a
1614199536732 : Operation createHubRO-79d2924052f4457995816e1554aa74bf took 2981 ms with inputs {"username":"qa_bas_sol_admin"} and output n/a
1614199539713 : Operation createSiteModel-79d2924052f4457995816e1554aa74bf took 3338 ms with inputs {"sourceId":"79d2924052f4457995816e1554aa74bf"} and output n/a
1614199543051 : Operation createSite-79d2924052f4457995816e1554aa74bf took 3771 ms with inputs {"sourceId":"79d2924052f4457995816e1554aa74bf"} and output n/a
1614199546823 : Operation deployResources-79d2924052f4457995816e1554aa74bf took 14789 ms with inputs {"sourceId":"79d2924052f4457995816e1554aa74bf"} and output n/a
1614199546823 : Operation fetchThumbnailResource-76852f77eca64b6eacea137f8f2a50b6-hub-image-card-crop-i10znomnn.png took 1085 ms with inputs {"sourceUrl":"https://qa-bas-hub.mapsqa.arcgis.com/sharing/rest/content/items/79d2924052f4457995816e1554aa74bf/resources/hub-image-card-crop-i10znomnn.png?token=4FLZcllB4c4nBuiucdVraRPh0lIq5Kl1QAJUkM2r-ydBGS9lEtjDVAmU_rxoOjZfOGejYUQ--IQE51509I2BphS__3pMOzScuKyORe4kjXLZS2dBW3kdU95O4Js6evr-yQbnRmkda_lQeW1eapMECn9Us5c-my2_RFak4uo_opN9YdcGlvae8KyYjtFKmG7Z"} and output n/a
1614199546823 : Operation fetchThumbnailResource-76852f77eca64b6eacea137f8f2a50b6-hub-image-card-crop-izmjv7x98.png took 1686 ms with inputs {"sourceUrl":"https://qa-bas-hub.mapsqa.arcgis.com/sharing/rest/content/items/79d2924052f4457995816e1554aa74bf/resources/hub-image-card-crop-izmjv7x98.png?token=4FLZcllB4c4nBuiucdVraRPh0lIq5Kl1QAJUkM2r-ydBGS9lEtjDVAmU_rxoOjZfOGejYUQ--IQE51509I2BphS__3pMOzScuKyORe4kjXLZS2dBW3kdU95O4Js6evr-yQbnRmkda_lQeW1eapMECn9Us5c-my2_RFak4uo_opN9YdcGlvae8KyYjtFKmG7Z"} and output n/a
1614199547908 : Operation addResource-76852f77eca64b6eacea137f8f2a50b6-hub-image-card-crop-i10znomnn.png took 1345 ms with inputs {"targetItemId":"76852f77eca64b6eacea137f8f2a50b6"} and output n/a
1614199548509 : Operation addResource-76852f77eca64b6eacea137f8f2a50b6-hub-image-card-crop-izmjv7x98.png took 1672 ms with inputs {"targetItemId":"76852f77eca64b6eacea137f8f2a50b6"} and output n/a
1614199550181 : Operation fetchThumbnailResource-76852f77eca64b6eacea137f8f2a50b6-IMG_0475.jpg took 431 ms with inputs {"sourceUrl":"https://qa-bas-hub.mapsqa.arcgis.com/sharing/rest/content/items/79d2924052f4457995816e1554aa74bf/resources/IMG_0475.jpg?token=4FLZcllB4c4nBuiucdVraRPh0lIq5Kl1QAJUkM2r-ydBGS9lEtjDVAmU_rxoOjZfOGejYUQ--IQE51509I2BphS__3pMOzScuKyORe4kjXLZS2dBW3kdU95O4Js6evr-yQbnRmkda_lQeW1eapMECn9Us5c-my2_RFak4uo_opN9YdcGlvae8KyYjtFKmG7Z"} and output n/a
1614199550182 : Operation fetchThumbnailResource-76852f77eca64b6eacea137f8f2a50b6-IMG_0923.jpg took 557 ms with inputs {"sourceUrl":"https://qa-bas-hub.mapsqa.arcgis.com/sharing/rest/content/items/79d2924052f4457995816e1554aa74bf/resources/IMG_0923.jpg?token=4FLZcllB4c4nBuiucdVraRPh0lIq5Kl1QAJUkM2r-ydBGS9lEtjDVAmU_rxoOjZfOGejYUQ--IQE51509I2BphS__3pMOzScuKyORe4kjXLZS2dBW3kdU95O4Js6evr-yQbnRmkda_lQeW1eapMECn9Us5c-my2_RFak4uo_opN9YdcGlvae8KyYjtFKmG7Z"} and output n/a
1614199550612 : Operation addResource-76852f77eca64b6eacea137f8f2a50b6-IMG_0475.jpg took 675 ms with inputs {"targetItemId":"76852f77eca64b6eacea137f8f2a50b6"} and output n/a
1614199550739 : Operation addResource-76852f77eca64b6eacea137f8f2a50b6-IMG_0923.jpg took 1567 ms with inputs {"targetItemId":"76852f77eca64b6eacea137f8f2a50b6"} and output n/a
1614199552306 : Operation fetchThumbnailResource-76852f77eca64b6eacea137f8f2a50b6-IMG_1871.JPG took 467 ms with inputs {"sourceUrl":"https://qa-bas-hub.mapsqa.arcgis.com/sharing/rest/content/items/79d2924052f4457995816e1554aa74bf/resources/IMG_1871.JPG?token=4FLZcllB4c4nBuiucdVraRPh0lIq5Kl1QAJUkM2r-ydBGS9lEtjDVAmU_rxoOjZfOGejYUQ--IQE51509I2BphS__3pMOzScuKyORe4kjXLZS2dBW3kdU95O4Js6evr-yQbnRmkda_lQeW1eapMECn9Us5c-my2_RFak4uo_opN9YdcGlvae8KyYjtFKmG7Z"} and output n/a
1614199552306 : Operation fetchThumbnailResource-76852f77eca64b6eacea137f8f2a50b6-IMG_2051.JPG took 725 ms with inputs {"sourceUrl":"https://qa-bas-hub.mapsqa.arcgis.com/sharing/rest/content/items/79d2924052f4457995816e1554aa74bf/resources/IMG_2051.JPG?token=4FLZcllB4c4nBuiucdVraRPh0lIq5Kl1QAJUkM2r-ydBGS9lEtjDVAmU_rxoOjZfOGejYUQ--IQE51509I2BphS__3pMOzScuKyORe4kjXLZS2dBW3kdU95O4Js6evr-yQbnRmkda_lQeW1eapMECn9Us5c-my2_RFak4uo_opN9YdcGlvae8KyYjtFKmG7Z"} and output n/a
1614199552773 : Operation addResource-76852f77eca64b6eacea137f8f2a50b6-IMG_1871.JPG took 1467 ms with inputs {"targetItemId":"76852f77eca64b6eacea137f8f2a50b6"} and output n/a
1614199553031 : Operation addResource-76852f77eca64b6eacea137f8f2a50b6-IMG_2051.JPG took 2528 ms with inputs {"targetItemId":"76852f77eca64b6eacea137f8f2a50b6"} and output n/a
1614199555559 : Operation fetchThumbnailResource-76852f77eca64b6eacea137f8f2a50b6-json-resource.json took 298 ms with inputs {"sourceUrl":"https://qa-bas-hub.mapsqa.arcgis.com/sharing/rest/content/items/79d2924052f4457995816e1554aa74bf/resources/json-resource.json?token=4FLZcllB4c4nBuiucdVraRPh0lIq5Kl1QAJUkM2r-ydBGS9lEtjDVAmU_rxoOjZfOGejYUQ--IQE51509I2BphS__3pMOzScuKyORe4kjXLZS2dBW3kdU95O4Js6evr-yQbnRmkda_lQeW1eapMECn9Us5c-my2_RFak4uo_opN9YdcGlvae8KyYjtFKmG7Z"} and output n/a
1614199555560 : Operation fetchThumbnailResource-76852f77eca64b6eacea137f8f2a50b6-sep-13-beyond-the-clouds-nocal-2560x1440.jpg took 779 ms with inputs {"sourceUrl":"https://qa-bas-hub.mapsqa.arcgis.com/sharing/rest/content/items/79d2924052f4457995816e1554aa74bf/resources/sep-13-beyond-the-clouds-nocal-2560x1440.jpg?token=4FLZcllB4c4nBuiucdVraRPh0lIq5Kl1QAJUkM2r-ydBGS9lEtjDVAmU_rxoOjZfOGejYUQ--IQE51509I2BphS__3pMOzScuKyORe4kjXLZS2dBW3kdU95O4Js6evr-yQbnRmkda_lQeW1eapMECn9Us5c-my2_RFak4uo_opN9YdcGlvae8KyYjtFKmG7Z"} and output n/a
1614199555857 : Operation addResource-76852f77eca64b6eacea137f8f2a50b6-json-resource.json took 484 ms with inputs {"targetItemId":"76852f77eca64b6eacea137f8f2a50b6"} and output n/a
1614199556339 : Operation addResource-76852f77eca64b6eacea137f8f2a50b6-sep-13-beyond-the-clouds-nocal-2560x1440.jpg took 2798 ms with inputs {"targetItemId":"76852f77eca64b6eacea137f8f2a50b6"} and output n/a
1614199559138 : Operation fetchThumbnailResource-76852f77eca64b6eacea137f8f2a50b6-text-resource.txt took 282 ms with inputs {"sourceUrl":"https://qa-bas-hub.mapsqa.arcgis.com/sharing/rest/content/items/79d2924052f4457995816e1554aa74bf/resources/text-resource.txt?token=4FLZcllB4c4nBuiucdVraRPh0lIq5Kl1QAJUkM2r-ydBGS9lEtjDVAmU_rxoOjZfOGejYUQ--IQE51509I2BphS__3pMOzScuKyORe4kjXLZS2dBW3kdU95O4Js6evr-yQbnRmkda_lQeW1eapMECn9Us5c-my2_RFak4uo_opN9YdcGlvae8KyYjtFKmG7Z"} and output n/a
1614199559138 : Operation fetchThumbnailResource-76852f77eca64b6eacea137f8f2a50b6-zip-resource.zip took 623 ms with inputs {"sourceUrl":"https://qa-bas-hub.mapsqa.arcgis.com/sharing/rest/content/items/79d2924052f4457995816e1554aa74bf/resources/zip-resource.zip?token=4FLZcllB4c4nBuiucdVraRPh0lIq5Kl1QAJUkM2r-ydBGS9lEtjDVAmU_rxoOjZfOGejYUQ--IQE51509I2BphS__3pMOzScuKyORe4kjXLZS2dBW3kdU95O4Js6evr-yQbnRmkda_lQeW1eapMECn9Us5c-my2_RFak4uo_opN9YdcGlvae8KyYjtFKmG7Z"} and output n/a
1614199559420 : Operation addResource-76852f77eca64b6eacea137f8f2a50b6-text-resource.txt took 395 ms with inputs {"targetItemId":"76852f77eca64b6eacea137f8f2a50b6"} and output n/a
1614199559761 : Operation addResource-76852f77eca64b6eacea137f8f2a50b6-zip-resource.zip took 1851 ms with inputs {"targetItemId":"76852f77eca64b6eacea137f8f2a50b6"} and output n/a
1614199561612 : Operation moveSite-76852f77eca64b6eacea137f8f2a50b6 took 0 ms with inputs {"id":"76852f77eca64b6eacea137f8f2a50b6"} and output n/a
1614199561613 : Operation postProcess-i98pqph5s took 74964 ms with inputs {} and output n/a
1614199571662 : Operation getDeployedItems took 38974 ms with inputs {"itemIds":["b89311d4d2f24d3dadc34c0645841085","76852f77eca64b6eacea137f8f2a50b6"]} and output n/a
1614199610636 : Operation postProcessItems took 25941 ms with inputs {"itemIds":["b89311d4d2f24d3dadc34c0645841085","76852f77eca64b6eacea137f8f2a50b6"]} and output n/a
1614199634145 : Operation createHubRO-76852f77eca64b6eacea137f8f2a50b6 took 183 ms with inputs {"username":"qa_bas_sol_admin"} and output n/a
1614199634586 : Operation shareItemsToSiteGroups-76852f77eca64b6eacea137f8f2a50b6 took 612 ms with inputs {"siteId":"76852f77eca64b6eacea137f8f2a50b6","username":"qa_bas_sol_admin"} and output n/a
1614199635198 : Operation linkPagesToSite-76852f77eca64b6eacea137f8f2a50b6 took 1377 ms with inputs {"siteId":"76852f77eca64b6eacea137f8f2a50b6","username":"qa_bas_sol_admin"} and output n/a
```

Example of the same process, but an error was thrown from deep in an external library that is not utilizing OperationStack

```
1614199713202 : Operation canDeployTemplates-iukwhlh6b took 157 ms with inputs {"username":"qa_bas_sol_admin"} and output n/a
1614199713359 : Operation deploy-iukwhlh6b started with inputs {"username":"qa_bas_sol_admin","canDeploy":true} but was not completed
1614199714452 : Operation deployTemplate-Hub Page-d541623471414e2fb4200deb91a6f47d took 6983 ms with inputs {"sourceId":"d541623471414e2fb4200deb91a6f47d"} and output {"deployedItems":[{"id":"85a595d6ccce4a55a4c061dc98e1a96b","type":"Hub Page"}]}
1614199714452 : Operation deployHubPageProcessor-d541623471414e2fb4200deb91a6f47d took 6982 ms with inputs {"sourceId":"d541623471414e2fb4200deb91a6f47d","type":"Hub Page"} and output n/a
1614199714453 : Operation createHubRO-d541623471414e2fb4200deb91a6f47d took 147 ms with inputs {"username":"qa_bas_sol_admin"} and output n/a
1614199714600 : Operation createPageModel-d541623471414e2fb4200deb91a6f47d took 2 ms with inputs {"sourceId":"d541623471414e2fb4200deb91a6f47d"} and output n/a
1614199714602 : Operation createPage-d541623471414e2fb4200deb91a6f47d took 1011 ms with inputs {"sourceId":"d541623471414e2fb4200deb91a6f47d"} and output n/a
1614199715613 : Operation deployResources-d541623471414e2fb4200deb91a6f47d took 5821 ms with inputs {"sourceId":"d541623471414e2fb4200deb91a6f47d"} and output n/a
1614199715614 : Operation fetchThumbnailResource-85a595d6ccce4a55a4c061dc98e1a96b-abstract-architecture-black-building-277576.jpg took 2887 ms with inputs {"sourceUrl":"https://qa-bas-hub.mapsqa.arcgis.com/sharing/rest/content/items/d541623471414e2fb4200deb91a6f47d/resources/abstract-architecture-black-building-277576.jpg?token=7Vu_Nao4GALcmLdUeh4b7w5qOIBMTLL6rb_zXxUGrQK5RZY1z5EOO6eeg_l2xDq2o2hsae7GHZ-pHUHfm0g3UNRoSLxeA0_MwZKU-kElQkI_addqJ80VhtPxRdyVfYI-8-is30ng1Q0F6-ABUwS8ZObZC4rZGFTpMt4HD9RIPyuatZORUDqe4-h1mwvb-IIs"} and output n/a
1614199715614 : Operation fetchThumbnailResource-85a595d6ccce4a55a4c061dc98e1a96b-IMG_0420.jpg took 2209 ms with inputs {"sourceUrl":"https://qa-bas-hub.mapsqa.arcgis.com/sharing/rest/content/items/d541623471414e2fb4200deb91a6f47d/resources/IMG_0420.jpg?token=7Vu_Nao4GALcmLdUeh4b7w5qOIBMTLL6rb_zXxUGrQK5RZY1z5EOO6eeg_l2xDq2o2hsae7GHZ-pHUHfm0g3UNRoSLxeA0_MwZKU-kElQkI_addqJ80VhtPxRdyVfYI-8-is30ng1Q0F6-ABUwS8ZObZC4rZGFTpMt4HD9RIPyuatZORUDqe4-h1mwvb-IIs"} and output n/a
1614199717823 : Operation addResource-85a595d6ccce4a55a4c061dc98e1a96b-IMG_0420.jpg took 1246 ms with inputs {"targetItemId":"85a595d6ccce4a55a4c061dc98e1a96b"} and output n/a
1614199718501 : Operation addResource-85a595d6ccce4a55a4c061dc98e1a96b-abstract-architecture-black-building-277576.jpg took 2929 ms with inputs {"targetItemId":"85a595d6ccce4a55a4c061dc98e1a96b"} and output n/a
1614199721434 : Operation movePage-85a595d6ccce4a55a4c061dc98e1a96b took 0 ms with inputs {"id":"85a595d6ccce4a55a4c061dc98e1a96b"} and output n/a
1614199721435 : Operation deployTemplate-Hub Site Application-79d2924052f4457995816e1554aa74bf started with inputs {"sourceId":"79d2924052f4457995816e1554aa74bf"} but was not completed
1614199721435 : Operation createHubRO-79d2924052f4457995816e1554aa74bf took 5988 ms with inputs {"username":"qa_bas_sol_admin"} and output n/a
1614199727423 : Operation createSiteModel-79d2924052f4457995816e1554aa74bf started with inputs {"sourceId":"79d2924052f4457995816e1554aa74bf"} but was not completed
```

The returned OperationError has the stack trace from the original location that threw

```
Error: site-utils::createSiteModelFromTemplate Error TypeError: Cannot set property 'theme' of undefined
    at karma-typescript-bundle--50366-eCa8QbhkgeR0-.js?8643af5618d2e22f36e172e229976bca65d27008:35563
```

For more details please see [OperationStack](../../hub.js/api/common/OperationStack) documentation.
