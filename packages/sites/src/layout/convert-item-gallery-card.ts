import { getProp } from '@esri/hub-common';

import { ICard, ITemplatizedCard } from "./types";

export const convertItemGalleryCard = function convertItemGalleryCard (card: ICard): ITemplatizedCard {
  const settings = card.component.settings;
  const version = getProp(settings, 'version');
  if (getProp(settings, 'groups') && version < 4) {
    settings.groups = [
      {
        title: '{{solution.title}}',
        id: '{{teams.collaborationGroupId}}'
      },
      {
        title: '{{solution.title}}',
        id: '{{teams.contentGroupId}}'
      }
    ];
  }

  if (getProp(settings, 'query.groups')) {
    if (version >= 4) {
      settings.query.groups = [
        '{{teams.collaborationGroupId}}',
        '{{teams.contentGroupId}}'
      ];
    } else {
      settings.query.groups = [
        {
          title: '{{solution.title}}',
          id: '{{teams.collaborationGroupId}}'
        },
        {
          title: '{{solution.title}}',
          id: '{{teams.contentGroupId}}'
        }
      ];
    }
  }

  if (getProp(settings, 'query.orgId')) {
    settings.query.orgId = '{{organization.id}}';
  }

  if (getProp(settings, 'orgId')) {
    settings.orgId = '{{organization.id}}';
  }

  if (settings.siteId) {
    settings.siteId = '{{appid}}';
  }

  return { card, assets: [] };
};
