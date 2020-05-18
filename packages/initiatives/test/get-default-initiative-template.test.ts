import { getDefaultInitiativeTemplate } from "../src";
import * as commonModule from "@esri/hub-common";
import { IHubRequestOptions } from "@esri/hub-common";

describe("getDefaultInitiativeTemplate", () => {
  const translations = {
    addons: {
      services: {
        templates: {
          customInitiative: {
            item: {
              description: "description-translation",
              snippet: "snippet-translation"
            }
          }
        }
      }
    }
  };

  it("translates correctly", async () => {
    spyOn(commonModule, "fetchHubTranslation").and.returnValue(
      Promise.resolve(translations)
    );

    const tmpl = await getDefaultInitiativeTemplate({} as IHubRequestOptions);

    expect(tmpl.item.description).toBe("description-translation");
    expect(tmpl.item.snippet).toBe("snippet-translation");
    expect(tmpl.item.culture).toBe("en");
  });
});
