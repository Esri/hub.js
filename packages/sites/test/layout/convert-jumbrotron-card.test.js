import { convertJumbotronCard } from "../../src/layout";

describe("convertJumbotronCard", function() {
  it("component.settings with neither fileSrc nor cropSrc should return assets as an empty array", function () {
    const card = {
      component: {
        settings: {}
      }
    }

    expect(convertJumbotronCard (card)).toEqual({
      card: {
        component: {
          settings: {}
        }
      },
      assets: []
    });
  });

  it("component.settings with only fileSrc should return its value in assets", function () {
    const card = {
      component: {
        settings: {
          fileSrc: 'fileSrc value'
        }
      }
    }

    expect(convertJumbotronCard (card)).toEqual({
      card: {
        component: {
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
        settings: {
          cropSrc: 'cropSrc value'
        }
      }
    }

    expect(convertJumbotronCard (card)).toEqual({
      card: {
        component: {
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
        settings: {
          cropSrc: 'cropSrc value',
          fileSrc: 'fileSrc value'
        }
      }
    }

    expect(convertJumbotronCard (card)).toEqual({
      card: {
        component: {
          settings: {
            cropSrc: 'cropSrc value',
            fileSrc: 'fileSrc value'
          }
        }
      },
      assets: ['cropSrc value', 'fileSrc value']
    });
  });
});
