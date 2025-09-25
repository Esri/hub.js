import { IPost } from "../../discussions/api/types";

/**
 * Hub-normalized representation of a Post entity.
 * Extend this interface as needed for Hub-specific properties.
 */
export interface IHubPost extends IPost {
  id: string;
}
