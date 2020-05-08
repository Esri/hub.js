import { convertRow } from "../../src/layout";

describe("convertRow", function() {
  it("empty row.cards should return an object with empty assets and cards", function () {
    const row = {
      cards: []
    }

    expect(convertRow(row)).toEqual([]);
  });

  it("assets and cards should be collected from converted row.cards", function () {
    const row = {
      cards: [
        {
          component: {
            name: 'image-card',
            settings: {
              cropSrc: 'image-card cropSrc value',
              fileSrc: 'image-card fileSrc value'
            }
          }    
        },
        {
          component: {
            name: 'event-list-card',
            settings: {
              initiativeIds: 'original initiativeIds value'
            }
          }
        },
        {
          component: {
            name: 'jumbotron-card',
            settings: {
              cropSrc: 'jumbotron-card cropSrc value',
              fileSrc: 'jumbotron-card fileSrc value'
            }
          }
        }
      ]
    }

    expect(convertRow(row)).toEqual({
      assets: [
        'image-card cropSrc value',
        'image-card fileSrc value',
        'jumbotron-card cropSrc value',
        'jumbotron-card fileSrc value'
      ],
      cards: [
        {
          component: {
            name: 'image-card',
            settings: {
              cropSrc: 'image-card cropSrc value',
              fileSrc: 'image-card fileSrc value'
            }
          }    
        },
        {
          component: {
            name: 'event-list-card',
            settings: {
              initiativeIds: 'original initiativeIds value'
            }
          }
        },
        {
          component: {
            name: 'jumbotron-card',
            settings: {
              cropSrc: 'jumbotron-card cropSrc value',
              fileSrc: 'jumbotron-card fileSrc value'
            }
          }
        }
      ]
    })
  })
});