---
title: End-to-End Tests
navTitle: E2E Testing
description: How to leverage E2e Testing
order: 80
group: 4-developers
---

# End-to-End Testing for Hub.js

Hub.js is intended to encapsulate Hub logic for many workflows or scenarios. Ideally we want the UI layer to collect inputs then delegate to Hub.js functions to do the actual "work".

While we require 100% code coverage in this repository, none of those tests actually make real API calls. This is where end-to-end testing comes into play.

## General Ideas

E2e tests are not used to drive code-coverage. Coverage is only driven by the unit tests, and we expect developers to use Jasmine spies (`spyOn(...)` or Sinon stubs (`sinon.stub(...)`) or (worst case) `fetchMock` in those tests so we don't actually make requests to the backin APIs.

E2e tests are not run in CI. Since they use real credentials, for a wide set of user types, in various org types, we don't want to have all that info in CI environments which are prone to breaches (ie. codecov.io breach in early 2021). They exist to be run by a developer, from a local workstation.

E2e tests are used to rapidly verify a complex set of permutations, which would be extremely time consuming to manually test or extremely slow for WebDriver based e2e tests - i.e. verifying all the permutations of user privs, org licensing and team configurations.

## Configuring Identities

Create a `.env` file in the root of the repo, using the `.env-example` as an example. Get the passwords from the normal place.

## Running Tests

From the root of the repo,

- run in chrome: `npm run e2e:chrome`
- run via node: `npm run e2e:node`

## Debugging Tests

Debugging in Chrome is the simplest because you can inspect the network requests, but sometimes it's useful to debug in node.

- run in chrome: `npm run e2e:chrome:debug` will open chrome w/ DevTools open, and run the tests
- in VSCode, go to the Debug panel and select "Debug Node E2E Tests"

## Writing Tests

The e2e tests use jasmine just like the unit tests, so the syntax will be the same. The main difference is that you'll be working with real sessions and real users.

You'll need to import the `Artifactory` class and the `config` that powers it, along with `UserSession`

```
import Artifactory from "./helpers/Artifactory";
import config from "./helpers/config";
import { UserSession } from "@esri/arcgis-rest-auth";

describe("Team Creation Validation:", () => {
  // at the start, construct an artifactory and load it with the config
  // we may streamline this more as we build things out
  let factory: Artifactory;
  beforeAll(() => {
    factory = new Artifactory(config);
  });

  // Create a describe block for each env you want to test with
  describe("Hub Basic:", () => {
    const orgName = "hubBasic";
    let adminSession: UserSession;
    // then setup session objects for the various users you're going to work with
    beforeEach(() => {
      adminSession = factory.getSession(orgName, "admin");
    });
    // now write tests that use those users
    it("gets admin self", () => {
      return adminSession.getUser().then(user => {
        expect(user.groups.length).toBeGreaterThan(
          0,
          "user should have groups"
        );
        expect(user.username).toBe(
          config.envs.qaext.orgs.hubBasic.admin.username,
          "should be basic admin"
        );
      });
    });
  });
});
```
