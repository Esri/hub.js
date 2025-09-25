import { IHubInitiative } from "./IHubInitiative";
import { IHubPage } from "./IHubPage";
import { IHubProject } from "./IHubProject";
import { IHubSite } from "./IHubSite";
import { IHubDiscussion } from "./IHubDiscussion";
import { IHubGroup } from "./IHubGroup";
import { IHubTemplate } from "./IHubTemplate";
import { IHubEvent } from "./IHubEvent";
import { IHubUser } from "./IHubUser";
import { IHubOrganization } from "./IHubOrganization";
import { IHubChannel } from "./IHubChannel";

export type HubEntity =
  | IHubChannel
  | IHubDiscussion
  | IHubEvent
  | IHubGroup
  | IHubInitiative
  | IHubOrganization
  | IHubPage
  // | IHubPost
  | IHubProject
  | IHubSite
  | IHubTemplate
  | IHubUser;
