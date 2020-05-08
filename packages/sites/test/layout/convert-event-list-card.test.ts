import { convertEventListCard } from "../../src/layout";

describe("convertEventListCard", function() {
  it("card.component.settings.initiativeIds should be overwritten by templatized array", function () {
    const card = {
      component: {
        name: 'card name',
        settings: {
          initiativeIds: ['original initiativeIds value']
        }
      }
    }

    expect(convertEventListCard(card)).toEqual({
      card: {
        component: {
          name: 'card name',
          settings: {
            initiativeIds: ['{{initiative.item.id}}']
          }
        }
      },
      assets: []
    });
  });

});
