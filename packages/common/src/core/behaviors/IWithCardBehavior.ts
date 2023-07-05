import { IHubCardViewModel } from "../types/IHubCardViewModel";

export interface IWithCardBehavior {
  convertToCardViewModel(
    target: "ago" | "view" | "workspace",
    locale: string
  ): IHubCardViewModel;
}
