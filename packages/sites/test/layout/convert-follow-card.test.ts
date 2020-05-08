import { convertFollowCard } from "../../src/layout";

describe("convertFollowCard", function() {
  it("card.component.settings.initiativeId should be overwritten by templatized string", function () {
    const card = {
      component: {
        name: 'card name',
        settings: {
          initiativeId: 'original initiativeIds value'
        }
      }
    }

    expect(convertFollowCard(card)).toEqual({
      card: {
        component: {
          name: 'card name',
          settings: {
            initiativeId: '{{initiative.item.id}}'
          }
        }
      },
      assets: []
    });
  });
});
