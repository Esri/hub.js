import { _getImageCropIdsFromLayout } from "../../src/layout";

describe("_getImageCropIdsFromLayout", function() {
  it("empty layout should return empty array", function () {
    const layout = {}

    expect(_getImageCropIdsFromLayout(layout)).toEqual([])
  });

  it("cropIds should be extracted from header logo and all sections/rows/cards for image- and jumbotron-cards", function () {
    const layout = {
      header: {
        component: {
          settings: {
            logo: {
              cropId: "header cropId"
            }
          }
        }
      },
      sections: [
        {
          style: {
            background: {
              cropSrc: "section 1 background style cropSrc",
              cropId: "section 1 background style cropId"
            }
          },
          rows: [
            {
              cards: [
                {
                  component: {
                    name: "image-card",
                    settings: {
                      cropId: "section 1 row 1 card 1 image-card cropId"
                    }
                  }
                },
                {
                  component: {
                    name: "image-card",
                    settings: {
                      cropId: "section 1 row 1 card 2 image-card cropId"
                    }
                  }
                },
                {
                  component: {
                    name: "jumbotron-card",
                    settings: {
                      cropId: "section 1 row 1 card 3 jumbotron-card cropId"
                    }
                  }
                }
              ]
            },
            {
              cards: [
                {
                  component: {
                    name: "image-card",
                    settings: {
                      cropId: "section 1 row 2 card 1 image-card cropId"
                    }
                  }
                },
                {
                  component: {
                    name: "jumbotron-card",
                    settings: {
                      cropId: "section 1 row 2 card 2 jumbotron-card cropId"
                    }
                  }
                }
              ]
            }
          ]
        },
        {
          style: {
            background: {
              cropSrc: "section 2 background style cropSrc",
              cropId: "section 2 background style cropId"
            }
          },
          rows: [
            {
              cards: [
                {
                  component: {
                    name: "image-card",
                    settings: {
                      cropId: "section 2 row 1 card 1 image-card cropId"
                    }
                  }
                }
              ]
            },
            {
              cards: [
                {
                  component: {
                    name: "image-card",
                    settings: {
                      cropId: "section 2 row 2 card 1 image-card cropId"
                    }
                  }
                }
              ]
            }
          ]
        }
      ]
    }

    expect(_getImageCropIdsFromLayout(layout)).toEqual([
      "header cropId",
      "section 1 background style cropId",
      "section 1 row 1 card 1 image-card cropId",
      "section 1 row 1 card 2 image-card cropId",
      "section 1 row 1 card 3 jumbotron-card cropId",
      "section 1 row 2 card 1 image-card cropId",
      "section 1 row 2 card 2 jumbotron-card cropId",
      "section 2 background style cropId",
      "section 2 row 1 card 1 image-card cropId",
      "section 2 row 2 card 1 image-card cropId"
    ])
  });

  it("cropIds from non-image/jumbotron cards should be ignored", function () {
    const layout = {
      header: {
        component: {
          settings: {
            logo: {
              cropId: "header cropId"
            }
          }
        }
      },
      sections: [
        {
          style: {
            background: {
              cropSrc: "section 1 background style cropSrc",
              cropId: "section 1 background style cropId"
            }
          },
          rows: [
            {
              cards: [
                {
                  component: {
                    name: "image-card",
                    settings: {
                      cropId: "section 1 row 1 card 1 image-card cropId"
                    }
                  }
                },
                {
                  component: {
                    name: "unsupported card type",
                    settings: {
                      cropId: "unsupported card type cropId"
                    }
                  }
                },
                {
                  component: {
                    name: "jumbotron-card",
                    settings: {
                      cropId: "section 1 row 1 card 3 jumbotron-card cropId"
                    }
                  }
                }
              ]
            }
          ]
        }
      ]
    }

    expect(_getImageCropIdsFromLayout(layout)).toEqual([
      "header cropId",
      "section 1 background style cropId",
      "section 1 row 1 card 1 image-card cropId",
      "section 1 row 1 card 3 jumbotron-card cropId"
    ])
  });

  it("layout w/o header should not return a cropId for it", function () {
    const layout = {
      sections: [
        {
          style: {
            background: {
              cropSrc: "section 1 background style cropSrc",
              cropId: "section 1 background style cropId"
            }
          },
          rows: [
            {
              cards: [
                {
                  component: {
                    name: "image-card",
                    settings: {
                      cropId: "section 1 row 1 card 1 image-card cropId"
                    }
                  }
                }
              ]
            }
          ]
        }
      ]
    }

    expect(_getImageCropIdsFromLayout(layout)).toEqual([
      "section 1 background style cropId",
      "section 1 row 1 card 1 image-card cropId"
    ])
  });

  it("layout.header w/o cropId should not return a cropId for it", function () { 
    const layout = {
      header: {
        component: {
          settings: {
            logo: {}
          }
        }
      },
      sections: [
        {
          style: {
            background: {
              cropSrc: "section 1 background style cropSrc",
              cropId: "section 1 background style cropId"
            }
          },
          rows: [
            {
              cards: [
                {
                  component: {
                    name: "image-card",
                    settings: {
                      cropId: "section 1 row 1 card 1 image-card cropId"
                    }
                  }
                }
              ]
            }
          ]
        }
      ]
    }

    expect(_getImageCropIdsFromLayout(layout)).toEqual([
      "section 1 background style cropId",
      "section 1 row 1 card 1 image-card cropId"
    ])
  });

  it("layout w/o sections should not output any cropIds", function () {
    const layout = {
      header: {
        component: {
          settings: {
            logo: {
              cropId: "header cropId"
            }
          }
        }
      }
    }

    expect(_getImageCropIdsFromLayout(layout)).toEqual([
      "header cropId"
    ])
  });

  it("section w/o style.background.cropSrc should not return a cropId for it", function () {
    const layout = {
      header: {
        component: {
          settings: {
            logo: {
              cropId: "header cropId"
            }
          }
        }
      },
      sections: [
        {
          style: {
            background: {
            }
          },
          rows: [
            {
              cards: [
                {
                  component: {
                    name: "image-card",
                    settings: {
                      cropId: "section 1 row 1 card 1 image-card cropId"
                    }
                  }
                }
              ]
            }
          ]
        }
      ]
    }

    expect(_getImageCropIdsFromLayout(layout)).toEqual([
      "header cropId",
      "section 1 row 1 card 1 image-card cropId"
    ]);
  })

  it("cropIds should be extracted from header logo and all sections/rows/cards for image- and jumbotron-cards", function () {
    const layout = {
      sections: [
        {
          style: {
            background: {
              cropSrc: "section 1 background style cropSrc"
            }
          },
          rows: [
            {
              cards: [
                {
                  component: {
                    name: "image-card",
                    settings: {}
                  }
                },
                {
                  component: {
                    name: "jumbotron-card",
                    settings: {}
                  }
                }
              ]
            }
          ]
        }
      ]
    }

    expect(_getImageCropIdsFromLayout(layout)).toEqual([])
  });
});
