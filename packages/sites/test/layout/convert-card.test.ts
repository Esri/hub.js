import { convertCard } from "../../src/layout";

describe("convertCard", function() {
  it("event-list-card: card should be cloned with clone.component.settings.initiativeIds overwritten by templatized array", function () {
    const card = {
      component: {
        name: 'event-list-card',
        settings: {
          initiativeIds: ['original initiativeIds value']
        }
      }
    }

    expect(convertCard(card)).toEqual({
      card: {
        component: {
          name: 'event-list-card',
          settings: {
            initiativeIds: ['{{initiative.item.id}}']
          }
        }
      },
      assets: []
    });

    expect(card).toEqual({
      component: {
        name: 'event-list-card',
        settings: {
          initiativeIds: ['original initiativeIds value']
        }
      }
    })
  });

  it("follow-initiative-card: card should be cloned with clone.component.settings.initiativeIds overwritten by templatized array", function () {
    const card = {
      component: {
        name: 'follow-initiative-card',
        settings: {
          initiativeId: 'original initiativeId value'
        }
      }
    }

    expect(convertCard(card)).toEqual({
      card: {
        component: {
          name: 'follow-initiative-card',
          settings: {
            initiativeId: '{{initiative.item.id}}'
          }
        }
      },
      assets: []
    });

    expect(card).toEqual({
      component: {
        name: 'follow-initiative-card',
        settings: {
          initiativeId: 'original initiativeId value'
        }
      }
    })

  });

  it("items/gallery-card: card should be cloned with clone.component.settings.initiativeIds overwritten by templatized array", function () {
    const card = {
      component: {
        name: 'items/gallery-card',
        settings: {
          version: 3,
          groups: [
            { 
              id: 'id value', 
              title: 'title value' 
            }
          ]
        }
      }
    }

    expect(convertCard(card)).toEqual({
      card: {
        component: {
          name: 'items/gallery-card',
          settings: {
            version: 3,
            groups: [
              {
                title: '{{solution.title}}',
                id: '{{teams.collaborationGroupId}}'
              },
              {
                title: '{{solution.title}}',
                id: '{{teams.contentGroupId}}'
              }        
            ]
          }
        }
      },
      assets: []
    });

    expect(card).toEqual({
      component: {
        name: 'items/gallery-card',
        settings: {
          version: 3,
          groups: [
            { 
              id: 'id value', 
              title: 'title value' 
            }
          ]
        }
      }
    });
  });

  it("image-card: component.settings with both fileSrc and cropSrc should return both values in assets", function () {
    const card = {
      component: {
        name: 'image-card',
        settings: {
          cropSrc: 'cropSrc value',
          fileSrc: 'fileSrc value'
        }
      }
    }

    expect(convertCard (card)).toEqual({
      card: {
        component: {
          name: 'image-card',
          settings: {
            cropSrc: 'cropSrc value',
            fileSrc: 'fileSrc value'
          }
        }
      },
      assets: ['fileSrc value', 'cropSrc value']
    });

    expect(card).toEqual({
      component: {
        name: 'image-card',
        settings: {
          cropSrc: 'cropSrc value',
          fileSrc: 'fileSrc value'
        }
      }
    })
  });

  it("jumbotron-card: card should be cloned with clone.component.settings.initiativeIds overwritten by templatized array", function () {
    const card = {
      component: {
        name: 'jumbotron-card',
        settings: {
          cropSrc: 'cropSrc value',
          fileSrc: 'fileSrc value'
        }
      }
    }

    expect(convertCard (card)).toEqual({
      card: {
        component: {
          name: 'jumbotron-card',
          settings: {
            cropSrc: 'cropSrc value',
            fileSrc: 'fileSrc value'
          }
        }
      },
      assets: ['fileSrc value', 'cropSrc value']
    });

    expect(card).toEqual({
      component: {
        name: 'jumbotron-card',
        settings: {
          cropSrc: 'cropSrc value',
          fileSrc: 'fileSrc value'
        }
      }
    });
  });

  it("unknown card name: should return cloned card and empty assets", function () {
    const card = {
      component: {
        name: 'unknown-card-name',
        settings: {
          initiativeIds: ['original initiativeIds value']
        }
      }
    }

    expect(convertCard(card)).toEqual({
      card: {
        component: {
          name: 'unknown-card-name',
          settings: {
            initiativeIds: ['original initiativeIds value']
          }
        }
      },
      assets: []
    });

    expect(card).toEqual({
      component: {
        name: 'unknown-card-name',
        settings: {
          initiativeIds: ['original initiativeIds value']
        }
      }
    });
  });
});
