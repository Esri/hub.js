import {
  setAssociationsGroupAccess,
  setAssociationsMembershipAccess,
} from "../../src/associations/updateAssociationGroup";
import { MOCK_CONTEXT } from "../mocks/mock-auth";
import * as updateGroupModule from "@esri/arcgis-rest-portal";

describe("updateAssociationGroup", () => {
  describe("setAssociationsGroupAccess", () => {
    it("sets the access level of the association group", async () => {
      const groupId = "123";
      const access = "public";
      // spy on updateGroup
      const updateGroup = spyOn(
        updateGroupModule,
        "updateGroup"
      ).and.returnValue(Promise.resolve());
      await setAssociationsGroupAccess(groupId, access, MOCK_CONTEXT);
      expect(updateGroup).toHaveBeenCalledWith({
        group: {
          id: groupId,
          access,
        },
        authentication: MOCK_CONTEXT.hubRequestOptions.authentication,
      });
      expect(updateGroup).toHaveBeenCalledTimes(1);
    });
  });

  describe("setAssociationsMembershipAccess", () => {
    it("sets the membership access level of the association group", async () => {
      const groupId = "123";
      const membershipAccess = "organization";
      // spy on updateGroup
      const updateGroup = spyOn(
        updateGroupModule,
        "updateGroup"
      ).and.returnValue(Promise.resolve());
      await setAssociationsMembershipAccess(
        groupId,
        membershipAccess,
        MOCK_CONTEXT
      );
      expect(updateGroup).toHaveBeenCalledWith({
        group: {
          id: groupId,
          membershipAccess,
        },
        authentication: MOCK_CONTEXT.hubRequestOptions.authentication,
      });
      expect(updateGroup).toHaveBeenCalledTimes(1);
    });
  });
});
