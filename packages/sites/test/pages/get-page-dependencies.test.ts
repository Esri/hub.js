import { getPageDependencies } from "../../src";
import { cloneObject, IModel } from "@esri/hub-common";
import { testLayout } from "../mock-layout.test";

describe("getPageDependencies", () => {
  it("getDependencies", function() {
    const m = ({
      item: {},
      data: {
        values: {
          layout: cloneObject(testLayout)
        }
      }
    } as unknown) as IModel;
    const r = getPageDependencies(m);
    expect(r).toBeTruthy("should return a value");
    expect(Array.isArray(r)).toBeTruthy("should be an array");
    expect(r.length).toBe(6, "should have 6 entries");
    expect(r).toEqual(
      [
        // 'cc1',
        "cc2",
        "cc3",
        "0ee0b0a435db49969bbd93a7064a321c",
        "eb173fb9d0084c4bbd19b40ee186965f",
        "e8201f104dca4d8d87cb4ce1c7367257",
        "5a14dbb7b2f3417fb4a6ea0506c2eb26"
      ],
      "should return them"
    );
  });
});
