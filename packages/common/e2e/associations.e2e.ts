import {
  IHubInitiative,
  fetchConnectedProjects,
  fetchAssociatedProjects,
  fetchHubEntity,
  fetchUnConnectedProjects,
} from "../src";
import Artifactory from "./helpers/Artifactory";
import config from "./helpers/config";
import {
  ICreateOutput,
  cleanupItems,
  createInitiative,
  createProjects,
  createScopeGroup,
} from "./helpers/metric-fixtures-crud";

const PAIGE_TEST_ITEMS = {
  initiative: "14889476c9fd46dbabd694bfd6f65dc4",
  projects: [
    "1001b7f5150f4b648e61e8c812037921",
    "be83e401f9994b93bb2ead0c96c45c9c",
    "56e11f847fbb464282eb990cbd139cbd",
    "8cc00de75b82414c8c0761aa4300bae3",
    "e4852c6189f342399f2af0b69f2558c8",
    "68f0231fe334405d8d863c6afedf8a04",
    "e5abc74668714e84bb8c56f6c97e5c95",
    "e06d9f783bff4e3595843f432a4957b5",
    "c49dbaa2ea6045cbb12cefe739f871b0",
    "238352acd82d4b55aa59741bba8c269e",
    "30fde25db8884a40acff2c39b1e9d075",
    "dc46f405197d4111a7584fbdef14c6c9",
  ],
};

const TEST_ITEMS = {
  initiative: "7496421b25db44178bf8993d4eb368a5",
  projects: [
    "93b53647d84540b9ac4f97891723992c",
    "674cec049f5a476ba5417fdf92be0e4c",
    "4a25fa2d42b74190b6c2ca0ddabced00",
    "85b59fedce9f4d44b8aa47eb580eae01",
    "2a6a95d2066e4f3986cccfe81defc45b",
    "1bf6055230934e92bca7dfa214507cab",
    "e70ad618cb174a0181e792a461d9643d",
    "9bcce39151544569a0fe1ea850861df0",
    "5cad311f404c4af6be6e64bcf547bf16",
    "06c9f201111643179ab8029c91baaa2a",
    "980f7687a54e49b29f6ab5cc3903eb5e",
    "2d13d504997740c1acb50b2b7a131ee7",
  ],
};

fdescribe("associations development harness:", () => {
  let factory: Artifactory;
  const orgName = "hubPremiumAlpha";
  beforeAll(() => {
    factory = new Artifactory(config);
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 200000;
  });
  xdescribe("create harness items:", () => {
    it("create initative and projects", async () => {
      const created: ICreateOutput[] = [];
      const ctxMgr = await factory.getContextManager(orgName, "paige");
      const configs = [{ key: "Assoc With Metrics", count: 12, groupId: "" }];
      try {
        for (const cfg of configs) {
          // create the group that will be the Initaitive's Project Collection Scope
          const group = await createScopeGroup(cfg, ctxMgr.context);
          cfg.groupId = group.id;
          // create initiative with metric definitions and project collection scope
          const initiative = await createInitiative(cfg, ctxMgr.context);
          // create projets with metric values, shared to the group
          const projects = await createProjects(
            cfg,
            initiative.id,
            ctxMgr.context
          );
          created.push({
            group,
            initiative,
            projects,
          });
        }
      } finally {
        for (const items of created) {
          const initiative = items.initiative.toJson();
          /* tslint:disable no-console */
          console.info(`Initiative: ${initiative.id} Group: ${items.group.id}`);
          items.projects.forEach((project) => {
            /* tslint:disable no-console */
            console.log(`Project: ${project.id}`);
          });
          // debugger;
          // await cleanupItems(items, ctxMgr.context);
        }
      }
    });
  });
  describe("flex the functions:", () => {
    it("search for associated projects", async () => {
      const ctxMgr = await factory.getContextManager(orgName, "admin");
      const context = ctxMgr.context;
      const entity = (await fetchHubEntity(
        "initiative",
        TEST_ITEMS.initiative,
        context
      )) as IHubInitiative;
      // debugger;
      const projects = await fetchAssociatedProjects(
        entity,
        context.hubRequestOptions
      );
      expect(projects.length).toBe(6);
    });
    it("search for un-related projects", async () => {
      const ctxMgr = await factory.getContextManager(orgName, "admin");
      const context = ctxMgr.context;
      const entity = (await fetchHubEntity(
        "initiative",
        TEST_ITEMS.initiative,
        context
      )) as IHubInitiative;
      // debugger;
      const projects = await fetchUnConnectedProjects(
        entity,
        context.hubRequestOptions
      );
      // need to update this so we fetch all pages
      expect(projects.length).toBe(10);
    });

    it("search for related projects", async () => {
      const ctxMgr = await factory.getContextManager(orgName, "admin");
      const context = ctxMgr.context;
      const entity = (await fetchHubEntity(
        "initiative",
        TEST_ITEMS.initiative,
        context
      )) as IHubInitiative;
      const projects = await fetchConnectedProjects(
        entity,
        context.hubRequestOptions
      );

      expect(projects.length).toBe(6);
    });
  });
});
