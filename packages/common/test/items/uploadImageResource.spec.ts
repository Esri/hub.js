vi.mock("@esri/arcgis-rest-portal", async (importOriginal) => ({
  ...(await importOriginal()),
  addItemResource: vi.fn(),
}));

import { MOCK_AUTH } from "../mocks/mock-auth";
import * as portalModule from "@esri/arcgis-rest-portal";
import { uploadImageResource } from "../../src/items/uploadImageResource";

afterEach(() => vi.restoreAllMocks());

describe("uploadImageResource:", () => {
  it("calls addItemResource with expected params", async () => {
    const addSpy = vi
      .spyOn(portalModule as any, "addItemResource")
      .mockResolvedValue({ success: true });
    const resp = await uploadImageResource(
      "3ef",
      "bob",
      "fakeFile",
      "featuredImage.png",
      {
        authentication: MOCK_AUTH,
      }
    );
    expect(resp).toEqual(
      "https://www.arcgis.com/sharing/rest/content/items/3ef/resources/featuredImage.png"
    );
    expect((addSpy as any).mock.calls.length).toBe(1);
    const args = (addSpy as any).mock.calls[0][0];
    expect(args.id).toBe("3ef");
    expect(args.owner).toEqual("bob");
    expect(args.resource).toEqual("fakeFile");
    expect(args.name).toEqual("featuredImage.png");
    expect(args.authentication).toEqual(MOCK_AUTH);
  });

  it("Properly constructs url when a prefix is passed", async () => {
    const addSpy = vi
      .spyOn(portalModule as any, "addItemResource")
      .mockResolvedValue({ success: true });
    const resp = await uploadImageResource(
      "3ef",
      "bob",
      "fakeFile",
      "featuredImage.png",
      {
        authentication: MOCK_AUTH,
      },
      "images"
    );
    expect(resp).toEqual(
      "https://www.arcgis.com/sharing/rest/content/items/3ef/resources/images/featuredImage.png"
    );
    expect((addSpy as any).mock.calls.length).toBe(1);
    const args = (addSpy as any).mock.calls[0][0];
    expect(args.id).toBe("3ef");
    expect(args.owner).toEqual("bob");
    expect(args.resource).toEqual("fakeFile");
    expect(args.name).toEqual("featuredImage.png");
    expect(args.authentication).toEqual(MOCK_AUTH);
    expect(args.prefix).toEqual("images");
  });

  it("throws hub error if add fails", async () => {
    vi.spyOn(portalModule as any, "addItemResource").mockResolvedValue({
      success: false,
    });
    await expect(
      uploadImageResource("3ef", "bob", "fakeFile", "featuredImage.png", {
        authentication: MOCK_AUTH,
      })
    ).rejects.toHaveProperty("name", "HubError");
  });

  it("throws hub error if add rejects with error", async () => {
    vi.spyOn(portalModule as any, "addItemResource").mockRejectedValue(
      new Error("Fake Rejection")
    );
    await expect(
      uploadImageResource("3ef", "bob", "fakeFile", "featuredImage.png", {
        authentication: MOCK_AUTH,
      })
    ).rejects.toHaveProperty("name", "HubError");
  });

  it("throws hub error if add rejects with non-error", async () => {
    vi.spyOn(portalModule as any, "addItemResource").mockRejectedValue(
      "Fake Rejection"
    );
    await expect(
      uploadImageResource("3ef", "bob", "fakeFile", "featuredImage.png", {
        authentication: MOCK_AUTH,
      })
    ).rejects.toHaveProperty("name", "HubError");
  });
});
