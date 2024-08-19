import {
  HOSTED_FEATURE_SERVICE_DEFINITION,
  HOSTED_FEATURE_SERVICE_GUID,
  HOSTED_FEATURE_SERVICE_ITEM,
  PDF_GUID,
  PDF_ITEM,
} from "./fixtures";
import { MOCK_AUTH } from "../mocks/mock-auth";
import {
  composeHubContent,
  IHubRequestOptions,
  IServiceExtendedProps,
} from "../../src";
import { IHubEditableContentEnrichments } from "../../src/items/_enrichments";
import { IItem } from "@esri/arcgis-rest-portal";

describe("composeHubContent", () => {
  it("composes feature service content", () => {
    const requestOptions = {
      portal: MOCK_AUTH.portal,
      authentication: MOCK_AUTH,
    } as IHubRequestOptions;

    const enrichments: IHubEditableContentEnrichments = {
      server: HOSTED_FEATURE_SERVICE_DEFINITION,
    };

    const chk = composeHubContent(
      HOSTED_FEATURE_SERVICE_ITEM,
      requestOptions,
      enrichments
    );
    const extendedProps = chk.extendedProps as IServiceExtendedProps;
    expect(chk.id).toBe(HOSTED_FEATURE_SERVICE_GUID);
    expect(chk.owner).toBe(HOSTED_FEATURE_SERVICE_ITEM.owner);
    expect(extendedProps.serverExtractCapability).toBeTruthy();
    expect(extendedProps.serverQueryCapability).toBeTruthy();
  });

  it("composes non-service content", () => {
    const requestOptions = { authentication: MOCK_AUTH } as IHubRequestOptions;
    const enrichments: IHubEditableContentEnrichments = { metadata: null };

    const chk = composeHubContent(PDF_ITEM, requestOptions, enrichments);
    expect(chk.id).toBe(PDF_GUID);
    expect(chk.owner).toBe(PDF_ITEM.owner);
  });

  it("normalizes the item type", () => {
    const item = {
      id: "ae3",
      type: "Web Mapping Application",
      typeKeywords: ["hubSite"],
    } as IItem;
    const requestOptions = { authentication: MOCK_AUTH } as IHubRequestOptions;
    const enrichments: IHubEditableContentEnrichments = { metadata: null };

    const chk = composeHubContent(item, requestOptions, enrichments);

    expect(chk.type).toBe("Hub Site Application");
  });
});
