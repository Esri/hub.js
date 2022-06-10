import { cloneObject, IFilterGroup, IHubSearchOptions } from "../../../src";
import { portalSearchUsers } from "../../../src/search/_internal/portalSearchUsers";
import * as Portal from "@esri/arcgis-rest-portal";
import { MOCK_AUTH } from "../../mocks/mock-auth";
import * as SimpleResponse from "../../mocks/user-search/simple-response.json";

describe("portalSearchUsers:", () => {
  it("throws if requestOptions not passed in IHubSearchOptions", async () => {
    const f: IFilterGroup<"user"> = {
      operation: "AND",
      filterType: "user",
      filters: [
        {
          filterType: "user",
          term: "water",
        },
      ],
    };
    const opts: IHubSearchOptions = {};

    try {
      await portalSearchUsers([f], opts);
    } catch (err) {
      expect(err.name).toBe("HubError");
      expect(err.message).toBe(
        "requestOptions: IHubRequestOptions is required."
      );
    }
  });
  it("throws if requestOptions.auth not passed in IHubSearchOptions", async () => {
    const f: IFilterGroup<"user"> = {
      operation: "AND",
      filterType: "user",
      filters: [
        {
          filterType: "user",
          term: "water",
        },
      ],
    };
    const opts: IHubSearchOptions = {
      requestOptions: {
        portal: "https://myserver.com/sharing/rest",
      },
    };

    try {
      await portalSearchUsers([f], opts);
    } catch (err) {
      expect(err.name).toBe("HubError");
      expect(err.message).toBe("requestOptions must pass authentication.");
    }
  });
  it("simple search", async () => {
    const searchUsersSpy = spyOn(Portal, "searchUsers").and.callFake(() => {
      return Promise.resolve(cloneObject(SimpleResponse));
    });
    const f: IFilterGroup<"user"> = {
      operation: "AND",
      filterType: "user",
      filters: [
        {
          filterType: "user",
          firstname: "Jane",
        },
      ],
    };
    const opts: IHubSearchOptions = {
      requestOptions: {
        portal: "https://www.arcgis.com/sharing/rest",
        authentication: MOCK_AUTH,
      },
    };

    await portalSearchUsers([f], opts);

    expect(searchUsersSpy.calls.count()).toBe(1, "should call searchItems");
    const [expectedParams] = searchUsersSpy.calls.argsFor(0);
    expect(expectedParams.portal).toBeUndefined();
    expect(expectedParams.q).toEqual(`firstname:"Jane"`);
    expect(expectedParams.authentication).toEqual(
      opts.requestOptions.authentication
    );
    expect(expectedParams.countFields).not.toBeDefined();
  });
});
