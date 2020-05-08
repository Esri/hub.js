import { convertEventListCard } from "../../src/layout";

describe("convertEventListCard", function() {
  it("card.component.settings.initiativeIds should be overwritten by templatized array", function () {
    const card = {
      component: {
        settings: {
          initiativeIds: 'original initiativeIds value'
        }
      }
    }

    expect(convertEventListCard(card)).toEqual({
      card: {
        component: {
          settings: {
            initiativeIds: ['{{initiative.item.id}}']
          }
        }
      },
      assets: []
    });
  });

});
