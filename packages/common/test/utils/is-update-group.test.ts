import { IGroup } from "@esri/arcgis-rest-portal";
import { isUpdateGroup } from "../../src/utils/is-update-group";

describe("isUpdateGroup", function() {
  it("should return true when group.capabilities includes updateitemcontrol", function() {
    const group: any = {
      capabilities: ["updateitemcontrol"]
    };
    const results = isUpdateGroup(group as IGroup);
    expect(results).toBe(true);
  });

  it("should return false when group.capabilities omits updateitemcontrol", function() {
    const group: any = {
      capabilities: []
    };
    const results = isUpdateGroup(group as IGroup);
    expect(results).toBe(false);
  });
});
