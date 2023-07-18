import {
  IConvertToCardViewModelOpts,
  IHubCardViewModel,
} from "../types/IHubCardViewModel";

export interface IWithCardBehavior {
  /**
   * Convert an entity into a card view model that can
   * be consumed by the suite of hub gallery components
   *
   * @param opts view model options
   */
  convertToCardViewModel(opts?: IConvertToCardViewModelOpts): IHubCardViewModel;
}
