import * as FetchBlob from "fetch-blob";
import { isNode } from "./_is-node";
/* istanbul ignore next (can't fake environments)*/
export const Blob = isNode ? FetchBlob : window.Blob;
