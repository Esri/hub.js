import { getProp } from "../../src/objects";
import { processActionLink } from "../../src/core/processActionLinks";
import {
  HubActionLink,
  IHubActionLinkSection,
  IHubContentActionLink,
  IHubExternalActionLink,
  IHubWellKnownActionLink,
} from "../../src/core/types/ActionLinks";
import * as searchModule from "../../src/search/hubSearch";

describe("processActionLink", () => {
  let hubSearchSpy: jasmine.Spy;

  it('processes action links of kind "content": fetches the content item and returns an external action link', async () => {
    hubSearchSpy = spyOn(searchModule, "hubSearch").and.returnValue(
      Promise.resolve({
        results: [{ id: "00c", links: { siteRelative: "/mock-site-url" } }],
      })
    );
    const mockLink: IHubContentActionLink = {
      kind: "content",
      contentId: "00c",
      label: "content action link",
    };

    const res = await processActionLink(mockLink, {});
    expect(hubSearchSpy).toHaveBeenCalledTimes(1);
    expect(res).toEqual({
      kind: "external",
      href: "/mock-site-url",
      label: "content action link",
    });
  });

  it('does nothing to action links of kind "external"', async () => {
    const mockLink: IHubExternalActionLink = {
      kind: "external",
      href: "https://some-url.com",
      label: "external action link",
    };

    const res = await processActionLink(mockLink, {});
    expect(res).toEqual(mockLink);
  });

  it('does nothing to action links of kind "well-known"', async () => {
    const mockLink: IHubWellKnownActionLink = {
      kind: "well-known",
      action: "follow",
      label: "well-known action link",
    };

    const res = await processActionLink(mockLink, {});
    expect(res).toEqual(mockLink);
  });

  it('does nothing to action links of kind "section"', async () => {
    const mockLink: IHubActionLinkSection = {
      kind: "section",
      children: [],
      label: "action link section",
    };

    const res = await processActionLink(mockLink, {});
    expect(res).toEqual(mockLink);
  });

  it("handles nested links", async () => {
    hubSearchSpy = spyOn(searchModule, "hubSearch").and.returnValue(
      Promise.resolve({
        results: [{ id: "00c", links: { siteRelative: "/mock-site-url" } }],
      })
    );
    const mockLink: HubActionLink = {
      kind: "section",
      label: "action link section",
      children: [
        {
          kind: "content",
          contentId: "00b",
          label: "nested conent action link",
        },
        {
          kind: "section",
          label: "action link nested section",
          children: [
            {
              kind: "content",
              contentId: "00c",
              label: "doubly nested conent action link",
            },
          ],
        },
      ],
    };

    const res = await processActionLink(mockLink, {});
    expect(getProp(res, "children[0].kind")).toBe("external");
    expect(getProp(res, "children[0].href")).toBe("/mock-site-url");
    expect(getProp(res, "children[1].children[0].kind")).toBe("external");
    expect(getProp(res, "children[1].children[0].href")).toBe("/mock-site-url");
  });

  it("handles errors", async () => {
    hubSearchSpy = spyOn(searchModule, "hubSearch").and.returnValue(
      Promise.reject(new Error("error"))
    );

    const mockLink: IHubContentActionLink = {
      kind: "content",
      contentId: "00c",
      label: "content action link",
    };

    try {
      await processActionLink(mockLink, {});
    } catch (ex) {
      expect(hubSearchSpy).toHaveBeenCalledTimes(1);
      expect((ex as any).message).toBe("Unable to fetch entity: 00c");
    }
  });
});
