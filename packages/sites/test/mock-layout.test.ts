export const testLayout = {
  sections: [
    {
      rows: [
        {
          cards: [
            {
              component: {
                name: "chart-card",
                settings: {
                  itemId: "cc1"
                }
              }
            },
            {
              component: {
                name: "summary-statistic-card",
                settings: {
                  itemId: "cc2"
                }
              }
            }
          ]
        }
      ]
    },
    {
      rows: [
        {
          cards: [
            {
              component: {
                name: "webmap-card",
                settings: {
                  webmap: "cc3"
                }
              }
            },
            {
              component: {
                name: "items/gallery-card",
                settings: {
                  ids: [
                    "0ee0b0a435db49969bbd93a7064a321c",
                    "eb173fb9d0084c4bbd19b40ee186965f",
                    "e8201f104dca4d8d87cb4ce1c7367257",
                    "5a14dbb7b2f3417fb4a6ea0506c2eb26"
                  ]
                }
              }
            }
          ]
        }
      ]
    }
  ]
};
