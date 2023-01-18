import { IUserRequestOptions } from "@esri/arcgis-rest-auth";
import { IBatch } from "../../types";

/**
 * Takes a file, file owner, and file AGO item id along with a size limit
 * Then chunks the file up based on that file limit.
 * The chunks are added to addItemPart calls and added to a queue array.
 *
 * @export
 * @param {*} file File to be uploaded
 * @param {string} owner file owner
 * @param {string} id file ID from AGO
 * @param {number} sizeLimit How large should the chunks be?
 * @param {IUserRequestOptions} requestOptions
 * @return {*}  {IBatch}
 */
export function _prepareUploadRequests(
  file: any,
  owner: string,
  id: string,
  sizeLimit: number,
  requestOptions: IUserRequestOptions
): IBatch {
  const queue = [];
  // part number starts from 1
  let partIndex = 1;
  let sizeIndex = 0;

  // Slice the file data and create an upload request for each part
  while (sizeIndex < file.size) {
    queue.push({
      file: file.slice(sizeIndex, sizeIndex + sizeLimit, file.type),
      owner,
      id,
      partNum: partIndex,
      ...requestOptions,
    });

    partIndex += 1;
    sizeIndex += sizeLimit;
  }

  return queue.reverse();
}
