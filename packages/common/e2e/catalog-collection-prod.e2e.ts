import { Catalog, IHubCatalog } from "../src/search";
import Artifactory from "./helpers/Artifactory";
import config from "./helpers/config";

// Water Resources | 67f5723b1b464ba38be91b91ff3ea442
// Landbase | 202b983812b44e94be74a4d449841a49

fdescribe("catalog and collection e2e:", () => {
  let factory: Artifactory;
  const orgName = "hubPremium";
  beforeAll(() => {
    factory = new Artifactory(config, "prod");
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 200000;
  });

  const catalog: IHubCatalog = {
    title: "e2e test",
    schemaVersion: 1,
    scopes: {
      // item: {
      //   targetEntity: "item",
      //   filters: [
      //     {
      //       predicates: [
      //         {
      //           group: "58493541f0f746ca8d81bd0d00ccf522",
      //         },
      //       ],
      //     },
      //   ],
      // },
      // group: {
      //   targetEntity: "group",
      //   filters: [
      //     {
      //       predicates: [
      //         {
      //           orgid: "MNF5ypRINzAAlFbv",
      //         },
      //       ],
      //     },
      //   ],
      // },
    },
    collections: [
      {
        label: "Water Resources",
        targetEntity: "item",
        key: "waterResources",
        scope: {
          targetEntity: "item",
          filters: [
            {
              predicates: [
                {
                  group: "67f5723b1b464ba38be91b91ff3ea442",
                },
              ],
            },
          ],
        },
      },
      {
        label: "Landbase",
        targetEntity: "item",
        key: "landbase",
        scope: {
          targetEntity: "item",
          filters: [
            {
              predicates: [
                {
                  group: "202b983812b44e94be74a4d449841a49",
                },
              ],
            },
          ],
        },
      },
      {
        label: "Lots of groups",
        targetEntity: "item",
        key: "lotsOfGroups",
        scope: {
          targetEntity: "item",
          filters: [
            {
              predicates: [
                {
                  group: [
                    "225b38080fd540cd8e2ad3f69ab7c82a",
                    "345fec857b1f48e79ecb99f88e1deafc",
                    "16fa6e0c29f64741aaafe2192776c271",
                    "b57d304daefb40d08bfc81f6f710088e",
                    "9e1ce24433644fef9315a9c0bc8c7c82",
                    "9298eaa2acd84cc59c2ec48aa84b8958",
                    "5bd24e2414804dc6b775ac60789f5746",
                    "96ab7d78969c4ae3bb97197077c7e3e3",
                    "cbcde0eaa2754cdbbf8e7c4583053109",
                    "4e6073b4b0464b208634f32d1bcbe57e",
                    "ef6f5a5deb4e4087876e1f9519a14c50",
                    "ca74aac491f84093a82094b56c7fcbb9",
                    "64dfeb1c66f64daaaca56e4c851945c4",
                    "b680e73d6d6742f3a667666dc7360e73",
                    "5b3b581d38424b1aadbb29b75b02c9fd",
                    "da7c5018711743c99a234cbbdcc8823b",
                    "a26ad60d1f6b4b6aa2467a7ea94e9b8f",
                    "e1c4ad3abb1b4bdb90d98cbbf69224de",
                    "71cc2db4a1b04fbf9f71afb278392263",
                    "b5eccb23fd5c4918abf372f5fb4eadd6",
                    "0c41d569ccd24c8982abee7a49ec4d7d",
                    "0727c60d187e4ed9a97a6604c5aba465",
                    "565cea80c9764da2906cdfd660d7d60e",
                    "2cf66a60c7a94b409c6b5dd3381d391e",
                    "3d719c8c9f104823a4fb706188105663",
                    "bd55b641c426428494d7999a6553087b",
                    "947fd013a6064ae2b09c540b0d437798",
                    "150590625975417b805b1f51e75e94a3",
                    "8ffb1c75f10944fa962685317878456d",
                    "3919a33c23314d7da509831c8adda457",
                    "1dea87e0cb604d5ab27e44cab83d273e",
                    "2003eeac5a5e442d965977e4a12d6268",
                    "3da9335caaa24abc8466938c0c78f839",
                    "cea7e9a2e9464f2d93301ec42b424d73",
                    "88ad8f3b7bc3451a945345390c8d8ea6",
                    "7175d59dbfbf487d8f7bf43547f86f83",
                    "3a5baf5c3acf4317875cf764afea99c5",
                    "2c560a5c6f2e4bd9936be329efd10362",
                    "5ba2271c7c1945a0862414e7e2e89f23",
                    "64553f89e56e420f9898e94f23b06d99",
                    "796dc396a00f48cc965a5ce31976eeaa",
                    "c251cdc11a7044b199d3e652afbceff6",
                    "7b04b4039a794f5181c7c3889b7523b9",
                    "0146aeb9ec0f4703ab587a77777e5de6",
                    "c8886b8639b147a49457d2f067b8690a",
                    "02fbfb0bba034514a0f7ad49875b4f77",
                    "97bd58f0403642a4a3111cda61818429",
                    "f8a80f1a86034aed8b141dbfd7dc97e7",
                    "3d8f0a59e76f46a3a17459121491c076",
                    "7212cfbc999444179688bd42730739b9",
                    "10cba26b758546c1a488ba2908bd7bb2",
                    "4faf852499d14a71926b50ce3d8b9a6c",
                    "770acfcc47fa4ba2b8149e4f976b6922",
                    "c8c2cba67d064f038dbaf2f19dd4ea88",
                    "95c538d8bac1488ab85291c22088b67c",
                    "8c9183b20969428e8deb3effc7410f70",
                    "291bc7ca8c2045dc9087a84a1134662d",
                    "0bedb548c7d44758939354c067c5ccc3",
                    "73d796f97e4c450199a78257a425a607",
                    "9187d459b3654dbaa282cb5117d8c9c9",
                  ],
                },
              ],
            },
          ],
        },
      },
      {
        label: "Supporting Groups",
        targetEntity: "group",
        key: "supportingGroups",
        scope: {
          targetEntity: "group",
          filters: [
            {
              predicates: [
                {
                  id: [
                    "202b983812b44e94be74a4d449841a49",
                    "67f5723b1b464ba38be91b91ff3ea442",
                  ],
                },
              ],
            },
          ],
        },
      },
      {
        label: "Supporting Users",
        targetEntity: "user",
        key: "supportingUsers",
        scope: {
          targetEntity: "user",
          filters: [
            {
              predicates: [
                {
                  group: [
                    "202b983812b44e94be74a4d449841a49",
                    "67f5723b1b464ba38be91b91ff3ea442",
                  ],
                },
              ],
            },
          ],
        },
      },
    ],
  };
  const waterResourcesCatalog: IHubCatalog = {
    title: "Water Resources Catalog",
    schemaVersion: 1,
    collections: [
      {
        label: "Water Resources",
        targetEntity: "item",
        key: "waterResources",
        scope: {
          targetEntity: "item",
          filters: [
            {
              predicates: [
                {
                  group: "67f5723b1b464ba38be91b91ff3ea442",
                },
              ],
            },
          ],
        },
      },
    ],
  };
  const lotsOfGroupsCatalog: IHubCatalog = {
    title: "Lots of Groups Catalog",
    schemaVersion: 1,
    collections: [
      {
        label: "Lots of Groups",
        targetEntity: "item",
        key: "lotsOfGroups",
        scope: {
          targetEntity: "item",
          filters: [
            {
              predicates: [
                {
                  group: [
                    "225b38080fd540cd8e2ad3f69ab7c82a",
                    "345fec857b1f48e79ecb99f88e1deafc",
                    "16fa6e0c29f64741aaafe2192776c271",
                    "b57d304daefb40d08bfc81f6f710088e",
                    "9e1ce24433644fef9315a9c0bc8c7c82",
                    "9298eaa2acd84cc59c2ec48aa84b8958",
                    "5bd24e2414804dc6b775ac60789f5746",
                    "96ab7d78969c4ae3bb97197077c7e3e3",
                    "cbcde0eaa2754cdbbf8e7c4583053109",
                    "4e6073b4b0464b208634f32d1bcbe57e",
                    "ef6f5a5deb4e4087876e1f9519a14c50",
                    "ca74aac491f84093a82094b56c7fcbb9",
                    "64dfeb1c66f64daaaca56e4c851945c4",
                    "b680e73d6d6742f3a667666dc7360e73",
                    "5b3b581d38424b1aadbb29b75b02c9fd",
                    "da7c5018711743c99a234cbbdcc8823b",
                    "a26ad60d1f6b4b6aa2467a7ea94e9b8f",
                    "e1c4ad3abb1b4bdb90d98cbbf69224de",
                    "71cc2db4a1b04fbf9f71afb278392263",
                    "b5eccb23fd5c4918abf372f5fb4eadd6",
                    "0c41d569ccd24c8982abee7a49ec4d7d",
                    "0727c60d187e4ed9a97a6604c5aba465",
                    "565cea80c9764da2906cdfd660d7d60e",
                    "2cf66a60c7a94b409c6b5dd3381d391e",
                    "3d719c8c9f104823a4fb706188105663",
                    "bd55b641c426428494d7999a6553087b",
                    "947fd013a6064ae2b09c540b0d437798",
                    "150590625975417b805b1f51e75e94a3",
                    "8ffb1c75f10944fa962685317878456d",
                    "3919a33c23314d7da509831c8adda457",
                    "1dea87e0cb604d5ab27e44cab83d273e",
                    "2003eeac5a5e442d965977e4a12d6268",
                    "3da9335caaa24abc8466938c0c78f839",
                    "cea7e9a2e9464f2d93301ec42b424d73",
                    "88ad8f3b7bc3451a945345390c8d8ea6",
                    "7175d59dbfbf487d8f7bf43547f86f83",
                    "3a5baf5c3acf4317875cf764afea99c5",
                    "2c560a5c6f2e4bd9936be329efd10362",
                    "5ba2271c7c1945a0862414e7e2e89f23",
                    "64553f89e56e420f9898e94f23b06d99",
                    "796dc396a00f48cc965a5ce31976eeaa",
                    "c251cdc11a7044b199d3e652afbceff6",
                    "7b04b4039a794f5181c7c3889b7523b9",
                    "0146aeb9ec0f4703ab587a77777e5de6",
                    "c8886b8639b147a49457d2f067b8690a",
                    "02fbfb0bba034514a0f7ad49875b4f77",
                    "97bd58f0403642a4a3111cda61818429",
                    "f8a80f1a86034aed8b141dbfd7dc97e7",
                    "3d8f0a59e76f46a3a17459121491c076",
                    "7212cfbc999444179688bd42730739b9",
                    "10cba26b758546c1a488ba2908bd7bb2",
                    "4faf852499d14a71926b50ce3d8b9a6c",
                    "770acfcc47fa4ba2b8149e4f976b6922",
                    "c8c2cba67d064f038dbaf2f19dd4ea88",
                    "95c538d8bac1488ab85291c22088b67c",
                    "8c9183b20969428e8deb3effc7410f70",
                    "291bc7ca8c2045dc9087a84a1134662d",
                    "0bedb548c7d44758939354c067c5ccc3",
                    "73d796f97e4c450199a78257a425a607",
                    "9187d459b3654dbaa282cb5117d8c9c9",
                  ],
                },
              ],
            },
          ],
        },
      },
    ],
  };
  const landBaseCatalog: IHubCatalog = {
    title: "Landbase Catalog",
    schemaVersion: 1,
    collections: [
      {
        label: "Landbase",
        targetEntity: "item",
        key: "landbase",
        scope: {
          targetEntity: "item",
          filters: [
            {
              predicates: [
                {
                  group: "202b983812b44e94be74a4d449841a49",
                },
              ],
            },
          ],
        },
      },
    ],
  };
  const supportingUsersCatalog: IHubCatalog = {
    title: "Supporting Users Catalog",
    schemaVersion: 1,
    collections: [
      {
        label: "Supporting Users",
        targetEntity: "user",
        key: "supportingUsers",
        scope: {
          targetEntity: "user",
          filters: [
            {
              predicates: [
                {
                  group: [
                    "202b983812b44e94be74a4d449841a49",
                    "67f5723b1b464ba38be91b91ff3ea442",
                  ],
                },
              ],
            },
          ],
        },
      },
    ],
  };
  const supportingGroupsCatalog: IHubCatalog = {
    title: "Supporting Groups Catalog",
    schemaVersion: 1,
    collections: [
      {
        label: "Supporting Groups",
        targetEntity: "group",
        key: "supportingGroups",
        scope: {
          targetEntity: "group",
          filters: [
            {
              predicates: [
                {
                  id: [
                    "202b983812b44e94be74a4d449841a49",
                    "67f5723b1b464ba38be91b91ff3ea442",
                  ],
                },
              ],
            },
          ],
        },
      },
    ],
  };

  describe("catalog search", () => {
    it("can search all collections", async () => {
      const ctxMgr = await factory.getContextManager(orgName, "admin");
      const instance = Catalog.fromJson(catalog, ctxMgr.context);
      // time this request
      const start = new Date().getTime();
      const results = await instance.searchCollections("water");
      const end = new Date().getTime();

      // console.log("time taken", end - start);
      // Object.keys(results).forEach((key) => {
      //   console.log(key, results[key].results.length);
      // });
    });
    it("search many catalogs", async () => {
      const ctxMgr = await factory.getContextManager(orgName, "admin");
      const catalogs = [
        Catalog.fromJson(waterResourcesCatalog, ctxMgr.context),
        Catalog.fromJson(lotsOfGroupsCatalog, ctxMgr.context),
        Catalog.fromJson(landBaseCatalog, ctxMgr.context),
        Catalog.fromJson(supportingUsersCatalog, ctxMgr.context),
        Catalog.fromJson(supportingGroupsCatalog, ctxMgr.context),
      ];
      const start = new Date().getTime();
      const results = await Promise.all(
        catalogs.map(async (cat) => {
          return await cat.searchCollections("water");
        })
      );
      const end = new Date().getTime();

      // console.log("time taken", end - start);
      // debugger;
      // results.forEach((result) => {
      //   Object.keys(result).forEach((key) => {
      //     console.log(key, result[key].results.length);
      //   });
      // });
    });
  });
});
