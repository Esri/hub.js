import { ICard, ITemplatizedCard } from "./types";

export const convertEventListCard = function convertEventListCard (card: ICard): ITemplatizedCard {
  card.component.settings.initiativeIds = ['{{initiative.item.id}}'];
  return { card, assets: [] };
};
