import type { IUser } from "@esri/arcgis-rest-portal";
import type { IGroup } from "@esri/arcgis-rest-portal";
import { IChannel } from "../../../../../src/discussions/api/types";

const orgId1 = "3ef";
const orgId2 = "4dc";
const orgId3 = "zzz";
const groupId1 = "foo";
const groupId2 = "bar";
const groupId3 = "baz";

const fakeUser = (props: any = { username: "jdoe", orgId: "3ef" }) =>
  props as IUser;
const fakeGroup = (id: string, memberType: string) =>
  ({ id, userMembership: { memberType } } as IGroup);
const fakeChannel = (props: any) => props as IChannel;

describe("Util: Channel Access", () => {
  let user = fakeUser();
  let user3 = fakeUser();

  beforeEach(() => {
    // org1 member, member in groupId1, admin in groupId2, owner in groupId3
    user = fakeUser({
      username: "jdoe",
      orgId: orgId1,
      groups: [
        fakeGroup(groupId1, "member"),
        fakeGroup(groupId2, "admin"),
        fakeGroup(groupId3, "owner"),
      ],
    });

    // org3 member, member in groupId1, admin in groupId2, owner in groupId3
    user3 = fakeUser({
      username: "mrBurrito",
      orgId: orgId3,
      groups: [
        fakeGroup(groupId1, "member"),
        fakeGroup(groupId2, "admin"),
        fakeGroup(groupId3, "owner"),
      ],
    });
  });
});
