import { ICardActionLink, IHubCardViewModel } from "../types/IHubCardViewModel";

export interface IWithCardBehavior {
  /**
   * Convert an entity into a card view model that can
   * be consumed by the suite of hub gallery components
   *
   * @param target card link contextual target
   * @param locale internationalization locale
   */
  convertToCardViewModel(
    target: "ago" | "view" | "workspace",
    actionLinks: ICardActionLink[],
    /**
     * TODO: move transform logic to FE so we don't need to pass
     * locale down (follow https://devtopia.esri.com/dc/hub/issues/7255)
     */
    locale: string
  ): IHubCardViewModel;
}
