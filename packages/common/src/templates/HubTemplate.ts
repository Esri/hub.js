import { IArcGISContext } from "../ArcGISContext";
import { HubItemEntity } from "../core/HubItemEntity";
import { IHubTemplate } from "../core/types/IHubTemplate";

/** Hub Template Class */
export class HubTemplate extends HubItemEntity<IHubTemplate> {
  /**
   * Private constructor to allow for future
   * template-specific logic
   * @param template
   * @param context
   */
  private constructor(template: IHubTemplate, context: IArcGISContext) {
    super(template, context);
  }

  update(changes: Partial<IHubTemplate>): void {
    // TODO
  }

  async save(): Promise<void> {
    // TODO
  }

  async delete(): Promise<void> {
    // TODO
  }
}
