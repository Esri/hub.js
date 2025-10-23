import { describe, it, expect, beforeAll, afterAll, vi } from "vitest";
import { getFamily, getFamilyTypes } from "../../src/content/get-family";
import { getCategory, getTypeCategories } from "../../src/content/contentUtils";

describe("getFamily", () => {
  beforeAll(() => {
    // suppress deprecation warnings
    vi.spyOn(console, "warn").mockImplementation(() => {
      return undefined;
    });
  });

  afterAll(() => {
    vi.restoreAllMocks();
  });
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

  describe("getFamily", () => {
    it("can get types any other valid family", () => {
      const type = getFamily("organization");
      expect(type).toBe("organization");
    });

    it("handles specific type overrides (image service, feature service, excel)", () => {
      expect(getFamily("Image Service")).toBe("dataset");
      expect(getFamily("Feature Service")).toBe("map");
      expect(getFamily("Microsoft Excel")).toBe("document");
      expect(getFamily("Event")).toBe("event");
    });

    it("exposes deprecated helpers getCategory and getTypeCategories", () => {
      // call these to ensure deprecated paths are exercised (and warnings suppressed above)
      const cat = getCategory("Feature Layer");
      expect(typeof cat).toBe("string");

      const tcs = getTypeCategories({ type: "Hub Site Application" } as any);
      expect(Array.isArray(tcs)).toBeTruthy();
    });

    it("getTypeCategories returns Other for unknown types and getCategory maps feedback->app", () => {
      const unknown = getTypeCategories({ type: "ThisDoesNotExist" } as any);
      expect(Array.isArray(unknown)).toBeTruthy();
      expect(unknown[0]).toBe("Other");

      // 'Form' is in the feedback collection and should map to 'app' via getCategory
      expect(getCategory("Form")).toBe("app");
    });

    it("calls deprecated helpers with no args to exercise defaults", () => {
      // calling with no args should not throw and should exercise default-parameter branches
      const noCat = getCategory();
      expect(noCat).toBeUndefined();

      const noTypeCats = getTypeCategories();
      expect(Array.isArray(noTypeCats)).toBeTruthy();
      expect(noTypeCats[0]).toBe("Other");
    });
  });
});
