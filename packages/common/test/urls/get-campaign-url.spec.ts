import { getCampaignUrl } from "../../src/urls/get-campaign-url";

describe("getCampaignUrl", function () {
  it("should build a campaign url", () => {
    expect(
      getCampaignUrl({
        portal: "https://devext.arcgis.com/sharing/rest",
        uri: "some://uri",
        redirectUrl: "https://some.hubdev.arcgis.com",
        meta: {
          channelId: "channel1",
          postId: "post1",
          replyId: "reply1",
          discussion: "hub://content/1",
        },
      })
    ).toEqual(
      "https://hubdev.arcgis.com/c?d=eyJ1cmkiOiJzb21lOi8vdXJpIiwicmVkaXJlY3RVcmwiOiJodHRwczovL3NvbWUuaHViZGV2LmFyY2dpcy5jb20iLCJtZXRhIjp7ImNoYW5uZWxJZCI6ImNoYW5uZWwxIiwicG9zdElkIjoicG9zdDEiLCJyZXBseUlkIjoicmVwbHkxIiwiZGlzY3Vzc2lvbiI6Imh1YjovL2NvbnRlbnQvMSJ9fQ%3D%3D"
    );
  });
});
