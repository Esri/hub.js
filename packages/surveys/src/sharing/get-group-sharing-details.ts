/* Copyright (c) 2020 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */

import { IRequestOptions } from "@esri/arcgis-rest-request";
import { getGroup } from "@esri/arcgis-rest-portal";
import { IGetGroupSharingDetailsResults } from "@esri/hub-common";
import { getSurveyModels } from "../items/get-survey-models";
import { isPublished } from "../utils/is-published";

/**
 * Builds the details for sharing/unsharing a Survey to/from a Group.
 * The Form & Source Feature Service are targeted for drafts. The
 * Form & Fieldworker View are targeted for published surveys and
 * View groups. The Form, FeatureService, Fieldworker View & Stakeholder
 * View are targeted for published surveys Update groups.
 * @param {string} formId A Form ID
 * @param {string} groupId A Group ID
 * @param {IRequestOptions} requestOptions The request options
 * @returns {Promise<IGetGroupSharingDetailsResults>}
 */
export const getGroupSharingDetails = (
  formId: string,
  groupId: string,
  requestOptions: IRequestOptions
): Promise<IGetGroupSharingDetailsResults> => {
  const targetGroupPromise = getGroup(groupId, requestOptions);
  const surveyModelsPromise = getSurveyModels(formId, requestOptions);

  return Promise.all([targetGroupPromise, surveyModelsPromise]).then(
    ([group, { form, featureService, fieldworker, stakeholder }]) => {
      let models = [];
      if (isPublished(form.item)) {
        const isUpdateGroup =
          group.capabilities.indexOf("updateitemcontrol") > -1;
        // published surveys have a form, feature service, fieldworker, and potentially a stakeholder
        // if a view group, only share the form & fieldworker
        // if an edit/update group, share form, feature service, fieldworker, and stakeholder (if it exists)
        models = (isUpdateGroup && [
          form,
          featureService,
          fieldworker,
          stakeholder
        ]) || [form, fieldworker];
      } else {
        // drafts only have a form & feature service
        models = [form, featureService];
      }

      const modelsToShare = models.filter(_ => _);

      return { modelsToShare, group };
    }
  );
};
