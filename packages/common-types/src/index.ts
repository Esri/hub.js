/* Copyright (c) 2018 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */

import { IItem } from "@esri/arcgis-rest-common-types";

/**
 * One small step for Hub, one large leap for hubkind
 */
export interface IInitiative {
  item?: IInitiativeItem;
  data?: IInitiativeData;
}

export interface IInitiativeItem extends IItem {
  type: "Hub Initiative";
}

export interface IInitiativeData {
  assets: [any];
  source: string;
  values: {
    collaborationGroupId: string;
    openDataGroupId: string;
    followerGroups: any;
    steps: [string];
    bannerImage: any;
    website: IHaveNoIdeaWhatToCallThis;
    informTools: IHaveNoIdeaWhatToCallThis;
    listenTools: IHaveNoIdeaWhatToCallThis;
    monitorTools: IHaveNoIdeaWhatToCallThis;
    initiativeKey: string;
  };
}

export interface IHaveNoIdeaWhatToCallThis {
  title: string;
  description: string;
  id: string;
  templates: any;
  templateItemIds: any;
  configuredItemIds: [string];
  items: any;
}
