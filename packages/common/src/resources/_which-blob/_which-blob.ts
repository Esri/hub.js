import * as FetchBlob from "fetch-blob";
import { isNode } from "./_is-node";
export const Blob = isNode ? FetchBlob : window.Blob;
