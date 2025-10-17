import { getEditorSlug } from "../../../src/core/_internal/getEditorSlug";
import { IWithSlug } from "../../../src/core/traits/IWithSlug";

describe("getEditorSlug", () => {
  it("removes orgUrlKey from the start of the slug", () => {
    const entity: IWithSlug = {
      slug: "myorg|my-entity-slug",
      orgUrlKey: "myorg",
    };
    expect(getEditorSlug(entity)).toBe("my-entity-slug");
  });

  it("returns slug unchanged if orgUrlKey is not present", () => {
    const entity: IWithSlug = {
      slug: "my-entity-slug",
    } as IWithSlug;
    expect(getEditorSlug(entity)).toBe("my-entity-slug");
  });

  it("returns slug unchanged if orgUrlKey is empty", () => {
    const entity: IWithSlug = {
      slug: "my-entity-slug",
      orgUrlKey: "",
    };
    expect(getEditorSlug(entity)).toBe("my-entity-slug");
  });

  it("handles slug and orgUrlKey with different casing", () => {
    const entity: IWithSlug = {
      slug: "MyOrg|My-Entity-Slug",
      orgUrlKey: "myorg",
    };
    expect(getEditorSlug(entity)).toBe("my-entity-slug");
  });

  it("returns empty string if slug is missing", () => {
    const entity: IWithSlug = {
      slug: undefined,
      orgUrlKey: "myorg",
    };
    expect(getEditorSlug(entity)).toBe("");
  });

  it("returns empty string if both slug and orgUrlKey are missing", () => {
    const entity: IWithSlug = {} as IWithSlug;
    expect(getEditorSlug(entity)).toBe("");
  });

  it("removes all occurrences of orgUrlKey|", () => {
    const entity: IWithSlug = {
      slug: "myorg|myorg|my-entity-slug",
      orgUrlKey: "myorg",
    };
    expect(getEditorSlug(entity)).toBe("my-entity-slug");
  });
});
