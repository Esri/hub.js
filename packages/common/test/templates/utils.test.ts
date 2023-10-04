import { IItem } from "@esri/arcgis-rest-types";
import { getDeployedTemplateType } from "../../src/templates/utils";

describe("template utils", () => {
  describe("getDeployedTemplateType", () => {
    it("Extracts the activated solution template type", () => {
      const mockTemplate = {
        typeKeywords: ["hubSolutionType|hubSiteApplication"],
      } as unknown as IItem;
      const chk = getDeployedTemplateType(mockTemplate);

      expect(chk).toBe("Hub Site Application");
    });
    it('Returns "Solution" as the fallback type', () => {
      const mockTemplate = { typeKeywords: [] } as unknown as IItem;
      const chk = getDeployedTemplateType(mockTemplate);

      expect(chk).toBe("Solution");
    });
    it("Handles non-standard item types", () => {
      const mockTemplate = {
        typeKeywords: ["hubSolutionType|storyMap"],
      } as unknown as IItem;
      const chk = getDeployedTemplateType(mockTemplate);

      expect(chk).toBe("StoryMap");
    });
  });
});
