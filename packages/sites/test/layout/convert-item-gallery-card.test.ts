import { convertItemGalleryCard } from "../../src/layout";

describe("convertItemGalleryCard", function() {
  it("empty card should return empty assets and nothing added to settings", function () {
    const card = {
      component: {
        name: 'card name',
        settings: {}
      }
    }

    expect(convertItemGalleryCard(card)).toEqual({
      card: {
        component: {
          name: 'card name',
          settings: {}
        }  
      },
      assets: []
    });
  });

  it("settings with groups property AND version < 4 should replace settings.groups with string template array", function () {
    const card = {
      component: {
        name: 'card name',
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

    expect(convertItemGalleryCard(card)).toEqual({
      card: {
        component: {
          name: 'card name',
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
        name: 'card name',
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

    expect(convertItemGalleryCard(card)).toEqual({
      card: {
        component: {
          name: 'card name',
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
        name: 'card name',
        settings: {
          version: 3
        }
      }
    }

    expect(convertItemGalleryCard(card)).toEqual({
      card: {
        component: {
          name: 'card name',
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
        name: 'card name',
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

    expect(convertItemGalleryCard(card)).toEqual({
      card: {
        component: {
          name: 'card name',
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
        name: 'card name',
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

    expect(convertItemGalleryCard(card)).toEqual({
      card: {
        component: {
          name: 'card name',
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
        name: 'card name',
        settings: {
          version: 4,
          query: {}
        }
      }
    }

    expect(convertItemGalleryCard(card)).toEqual({
      card: {
        component: {
          name: 'card name',
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
        name: 'card name',
        settings: {
          query: {
            orgId: 'query.orgId value'
          }
        }
      }
    }

    expect(convertItemGalleryCard(card)).toEqual({
      card: {
        component: {
          name: 'card name',
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
        name: 'card name',
        settings: {
          orgId: 'query.orgId value'
        }
      }
    }

    expect(convertItemGalleryCard(card)).toEqual({
      card: {
        component: {
          name: 'card name',
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
        name: 'card name',
        settings: {
          siteId: 'siteId value'
        }
      }
    }

    expect(convertItemGalleryCard(card)).toEqual({
      card: {
        component: {
          name: 'card name',
          settings: {
            siteId: '{{appid}}'
          }
        }
      },
      assets: []
    });
  });
});
