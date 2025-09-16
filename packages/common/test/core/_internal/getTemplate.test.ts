import { getTemplate } from "../../../src/core/_internal/getTemplate";
import { IArcGISContext } from "../../../src/types";

describe("getTemplate util", () => {
  let context: IArcGISContext;

  beforeEach(() => {
    context = {
      portal: { urlKey: "testorg" },
      userRequestOptions: {},
    } as any;
  });

  it("returns the simple template", async () => {
    const template = await getTemplate("simple", context);
    expect(template).toBeDefined();
    expect(template.sections.length).toBeGreaterThan(0);
    expect(template.header).toBeDefined();
    expect(template.footer).toBeDefined();
    expect(template.name).toBe("template-name");
  });

  it("returns the blank template", async () => {
    const template = await getTemplate("blank", context);
    expect(template).toBeDefined();
    expect(template.sections.length).toBe(0);
    expect(template.header).toBeUndefined();
    expect(template.footer).toBeUndefined();
    expect(template.name).toBe("template-name");
  });

  it("returns blank for unknown template name", async () => {
    const template = await getTemplate("unknown", context);
    expect(template).toBeDefined();
    expect(template.sections.length).toBe(0);
    expect(template.header).toBeUndefined();
    expect(template.footer).toBeUndefined();
  });

  it("returns the simple template with correct values", async () => {
    const template = await getTemplate("simple", context);
    expect(template).toBeDefined();
    expect(template.sections.length).toBeGreaterThan(0);
    expect(template.header).toBeDefined();
    expect(template.footer).toBeDefined();
    expect(template.name).toBe("template-name");

    // Check first section structure
    const section = template.sections[0];
    expect(section.containment).toBe("fixed");
    expect(section.isFooter).toBe(false);
    expect(Array.isArray(section.rows)).toBe(true);
    expect(section.style).toBeDefined();
    // Check first card in first row
    const firstCard = section.rows[0].cards[0];
    expect(firstCard.component.name).toBe("spacer-card");
    expect(firstCard.component.settings.height).toBeDefined();
    // Check markdown card in second row
    const markdownCard = section.rows[1].cards[0];
    expect(markdownCard.component.name).toBe("markdown-card");
    expect(markdownCard.component.settings.markdown).toBeDefined();
    // Check header and footer structure
    expect(template.header.component.name).toBe("site-header");
    expect(template.footer.component.name).toBe("site-footer");
  });

  it("returns the blank template with correct values", async () => {
    const template = await getTemplate("blank", context);
    expect(template).toBeDefined();
    expect(template.sections.length).toBe(0);
    expect(template.header).toBeUndefined();
    expect(template.footer).toBeUndefined();
    expect(template.name).toBe("template-name");
  });

  it("returns blank for unknown template name with correct values", async () => {
    const template = await getTemplate("unknown", context);
    expect(template).toBeDefined();
    expect(template.sections.length).toBe(0);
    expect(template.header).toBeUndefined();
    expect(template.footer).toBeUndefined();
    expect(template.name).toBe("template-name");
  });
});
