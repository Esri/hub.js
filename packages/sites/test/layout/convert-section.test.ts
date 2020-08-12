import { convertSection } from "../../src/layout";

import * as convertRow from "../../src/layout/convert-row";
import * as extractAssets from "../../src/layout/extract-assets";
import { IRow } from "../../src/layout/types";

describe("convertSection", function() {
  it("section with empty rows should return cloned section and empty assets", function() {
    const section = {
      rows: [] as IRow[]
    };

    expect(convertSection(section)).toEqual({
      section: {
        rows: []
      },
      assets: []
    });
  });

  it("all rows should be converted and assets extracted", function() {
    spyOn(convertRow, "convertRow").and.returnValue({
      assets: ["asset 1", "asset 2"],
      cards: []
    });

    spyOn(extractAssets, "extractAssets").and.returnValue([
      "asset 3",
      "asset 4"
    ]);

    const section = {
      style: {
        background: {
          fileSrc: "style.background.fileSrc value"
        }
      },
      rows: [
        {
          cards: [
            {
              component: {
                name: "image-card",
                settings: {
                  cropSrc: "image-card cropSrc value",
                  fileSrc: "image-card fileSrc value"
                }
              }
            },
            {
              component: {
                name: "event-list-card",
                settings: {
                  initiativeIds: ["original initiativeIds value"]
                }
              }
            }
          ]
        }
      ]
    };

    expect(convertSection(section)).toEqual({
      section: {
        style: {
          background: {
            fileSrc: "style.background.fileSrc value"
          }
        },
        rows: [
          {
            cards: [
              /* TODO: there probably should be something here since the rows are cloned */
            ]
          }
        ]
      },
      assets: ["asset 1", "asset 2", "asset 3", "asset 4"]
    });
  });
});
