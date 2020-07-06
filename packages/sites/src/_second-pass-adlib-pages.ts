import { IModel, getProp, interpolate, IModelTemplate } from "@esri/hub-common";

/**
 * Post process the Page models, interpolating various values which would
 * not have existed when the Page item itself was created
 * @param {object} siteModel Site Model
 * @param {object} pageModel Page Model
 * @private
 */
export function _secondPassAdlibPages(
  siteModel: IModel,
  pageModel: IModelTemplate
) {
  // construct a hash of teams that were created and attached to the site
  const teams = [
    "collaborationGroupId",
    "followersGroupId",
    "contentGroupId"
  ].reduce(
    (acc, prop) => {
      const teamId = getProp(siteModel, `item.properties.${prop}`);
      if (teamId) {
        acc[prop] = teamId;
      }
      return acc;
    },
    {} as any
  );

  const settings: any = {
    teams,
    siteId: getProp(siteModel, "item.id"),
    siteUrl: getProp(siteModel, "item.url"),
    initiative: {
      item: { id: getProp(siteModel, "item.properties.parentInitiativeId") }
    }
  };
  // weld in the site itself so it can be used for some interpolations
  settings[siteModel.key] = siteModel;
  return interpolate(pageModel, settings);
}
