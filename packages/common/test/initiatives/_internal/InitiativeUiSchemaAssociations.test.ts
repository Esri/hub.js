import { buildUiSchema } from "../../../src/initiatives/_internal/InitiativeUiSchemaAssociations";
import { getMockContextWithPrivilenges } from "../../mocks/mock-auth";

describe("InitiativeUiSchemaAssociations", () => {
  it("creates the uiSchema without privileges", async () => {
    const uiSchema = await buildUiSchema("some.scope", {}, {} as any);
    expect(uiSchema).toEqual({
      type: "Layout",
      elements: [],
    });
  });

  it("creates the uiSchema with privileges", async () => {
    const uiSchema = await buildUiSchema(
      "some.scope",
      {},
      getMockContextWithPrivilenges(["portal:user:addExternalMembersToGroup"])
    );
    expect(uiSchema).toEqual({
      type: "Layout",
      elements: [],
    });
  });
});
