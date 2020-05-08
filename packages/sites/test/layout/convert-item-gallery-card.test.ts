import { convertFollowCard } from "../../src/layout";

describe("convertFollowCard", function() {
  it("empty card should return empty assets and nothing added to settings", function () {
    const card = {
      component: {
        settings: {}
      }
    }

    expect(convertFollowCard(card)).toEqual({
      card: {},
      assets: []
    });
  });

  it("settings with groups property AND version < 4 should replace settings.groups with string template array", function () {
    const card = {
      component: {
        settings: {
          version: 3,
          groups: 'original settings.groups value'
        }
      }
    }

    expect(convertFollowCard(card)).toEqual({
      card: {
        component: {
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
        settings: {
          version: 4,
          groups: 'original settings.groups value'
        }
      }
    }

    expect(convertFollowCard(card)).toEqual({
      card: {
        component: {
          settings: {
            version: 4,
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

  it("settings without groups property should NOT add settings.groups", function () {
    const card = {
      component: {
        settings: {
          version: 3
        }
      }
    }

    expect(convertFollowCard(card)).toEqual({
      card: {
        component: {
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
        settings: {
          version: 4,
          query: {
            groups: 'original settings.groups value'
          }
        }
      }
    }

    expect(convertFollowCard(card)).toEqual({
      card: {
        component: {
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
        settings: {
          version: 3,
          query: {
            groups: 'original settings.groups value'
          }
        }
      }
    }

    expect(convertFollowCard(card)).toEqual({
      card: {
        component: {
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
        settings: {
          version: 4,
          query: {}
        }
      }
    }

    expect(convertFollowCard(card)).toEqual({
      card: {
        component: {
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
        settings: {
          query: {
            orgId: 'query.orgId value'
          }
        }
      }
    }

    expect(convertFollowCard(card)).toEqual({
      card: {
        component: {
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
        settings: {
          orgId: 'query.orgId value'
        }
      }
    }

    expect(convertFollowCard(card)).toEqual({
      card: {
        component: {
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
        settings: {
          siteId: 'siteId value'
        }
      }
    }

    expect(convertFollowCard(card)).toEqual({
      card: {
        component: {
          settings: {
            siteId: '{{appid}}'
          }
        }
      },
      assets: []
    });
  });
});
