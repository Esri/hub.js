import { IHubCardViewModel } from "../types/IHubCardViewModel";

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
    locale: string
  ): IHubCardViewModel;
}
