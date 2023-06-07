import { IHubInitiative } from "./IHubInitiative";
import { IHubPage } from "./IHubPage";
import { IHubProject } from "./IHubProject";
import { IHubSite } from "./IHubSite";
import { IHubDiscussion } from "./IHubDiscussion";

export type HubEntity =
  | IHubSite
  | IHubProject
  | IHubDiscussion
  | IHubInitiative
  | IHubPage;
