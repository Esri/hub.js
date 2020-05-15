import { convertLayoutToTemplate } from "../../src/layout";

import * as convertSection from "../../src/layout/convert-section";
import { ISection, IRow } from "../../src/layout/types";

describe('convert-layout-to-template', function () {
  it('falsey layout should return same value', function () {
    expect(convertLayoutToTemplate(null)).toEqual(null)
  });

  it('all sections should be converted with header and footer when available', function () {
    const layout = {
      header: 'header value',
      footer: 'footer value',
      sections: [
        { rows: [] as IRow[] },
        { rows: [] as IRow[] }
      ]
    }

    spyOn(
      convertSection,
      "convertSection"
    ).and.returnValues(
      {
        assets: ['asset 1', 'asset 2'],
        section: { rows: [] }
      },
      {
        assets: ['asset 3', 'asset 4'],
        section: { rows: [] }
      }
    );

    const templatizedLayout = convertLayoutToTemplate(layout)

    expect(templatizedLayout).toEqual({
      assets: ['asset 1', 'asset 2', 'asset 3', 'asset 4'],
      layout: {
        header: 'header value',
        footer: 'footer value',
        sections: [
          { rows: [] },
          { rows: [] }
        ]        
      }
    })
  });

  it('all sections should be converted with header and footer when available', function () {
    const layout = {
      sections: [
        { rows: [] as IRow[] }
      ]
    }

    spyOn(
      convertSection,
      "convertSection"
    ).and.returnValues(
      {
        assets: ['asset 1', 'asset 2'],
        section: { rows: [] }
      }
    );

    const templatizedLayout = convertLayoutToTemplate(layout)

    expect(templatizedLayout).toEqual({
      assets: ['asset 1', 'asset 2'],
      layout: {
        sections: [
          { rows: [] }
        ]        
      }
    })
  })

  it('0 sections should be converted to layout with 0 sections', function () {
    const layout = {
      sections: [] as ISection[]
    }

    spyOn(
      convertSection,
      "convertSection"
    ).and.returnValues();

    const templatizedLayout = convertLayoutToTemplate(layout)

    expect(templatizedLayout).toEqual({
      assets: [],
      layout: {
        sections: []        
      }
    })
  })

})