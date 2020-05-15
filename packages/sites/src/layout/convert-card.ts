import { cloneObject, getProp } from '@esri/hub-common';

import { ICard, ITemplatizedCard } from "./types";

const converters: Record<string,Function> = {
  'event-list-card': convertEventListCard,
  'follow-initiative-card': convertFollowCard,
  'items/gallery-card': convertItemGalleryCard,
  'image-card': convertImageCard,
  'jumbotron-card': convertImageCard
}

/**
 * Convert a card to a templatized version of itself
 * @param {ICard} card the card to templatize
 */
export const convertCard = function convertCard (card: ICard) : ITemplatizedCard {
  const clone = cloneObject(card) as ICard;

  const converter = converters[clone.component.name];

  if (converter) {
    return converter(clone)
  }

  return {
    card: clone, 
    assets: []
  }
};

function convertEventListCard (card: ICard): ITemplatizedCard {
  card.component.settings.initiativeIds = ['{{initiative.item.id}}'];
  return { card, assets: [] };
};

function convertFollowCard (card: ICard): ITemplatizedCard {
  card.component.settings.initiativeId = '{{initiative.item.id}}';
  return { card, assets: [] };
};

function convertImageCard (card: ICard) : ITemplatizedCard {
  const result = {
    card,
    assets: [] as string[]
  };
  if (getProp(card, 'component.settings.fileSrc')) {
    result.assets.push(card.component.settings.fileSrc);
  }
  if (getProp(card, 'component.settings.cropSrc')) {
    result.assets.push(card.component.settings.cropSrc);
  }
  return result;
};

function convertItemGalleryCard (card: ICard): ITemplatizedCard {
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
