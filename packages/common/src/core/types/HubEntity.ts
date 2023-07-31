import { IHubInitiative } from "./IHubInitiative";
import { IHubPage } from "./IHubPage";
import { IHubProject } from "./IHubProject";
import { IHubSite } from "./IHubSite";
import { IHubDiscussion } from "./IHubDiscussion";
import { IHubGroup } from "./IHubGroup";

export type HubEntity =
  | IHubSite
  | IHubProject
  | IHubDiscussion
  | IHubInitiative
  | IHubPage;
// TODO: leave IHubGroup commented out for now
// so the package can build w/o throwing.
// uncomment when changes are made to the getLocationExtent
// and getFeaturedImageUrl fns
// | IHubGroup;
