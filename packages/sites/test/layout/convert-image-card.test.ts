import { convertImageCard } from "../../src/layout";

describe("convertImageCard", function() {
  it("component.settings with neither fileSrc nor cropSrc should return assets as an empty array", function () {
    const card = {
      component: {
        name: 'card name',
        settings: {}
      }
    }

    expect(convertImageCard (card)).toEqual({
      card: {
        component: {
          name: 'card name',
          settings: {}
        }
      },
      assets: []
    });
  });

  it("component.settings with only fileSrc should return its value in assets", function () {
    const card = {
      component: {
        name: 'card name',
        settings: {
          fileSrc: 'fileSrc value'
        }
      }
    }

    expect(convertImageCard (card)).toEqual({
      card: {
        component: {
          name: 'card name',
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
        name: 'card name',
        settings: {
          cropSrc: 'cropSrc value'
        }
      }
    }

    expect(convertImageCard (card)).toEqual({
      card: {
        component: {
          name: 'card name',
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
        name: 'card name',
        settings: {
          cropSrc: 'cropSrc value',
          fileSrc: 'fileSrc value'
        }
      }
    }

    expect(convertImageCard (card)).toEqual({
      card: {
        component: {
          name: 'card name',
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
