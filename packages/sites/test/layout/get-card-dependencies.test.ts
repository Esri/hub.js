import { getCardDependencies } from "../../src/layout";

describe("extractAssets", function() {
  it("webmap-card: scalar component.settings.webmap value should return it as an array", function() {
    const card = {
      component: {
        name: "webmap-card",
        settings: {
          webmap: "component.settings.webmap value"
        }
      }
    };

    expect(getCardDependencies(card)).toEqual([
      "component.settings.webmap value"
    ]);
  });

  it("webmap-card: array component.settings.webmap value should return all", function() {
    const card = {
      component: {
        name: "webmap-card",
        settings: {
          webmap: [
            "component.settings.webmap value 1",
            "component.settings.webmap value 2"
          ]
        }
      }
    };

    expect(getCardDependencies(card)).toEqual([
      "component.settings.webmap value 1",
      "component.settings.webmap value 2"
    ]);
  });

  it("survey-card: should get survey id", function() {
    const card = {
      component: {
        name: "survey-card",
        settings: {
          surveyId: "the-survey-id"
        }
      }
    };

    expect(getCardDependencies(card)).toEqual(["the-survey-id"]);
  });

  it("app-card: should get app id", function() {
    const card = {
      component: {
        name: "app-card",
        settings: {
          itemId: "the-app-id"
        }
      }
    };

    expect(getCardDependencies(card)).toEqual(["the-app-id"]);
  });

  it("items/gallery-card: scalar component.settings.ids value should return it as an array", function() {
    const card = {
      component: {
        name: "items/gallery-card",
        settings: {
          ids: "component.settings.ids value"
        }
      }
    };

    expect(getCardDependencies(card)).toEqual(["component.settings.ids value"]);
  });

  it("webmap-card: no values at component.settings.webmap should return empty array", function() {
    const card = {
      component: {
        name: "webmap-card",
        settings: {}
      }
    };

    expect(getCardDependencies(card)).toEqual([]);
  });

  it("items/gallery-card: array component.settings.ids value should return all", function() {
    const card = {
      component: {
        name: "items/gallery-card",
        settings: {
          ids: [
            "component.settings.ids value 1",
            "component.settings.ids value 2"
          ]
        }
      }
    };

    expect(getCardDependencies(card)).toEqual([
      "component.settings.ids value 1",
      "component.settings.ids value 2"
    ]);
  });

  it("items/gallery-card: no values at component.settings.ids should return empty array", function() {
    const card = {
      component: {
        name: "items/gallery-card",
        settings: {}
      }
    };

    expect(getCardDependencies(card)).toEqual([]);
  });

  it("unsupported card name should return empty array", function() {
    const card = {
      component: {
        name: "unsupported card name",
        settings: {
          ids: [
            "component.settings.ids value 1",
            "component.settings.ids value 2"
          ],
          webmap: [
            "component.settings.webmap value 1",
            "component.settings.webmap value 2"
          ]
        }
      }
    };

    expect(getCardDependencies(card)).toEqual([]);
  });
});
