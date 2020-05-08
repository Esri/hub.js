import { convertSection } from "../../src/layout";

import * as convertRow from "../../src/layout/convert-row";
import * as extractAssets from "../../src/layout/extract-assets";

describe("convertSection", function() {
  it("section with empty rows should return cloned section and empty assets", function () {
    const section = {
      rows: []
    }

    expect(convertSection(section)).toEqual({
      section: {
        rows: []
      },
      assets: []
    })
  })

  it("all rows should be converted and assets extracted", function () {
    spyOn(
      convertRow,
      "convertRow"
    ).and.returnValue({
      assets: ["asset 1", "asset 2"],
      cards: []
    });

    spyOn(
      extractAssets,
      "extractAssets"
    ).and.returnValue(["asset 3", "asset 4"]);

    const section = {
      style: {
        background: {
          fileSrc: 'style.background.fileSrc value'
        }
      },
      rows: ['row 1', 'row 2']
    };

    expect(convertSection(section)).toEqual({
      section: {
        rows: ['row 1', 'row 2']
      },
      assets: ["asset 1", "asset 2", "asset 3", "asset 4"]
    })
  })
})