import {
  IGetItemInfoOptions,
  IItem,
  getItemInfo,
} from "@esri/arcgis-rest-portal";
import { getFormInfoJson } from "./get-form-info-json";
import { isSurvey123Connect } from "./is-survey123-connect";
import { decodeForm } from "./decode-form";

/**
 * Given the id of a Survey Item, return the form json, if it exists.
 * @param {string} id - form id
 * @param {string} name - The name of the form ("name" from forminfo.json)
 * @param {boolean} isSurvey123Connect - whether the survey was created by Survey123 Connect
 * @param {IGetItemInfoOptions} requestOptions
 * @returns {Promise}
 */
export const getFormJson = async (
  item: IItem,
  requestOptions: IGetItemInfoOptions
) => {
  const { name } = await getFormInfoJson(item.id, requestOptions);
  let promise;
  if (isSurvey123Connect(item)) {
    // survey123 connect does not have a <name>.json file, instead
    // that configuration is split between <name>.webform & <name>.info
    promise = Promise.all([
      getItemInfo(item.id, {
        fileName: `${name}.webform`,
        readAs: "json",
        ...requestOptions,
      }),
      getItemInfo(item.id, {
        fileName: `${name}.info`,
        readAs: "json",
        ...requestOptions,
      }),
    ]).then(([webform, info]) => {
      // webform contains questions
      const { surveyFormJson = {} } = webform;
      // other settings come from info
      // const { webformInfo: { settings } } = info;
      const {
        // webformInfo only exists if settings have been
        // managed/changed from the s123 web application.
        // Disabling survey submissions from the ArcGISSurvey123Connect
        // desktop application does not disable survey submissions from
        // the web UI. Therefore, just default to open when the survey settings
        // have not been changed from the s123 web application.
        webformInfo = {
          settings: {
            openStatusInfo: {
              status: "open",
              schedule: {
                end: null,
                status: null,
              },
            },
            multiSubmissionInfo: {
              maxAllowed: 0,
            },
          },
        },
      } = info;
      const { settings } = webformInfo;
      // combine relevant parts
      return { ...surveyFormJson, settings };
    });
  } else {
    promise = getItemInfo(item.id, {
      fileName: `${name}.json`,
      readAs: "json",
      ...requestOptions,
    });
  }

  return promise.then((form) => {
    // response may be null... so check...
    if (form) {
      // form's have some properties which may contain html, these will
      // be run thru encodeURIComponent, so we decode it here for use
      // in our template
      form = decodeForm(form);
    }
    return form;
  });
};
