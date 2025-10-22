// imports trimmed for test
import { computeProps } from "../../../src/projects/_internal/computeProps";
import * as processEntitiesModule from "../../../src/permissions/_internal/processEntityFeatures";
import { ProjectDefaultFeatures } from "../../../src/projects/_internal/ProjectBusinessRules";
import * as computeLinksModule from "../../../src/projects/_internal/computeLinks";
import { IModel } from "../../../src/hub-types";
import { IHubProject } from "../../../src/core/types/IHubProject";
import { cloneObject } from "../../../src/util";
import { describe, it, expect, beforeEach, vi } from "vitest";

describe("projects: computeProps:", () => {
  let context: any;
  let model: IModel;
  let project: Partial<IHubProject>;

  beforeEach(() => {
    model = {
      item: {
        type: "Hub Project",
        id: "00c",
        created: new Date().getTime(),
        modified: new Date().getTime(),
      },
      data: {
        view: {
          featuredImageUrl: "mock-featured-image-url",
        },
      },
    } as unknown as IModel;
    project = {
      type: "Hub Project",
      id: "00c",
      slug: "mock-slug",
    };
    // provide a simple mock context.requestOptions used by computeProps
    context = {
      requestOptions: { portal: "https://org.maps.arcgis.com" },
    };
  });
  describe("features:", () => {
    let spy: any;
    beforeEach(() => {
      spy = vi
        .spyOn(processEntitiesModule, "processEntityFeatures")
        .mockReturnValue({ details: true, settings: false } as any);
    });
    afterEach(() => {
      expect(spy).toHaveBeenCalledTimes(1);
      expect(spy.mock.calls[0][1]).toEqual(ProjectDefaultFeatures);
    });
    it("handles missing settings hash", () => {
      const chk = computeProps(model, project, context.requestOptions);
      expect(chk.features?.details).toBeTruthy();
      expect(chk.features?.settings).toBeFalsy();
      expect(spy.mock.calls[0][0]).toEqual({});
    });
    it("handles missing capabilities hash", () => {
      const chk = computeProps(model, project, context.requestOptions);

      expect(chk.features?.details).toBeTruthy();
      expect(chk.features?.settings).toBeFalsy();
      expect(spy.mock.calls[0][0]).toEqual({});
    });
    it("passes features hash", () => {
      model.data = {
        settings: {
          features: { details: true },
        },
        view: {
          featuredImageUrl: "",
        },
      } as any;
      const chk = computeProps(model, project, context.requestOptions);

      expect(chk.features?.details).toBeTruthy();
      expect(chk.features?.settings).toBeFalsy();
      expect(spy.mock.calls[0][0]).toEqual({ details: true });
    });

    it("generates a links hash", () => {
      const computeLinksSpy = vi
        .spyOn(computeLinksModule, "computeLinks")
        .mockReturnValue({ self: "some-link" } as any);
      const chk = computeProps(model, project, context.requestOptions);
      expect(computeLinksSpy).toHaveBeenCalledTimes(1);
      expect(chk.links).toEqual({ self: "some-link" });
    });

    it("generates a valid featured image url", () => {
      const chk = computeProps(model, project, context.requestOptions);
      expect(chk.view?.featuredImageUrl).toContain("mock-featured-image-url");
    });
    it("handles case where there is no view..", () => {
      const mdl = cloneObject(model);
      if (mdl.data) {
        delete (mdl.data as any).view;
      }
      const chk = computeProps(mdl, project, context.requestOptions);
      expect(chk.view?.featuredImageUrl).toBeUndefined();
    });
  });
});
