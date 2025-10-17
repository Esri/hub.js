import * as Slugs from "../../../src/items/slugs";
import * as InternalSlugs from "../../../src/items/_internal/slugs";
import { ensureUniqueEntitySlug } from "../../../src/items/_internal/ensureUniqueEntitySlug";
import { IHubItemEntity } from "../../../src/core/types/IHubItemEntity";
import { IHubRequestOptions } from "../../../src/hub-types";

describe("ensureUniqueEntitySlug:", () => {
  let entity: IHubItemEntity;
  let requestOptions: IHubRequestOptions;

  beforeEach(() => {
    entity = {
      id: "123",
      slug: "my-slug",
      orgUrlKey: "Org",
      typeKeywords: ["foo"],
    } as any;
    requestOptions = {} as IHubRequestOptions;

    vi.spyOn(Slugs, "getUniqueSlug").mockReturnValue(
      Promise.resolve("org|my-slug-unique")
    );
    vi.spyOn(Slugs, "setSlugKeyword").mockImplementation(
      (keywords: string[], slug: string) => [...keywords, `slug|${slug}`]
    );
    vi.spyOn(InternalSlugs, "truncateSlug").mockImplementation(
      (slug: string, orgUrlKey: string) => `${orgUrlKey}|${slug}`
    );
  });

  it("truncates slug if missing orgUrlKey prefix", async () => {
    entity.slug = "my-slug";
    await ensureUniqueEntitySlug(entity, requestOptions);
    expect(InternalSlugs.truncateSlug).toHaveBeenCalledWith("my-slug", "org");
  });

  it("does not truncate slug if already prefixed", async () => {
    entity.slug = "org|my-slug";
    await ensureUniqueEntitySlug(entity, requestOptions);
    expect(InternalSlugs.truncateSlug).not.toHaveBeenCalled();
  });

  it("calls getUniqueSlug with slug and existingId", async () => {
    await ensureUniqueEntitySlug(entity, requestOptions);
    expect(Slugs.getUniqueSlug).toHaveBeenCalledWith(
      { slug: "org|my-slug", existingId: entity.id },
      requestOptions
    );
  });

  it("calls getUniqueSlug with slug only if no id", async () => {
    delete entity.id;
    await ensureUniqueEntitySlug(entity, requestOptions);
    expect(Slugs.getUniqueSlug).toHaveBeenCalledWith(
      { slug: "org|my-slug" },
      requestOptions
    );
  });

  it("sets the slug keyword in typeKeywords", async () => {
    const result = await ensureUniqueEntitySlug(entity, requestOptions);
    expect(Slugs.setSlugKeyword).toHaveBeenCalledWith(
      ["foo"],
      "org|my-slug-unique"
    );
    expect(result.typeKeywords).toContain("slug|org|my-slug-unique");
  });

  it("returns the mutated entity", async () => {
    const result = await ensureUniqueEntitySlug(entity, requestOptions);
    expect(result).toBe(entity);
    expect(result.slug).toBe("org|my-slug-unique");
  });
});
