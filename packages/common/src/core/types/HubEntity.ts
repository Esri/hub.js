import { IHubInitiative } from "./IHubInitiative";
import { IHubPage } from "./IHubPage";
import { IHubProject } from "./IHubProject";
import { IHubSite } from "./IHubSite";
import { IHubDiscussion } from "./IHubDiscussion";
import { IHubGroup } from "./IHubGroup";
import { IHubTemplate } from "./IHubTemplate";
import { IHubSurvey } from "./IHubSurvey";
import { IHubEvent } from "./IHubEvent";
import { IHubUser } from "./IHubUser";
import { IHubOrganization } from "./IHubOrganization";
import { IHubChannel } from "./IHubChannel";

export type HubEntity =
  | IHubDiscussion
  | IHubEvent
  | IHubGroup
  | IHubInitiative
  | IHubOrganization
  | IHubPage
  | IHubProject
  | IHubSite
  | IHubSurvey
  | IHubTemplate
  | IHubUser
  | IHubChannel;
