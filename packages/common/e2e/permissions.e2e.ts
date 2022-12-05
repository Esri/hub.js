import { IGroup, IItem } from "@esri/arcgis-rest-portal";
import { IArcGISContext } from "../src/ArcGISContext";
import { checkPermission, fetchHubEntity, HubEntity } from "../src/index";
import Artifactory from "./helpers/Artifactory";
import config from "./helpers/config";

const TEST_ITEM_ID = "7deb8b7bdb4f4fab973513ebb55cd9a6";

describe("Check Permissions", () => {
  let factory: Artifactory;
  const orgName = "hubPremium";
  let context: IArcGISContext;
  beforeAll(async () => {
    factory = new Artifactory(config);
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 200000;
    const ctxMgr = await factory.getContextManager(orgName, "user");
    context = ctxMgr.context;
  });
  describe("hacking", () => {
    it("testing", async () => {
      // get a project
      const entity: HubEntity = await fetchHubEntity(
        "project",
        TEST_ITEM_ID,
        context
      );
      debugger;
      // check permissions on a site
      // SYSTEM POLICY
      // {
      //   permission: "hub:site:edit",
      //   subsystems: ["sites"],
      //   authenticated: true,
      //   licenses: ["hub-basic", "hub-premium", "enterprise-sites"],
      //   entityEdit: true,
      // },
      //
      // ENTITY POLICY - stored w/ the item
      // [
      // {
      //   "id": "hub:site:edit",
      //   "collaborationType": "group",
      //   "collaborationId": "3ef"
      // },
      // {
      //   "id": "hub:site:edit",
      //   "collaborationType": "user",
      //   "collaborationId": "e2e_pre_pub_publisher"
      // },
      // {
      //   "id": "hub:site:edit",
      //   "collaborationType": "group",
      //   "collaborationId": "bc4"
      // },
      // ];
      const results = checkPermission("hub:site:edit", context, entity);
      debugger;

      // Send Arbitrary Entity with cross lookups
      const group: IGroup = {
        id: "00c",
        typekeywords: ["cannotDiscuss"],
      } as unknown as IGroup;
      const user = {
        groupIds: ["00c"],
      };
      // POLICY
      // {
      //   permission: "discussions:channel:createprivate",
      //   authenticated: true,
      //   subsystems: ["discussions"],
      //   licenses: ["hub-basic", "hub-premium"],
      //   assertions: [
      //     { GROUP CANNOT HAVE THIS cannotDiscuss KEYWORD
      //       property: "group.typekeywords",
      //       operation: "notContains",
      //       value: "cannotDiscuss",
      //     },
      //     { USER MUST BE MEMBER OF GROUP
      //       property: "user.groupIds",
      //       operation: "contains",
      //       value: "lookup:group.id",
      //     },
      //   ],
      // },
      const chk = checkPermission(
        "discussions:channel:createprivate",
        context,
        { group, user }
      );
      debugger;
    });
  });
});
