import { IHubInitiative } from "./IHubInitiative";
import { IHubPage } from "./IHubPage";
import { IHubProject } from "./IHubProject";
import { IHubSite } from "./IHubSite";
import { IHubDiscussion } from "./IHubDiscussion";
import { IHubGroup } from "./IHubGroup";
import { IHubTemplate } from "./IHubTemplate";
import { IHubSurvey } from "./IHubSurvey";

export type HubEntity =
  | IHubSite
  | IHubProject
  | IHubDiscussion
  | IHubInitiative
  | IHubPage
  | IHubGroup
  | IHubTemplate
  | IHubSurvey;
