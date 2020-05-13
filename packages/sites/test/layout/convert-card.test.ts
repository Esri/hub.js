import { convertCard } from "../../src/layout";

describe("convertCard", function() {
  describe("event-list-card", function () {
    it("card.component.settings.initiativeIds should be overwritten by templatized array", function () {
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
    });
  });

  describe("follow-initiative-card", function () {
    it("card.component.settings.initiativeId should be overwritten by templatized string", function () {
      const card = {
        component: {
          name: 'follow-initiative-card',
          settings: {
            initiativeId: 'original initiativeIds value'
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
    });  
  })

  describe("items/gallery-card", function () {
    it("empty card should return empty assets and nothing added to settings", function () {
      const card = {
        component: {
          name: 'items/gallery-card',
          settings: {}
        }
      }
  
      expect(convertCard(card)).toEqual({
        card: {
          component: {
            name: 'items/gallery-card',
            settings: {}
          }  
        },
        assets: []
      });
    });
  
    it("settings with groups property AND version < 4 should replace settings.groups with string template array", function () {
      const card = {
        component: {
          name: 'items/gallery-card',
          settings: {
            version: 3,
            groups: [
              {
                id: 'group id value',
                title: 'group title value'
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
    });
  
    it("settings with groups property AND version >= 4 should NOT replace settings.groups with anything", function () {
      const card = {
        component: {
          name: 'items/gallery-card',
          settings: {
            version: 4,
            groups: [
              {
                id: 'group id value',
                title: 'group title value'
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
              version: 4,
              groups: [
                {
                  id: 'group id value',
                  title: 'group title value'
                }
              ]
            }
          }
        },
        assets: []
      });
    });
  
    it("settings without groups property should NOT add settings.groups", function () {
      const card = {
        component: {
          name: 'items/gallery-card',
          settings: {
            version: 3
          }
        }
      }
  
      expect(convertCard(card)).toEqual({
        card: {
          component: {
            name: 'items/gallery-card',
            settings: {
              version: 3
            }
          }
        },
        assets: []
      });
  
    });
  
    it("settings with query.groups property AND version >= 4 should replace settings.query.groups with string template array", function () {
      const card = {
        component: {
          name: 'items/gallery-card',
          settings: {
            version: 4,
            query: {
              groups: [
                {
                  id: 'group id value',
                  title: 'group title value'
                }
              ]
            }
          }
        }
      }
  
      expect(convertCard(card)).toEqual({
        card: {
          component: {
            name: 'items/gallery-card',
            settings: {
              version: 4,
              query: {
                groups: [
                  '{{teams.collaborationGroupId}}',
                  '{{teams.contentGroupId}}'
                ]
              }
            }
          }
        },
        assets: []
      });
    });
  
    it("settings with query.groups property AND version < 4 should replace settings.query.groups with object template array", function () {
      const card = {
        component: {
          name: 'items/gallery-card',
          settings: {
            version: 3,
            query: {
              groups: [
                {
                  id: 'group id value',
                  title: 'group title value'
                }
              ]
            }
          }
        }
      }
  
      expect(convertCard(card)).toEqual({
        card: {
          component: {
            name: 'items/gallery-card',
            settings: {
              version: 3,
              query: {
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
          }
        },
        assets: []
      });
    });
  
    it("settings without query.groups property should not add settings.query.groups property", function () {
      const card = {
        component: {
          name: 'items/gallery-card',
          settings: {
            version: 4,
            query: {}
          }
        }
      }
  
      expect(convertCard(card)).toEqual({
        card: {
          component: {
            name: 'items/gallery-card',
            settings: {
              version: 4,
              query: {}
            }
          }
        },
        assets: []
      });
    });
  
    it("settings with query.orgId property should replace settings.query.orgId with a string template", function () {
      const card = {
        component: {
          name: 'items/gallery-card',
          settings: {
            query: {
              orgId: 'query.orgId value'
            }
          }
        }
      }
  
      expect(convertCard(card)).toEqual({
        card: {
          component: {
            name: 'items/gallery-card',
            settings: {
              query: {
                orgId: '{{organization.id}}'
              }
            }
          }
        },
        assets: []
      });
    });
  
    it("settings with orgId property should replace settings.orgId with a string template", function () {
      const card = {
        component: {
          name: 'items/gallery-card',
          settings: {
            orgId: 'query.orgId value'
          }
        }
      }
  
      expect(convertCard(card)).toEqual({
        card: {
          component: {
            name: 'items/gallery-card',
            settings: {
              orgId: '{{organization.id}}'
            }
          }
        },
        assets: []
      });
    });
  
    it("settings with siteId property should replace settings.siteId with a string template", function () {
      const card = {
        component: {
          name: 'items/gallery-card',
          settings: {
            siteId: 'siteId value'
          }
        }
      }
  
      expect(convertCard(card)).toEqual({
        card: {
          component: {
            name: 'items/gallery-card',
            settings: {
              siteId: '{{appid}}'
            }
          }
        },
        assets: []
      });
    });  
  })

  describe("image-card", function () {
    it("component.settings with neither fileSrc nor cropSrc should return assets as an empty array", function () {
      const card = {
        component: {
          name: 'image-card',
          settings: {}
        }
      }
  
      expect(convertCard (card)).toEqual({
        card: {
          component: {
            name: 'image-card',
            settings: {}
          }
        },
        assets: []
      });
    });
  
    it("component.settings with only fileSrc should return its value in assets", function () {
      const card = {
        component: {
          name: 'image-card',
          settings: {
            fileSrc: 'fileSrc value'
          }
        }
      }
  
      expect(convertCard (card)).toEqual({
        card: {
          component: {
            name: 'image-card',
            settings: {
              fileSrc: 'fileSrc value'
            }
          }
        },
        assets: ['fileSrc value']
      });
    });
  
    it("component.settings with only cropSrc should return its value in assets", function () {
      const card = {
        component: {
          name: 'image-card',
          settings: {
            cropSrc: 'cropSrc value'
          }
        }
      }
  
      expect(convertCard(card)).toEqual({
        card: {
          component: {
            name: 'image-card',
            settings: {
              cropSrc: 'cropSrc value'
            }
          }
        },
        assets: ['cropSrc value']
      });
    });
  
    it("component.settings with both fileSrc and cropSrc should return both values in assets", function () {
      const card = {
        component: {
          name: 'image-card',
          settings: {
            cropSrc: 'cropSrc value',
            fileSrc: 'fileSrc value'
          }
        }
      }
  
      expect(convertCard(card)).toEqual({
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
    });  
  })

  describe("jumbotron-card", function () {
    it("component.settings with neither fileSrc nor cropSrc should return assets as an empty array", function () {
      const card = {
        component: {
          name: 'jumbotron-card',
          settings: {}
        }
      }
  
      expect(convertCard (card)).toEqual({
        card: {
          component: {
            name: 'jumbotron-card',
            settings: {}
          }
        },
        assets: []
      });
    });
  
    it("component.settings with only fileSrc should return its value in assets", function () {
      const card = {
        component: {
          name: 'jumbotron-card',
          settings: {
            fileSrc: 'fileSrc value'
          }
        }
      }
  
      expect(convertCard (card)).toEqual({
        card: {
          component: {
            name: 'jumbotron-card',
            settings: {
              fileSrc: 'fileSrc value'
            }
          }
        },
        assets: ['fileSrc value']
      });
    });
  
    it("component.settings with only cropSrc should return its value in assets", function () {
      const card = {
        component: {
          name: 'jumbotron-card',
          settings: {
            cropSrc: 'cropSrc value'
          }
        }
      }
  
      expect(convertCard (card)).toEqual({
        card: {
          component: {
            name: 'jumbotron-card',
            settings: {
              cropSrc: 'cropSrc value'
            }
          }
        },
        assets: ['cropSrc value']
      });
    });
  
    it("component.settings with both fileSrc and cropSrc should return both values in assets", function () {
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
