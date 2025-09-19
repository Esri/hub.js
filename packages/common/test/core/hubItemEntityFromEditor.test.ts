import { hubItemEntityFromEditor } from "../../src/core/_internal/hubItemEntityFromEditor";
import { IHubItemEntityEditor, IHubItemEntity } from "../../src/core/types";
import { IArcGISContext } from "../../src/types";
import * as getTemplateModule from "../../src/core/_internal/getTemplate";

describe("hubItemEntityFromEditor layout setup", () => {
  let context: IArcGISContext;
  let getTemplateSpy: jasmine.Spy;

  beforeEach(() => {
    context = {
      portal: { urlKey: "testorg" },
      userRequestOptions: {},
    } as any;
    getTemplateSpy = spyOn(getTemplateModule, "getTemplate");
  });

  function makeEditor(
    props: Partial<IHubItemEntityEditor<IHubItemEntity>>
  ): IHubItemEntityEditor<IHubItemEntity> {
    return {
      view: {},
      location: {},
      ...props,
    } as IHubItemEntityEditor<IHubItemEntity>;
  }

  it("uses specified simple layout when provided", async () => {
    getTemplateSpy.and.returnValue(Promise.resolve("simple-layout"));
    const editor = makeEditor({
      _layoutSetup: { layout: "simple" },
      orgUrlKey: "TestOrg",
    });
    const result = await hubItemEntityFromEditor(editor, context);
    expect(getTemplateSpy).toHaveBeenCalledWith("simple", context);
    expect(result.entity.layout).toBe("simple-layout");
  });

  it("uses specified blank layout when provided", async () => {
    getTemplateSpy.and.returnValue(Promise.resolve("blank-layout"));
    const editor = makeEditor({
      _layoutSetup: { layout: "blank" },
      orgUrlKey: "TestOrg",
    });
    const result = await hubItemEntityFromEditor(editor, context);
    expect(getTemplateSpy).toHaveBeenCalledWith("blank", context);
    expect(result.entity.layout).toBe("blank-layout");
  });

  it("defaults to blank when _layoutSetup is undefined", async () => {
    getTemplateSpy.and.returnValue(Promise.resolve("blank-layout"));
    const editor = makeEditor({
      orgUrlKey: "TestOrg",
    });
    const result = await hubItemEntityFromEditor(editor, context);
    expect(getTemplateSpy).toHaveBeenCalledWith("blank", context);
    expect(result.entity.layout).toBe("blank-layout");
  });
});
