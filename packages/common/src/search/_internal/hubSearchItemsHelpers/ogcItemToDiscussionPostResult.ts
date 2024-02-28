import { IOgcItem } from "./interfaces";
import { IPost } from "../../../discussions";

export async function ogcItemToDiscussionPostResult(
  ogcItem: IOgcItem
): Promise<IPost> {
  return ogcItem.properties as IPost;
}
