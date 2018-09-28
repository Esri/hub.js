import { TestWindow } from "@stencil/core/testing";
import { ArcGISHubLoginComponent } from "./arcgis-hub-login";

describe("my-component", () => {
  it("should build", () => {
    expect(new ArcGISHubLoginComponent()).toBeTruthy();
  });

  describe("rendering", () => {
    let element: HTMLArcgisHubLoginElement;
    let testWindow: TestWindow;
    beforeEach(async () => {
      testWindow = new TestWindow();
      element = await testWindow.load({
        components: [ArcGISHubLoginComponent],
        html:
          '<arcgis-hub-login clientid="123" communityorg="communityx"></arcgis-hub-login>'
      });
    });

    it("should work without parameters", () => {
      expect(element.clientid).toEqual("123");
    });

    it("should work with a community org", async () => {
      element.communityorg = "communityx";
      await testWindow.flush();
      expect(element.communityorg).toEqual("communityx");
    });
  });
});
