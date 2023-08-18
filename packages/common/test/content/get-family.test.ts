import { getFamilyTypes } from "../../src";

describe("getFamily", () => {
  describe("getFamilyTypes", () => {
    it("can get 'content' types", () => {
      const types = getFamilyTypes("content");
      expect(Array.isArray(types)).toBeTruthy();
      expect(types.length > 0).toBeTruthy();
      expect(types.includes("CAD Drawing")).toBeTruthy();
      expect(types.includes("Feature Collection Template")).toBeTruthy();
      expect(types.includes("Report Template")).toBeTruthy();
    });

    it("can get 'template' types", () => {
      const types = getFamilyTypes("template");
      expect(Array.isArray(types)).toBeTruthy();
      expect(types.length).toBe(2);
      expect(types.includes("Hub Initiative Template")).toBeTruthy();
      expect(types.includes("Solution")).toBeTruthy();
    });

    it("can get 'dataset' types", () => {
      const types = getFamilyTypes("dataset");
      expect(Array.isArray(types)).toBeTruthy();
      expect(types.length > 0).toBeTruthy();
      expect(types.includes("Image Service")).toBeTruthy();
      expect(types.includes("Feature Collection Template")).toBeFalsy();
      // Changed as part of https://confluencewikidev.esri.com/x/KYJuDg
      // Remove when reclassification has been completed
      // expect(types.includes("Feature Service")).toBeFalsy();
      expect(types.includes("Feature Service")).toBeTruthy();
      expect(types.includes("Raster Layer")).toBeFalsy();
      expect(types.includes("Microsoft Excel")).toBeFalsy();
    });

    it("can get 'map' types", () => {
      const types = getFamilyTypes("map");
      expect(Array.isArray(types)).toBeTruthy();
      expect(types.length > 0).toBeTruthy();
      expect(types.includes("Image Service")).toBeFalsy();
      // Changed as part of https://confluencewikidev.esri.com/x/KYJuDg
      // Remove when reclassification has been completed
      // expect(types.includes("Feature Service")).toBeTruthy();
      expect(types.includes("Feature Service")).toBeFalsy();
      expect(types.includes("Raster Layer")).toBeTruthy();
    });

    it("can get 'document' types", () => {
      const types = getFamilyTypes("document");
      expect(Array.isArray(types)).toBeTruthy();
      expect(types.length > 0).toBeTruthy();
      expect(types.includes("CAD Drawing")).toBeFalsy();
      expect(types.includes("Report Template")).toBeFalsy();
      expect(types.includes("Microsoft Excel")).toBeTruthy();
    });

    it("can get 'project' types", () => {
      const types = getFamilyTypes("project");
      expect(Array.isArray(types)).toBeTruthy();
      expect(types.length).toBe(1);
      expect(types.includes("Hub Project")).toBeTruthy();
    });

    it("can get 'discussion' types", () => {
      const types = getFamilyTypes("discussion");
      expect(Array.isArray(types)).toBeTruthy();
      expect(types.length).toBe(1);
      expect(types.includes("Discussion")).toBeTruthy();
    });

    it("can get 'initiative' types", () => {
      const types = getFamilyTypes("initiative");
      expect(Array.isArray(types)).toBeTruthy();
      expect(types.length).toBe(1);
      expect(types.includes("Hub Initiative")).toBeTruthy();
    });

    it("can get types any other valid family", () => {
      const types = getFamilyTypes("site");
      expect(Array.isArray(types)).toBeTruthy();
      expect(types.length > 0).toBeTruthy();
    });

    it("can returns undefined for an invalid family", () => {
      const types = getFamilyTypes("dummy" as any);
      expect(types).toBeUndefined();
    });
  });
});
