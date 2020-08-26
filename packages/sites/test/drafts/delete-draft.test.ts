import { deleteDraft } from "../../src/drafts";
import * as getDraftNameModule from "../../src/drafts/_get-draft-resource-name";
import * as portalModule from "@esri/arcgis-rest-portal";
import { IHubRequestOptions, IModel } from "@esri/hub-common";

describe("deleteDraft", () => {
  const draftResourceName = "draft-121231231.json";
  const model = {
    item: {
      owner: "owner",
      id: "my-id"
    }
  } as IModel;
  const ro = ({
    portal: "my-portal",
    authentication: "my-auth"
  } as unknown) as IHubRequestOptions;

  let getDraftSpy: jasmine.Spy;
  let removeResourceSpy: jasmine.Spy;
  beforeEach(function() {
    getDraftSpy = spyOn(
      getDraftNameModule,
      "_getDraftResourceName"
    ).and.returnValue(Promise.resolve(draftResourceName));
    removeResourceSpy = spyOn(
      portalModule,
      "removeItemResource"
    ).and.returnValue(Promise.resolve());
  });

  it("deletes a draft if present", async () => {
    await deleteDraft(model, ro);

    expect(getDraftSpy).toHaveBeenCalledWith("my-id", ro);
    expect(removeResourceSpy).toHaveBeenCalledWith({
      id: "my-id",
      owner: "owner",
      resource: draftResourceName,
      portal: ro.portal,
      authentication: ro.authentication
    });
  });

  it("does nothing if no draft", async () => {
    getDraftSpy.and.returnValue(Promise.resolve(""));

    await deleteDraft(model, ro);

    expect(getDraftSpy).toHaveBeenCalledWith("my-id", ro);
    expect(removeResourceSpy).not.toHaveBeenCalled();
  });
});
