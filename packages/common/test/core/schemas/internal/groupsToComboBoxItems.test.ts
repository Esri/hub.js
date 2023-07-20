import { IGroup } from "@esri/arcgis-rest-portal";
import { groupsToComboBoxItems } from "../../../../src/core/schemas/internal/groupsToComboBoxItems";

describe("groupsToComboBoxItems:", () => {
  it("handles empty list of groups", () => {
    const chk = groupsToComboBoxItems([]);
    expect(chk).toEqual([]);
  });

  it("converts ", () => {
    const chk = groupsToComboBoxItems(groups);
    expect(chk.length).toBe(2);
    expect(chk[0]).toEqual({
      value: "00c",
      label: "View Group Admin",
      icon: "view-mixed",
    });
    expect(chk[1]).toEqual({
      value: "00e",
      label: "Edit Group",
      icon: "unlock",
    });
  });
});

const groups: IGroup[] = [
  {
    id: "00f",
    title: "View Group",
    capabilities: [],
    userMembership: { memberType: "viewer" },
    isViewOnly: true,
  },
  {
    id: "00c",
    title: "View Group Admin",
    capabilities: [],
    userMembership: { memberType: "admin" },
    isViewOnly: true,
  },
  {
    id: "00d",
    title: "No member type",
    capabilities: [],
    isViewOnly: true,
  },
  {
    id: "00e",
    title: "Edit Group",
    capabilities: ["updateitemcontrol"],
    userMembership: { memberType: "admin" },
    isViewOnly: false,
  },
] as unknown as IGroup[];
