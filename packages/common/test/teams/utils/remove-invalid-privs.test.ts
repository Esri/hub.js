import { removeInvalidPrivs } from "../../../src/teams/utils/remove-invalid-privs";

describe("removeInvalidPrivs", () => {
  it("Correctly passes allowed types through", () => {
    const subTypes = [
      "Demo & Marketing",
      "Demo and Marketing",
      "Organizational Plan",
      "Community",
      "In House",
      "ConnectED",
      "ELA",
      "Education Site License",
      "Education",
      "HUP Online",
    ];
    subTypes.forEach((type) => {
      const user = {
        privileges: [
          "portal:user:addExternalMembersToGroup",
          "portal:admin:assignToGroups",
        ],
      };
      expect(removeInvalidPrivs(user, type).privileges.length).toBe(
        2,
        "it did not remove addExternalMembersToGroup"
      );
    });
  });
  it("Correctly removes priv for non-allowed types", () => {
    const subTypes = [
      "Trial",
      "Personal Use",
      "Developer",
      "Evaluation",
      "Enterprise",
    ];
    subTypes.forEach((type) => {
      const user = {
        privileges: [
          "portal:user:addExternalMembersToGroup",
          "portal:admin:assignToGroups",
        ],
      };
      expect(removeInvalidPrivs(user, type).privileges.length).toBe(
        1,
        "it did remove addExternalMembersToGroup"
      );
    });
  });
});
