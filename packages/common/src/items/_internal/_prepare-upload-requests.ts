import { IUserRequestOptions } from "@esri/arcgis-rest-auth";
import { addItemPart } from "@esri/arcgis-rest-portal";

export function _prepareUploadRequests(
  file: any,
  owner: string,
  id: string,
  sizeLimit: number,
  requestOptions: IUserRequestOptions
): any[] {
  const queue = [];
  // part number starts from 1
  let partIndex = 1;
  let sizeIndex = 0;

  // Slice the file data and create an upload request for each part
  while (sizeIndex < file.size) {
    queue.push(() =>
      addItemPart({
        file: file.slice(sizeIndex, sizeIndex + sizeLimit, file.type),
        owner,
        id,
        partNum: partIndex,
        ...requestOptions,
      })
    );

    partIndex += 1;
    sizeIndex += sizeLimit;
  }

  return queue;
}
