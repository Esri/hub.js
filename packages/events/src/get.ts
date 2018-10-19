/* Copyright (c) 2018 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */

import {
  getFeature,
  getAttachments,
  IAttachmentInfo
} from "@esri/arcgis-rest-feature-service";
import { IFeature } from "@esri/arcgis-rest-common-types";
import { IRequestOptions } from "@esri/arcgis-rest-request";
import { getEventServiceUrl } from "./util";

export interface IEventFeature extends IFeature {
  attachments: IEventAttachmentInfo[];
}

export interface IEventAttachmentInfo extends IAttachmentInfo {
  attachmentId: number; // This seems redundant
  url: string;
}

/**
 * @param id - Event Feature Id
 * @param requestOptions - Event request options that may have authentication manager
 * @returns A Promise that will resolve with the Initiative item and data
 * @export
 */
export function getEventById(
  id: number,
  requestOptions: IRequestOptions // Keep this?
): Promise<any> {
  /* if (!requestOptions.outFields) {
    requestOptions.outFields = '*';
  } */
  const url = ""; // TODO: await getEventServiceUrl(); how to get orgId
  return getFeature({
    url,
    id
  }).then(featureResponse => {
    const event = featureResponse as IEventFeature;
    return getAttachments({
      url,
      featureId: id
    }).then(attachmentResponse => {
      const attachments: IEventAttachmentInfo[] = [];
      const dateNow = new Date().getTime();
      const token: string = ""; // TODO: get token
      attachmentResponse.attachmentInfos.forEach(attachment => {
        const eventAttachment = attachment as IEventAttachmentInfo;
        eventAttachment.attachmentId = attachment.id;
        eventAttachment.url = `${url}/${id}/attachments/${
          attachment.id
        }?v=${dateNow}`;
        if (token) {
          eventAttachment.url += `&token=${token}`;
        }
        attachments.push(eventAttachment);
      });
      event.attachments = attachments;
      return event;
    });
  });
}
