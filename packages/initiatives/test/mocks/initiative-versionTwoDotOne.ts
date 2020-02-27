/* Copyright (c) 2020 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */
import { IInitiativeModel, IInitiativeItem } from "@esri/hub-common";

export const initiativeVersionTwoDotOne: IInitiativeModel = {
  item: {
    properties: {
      schemaVersion: 2.1
    }
  } as IInitiativeItem,
  data: {
    recommendedTemplates: ["4ef", "1ef"],
    steps: [
      {
        templateIds: ["1ef", "2ef"]
      },
      {
        templateIds: ["3ef"]
      },
      {
        templateIds: []
      },
      {}
    ]
  }
};
