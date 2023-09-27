import { IArcGISContext } from "../ArcGISContext";
import { HubItemEntity } from "../core/HubItemEntity";
import { IHubSolutionTemplate } from "../core/types/IHubSolutionTemplate";

/** Hub Solution Template Class */
export class HubSolutionTemplate extends HubItemEntity<IHubSolutionTemplate> {
  /**
   * Private constructor to allow for future
   * solution-specific logic
   * @param solutionTemplate
   * @param context
   */
  private constructor(
    solutionTemplate: IHubSolutionTemplate,
    context: IArcGISContext
  ) {
    super(solutionTemplate, context);
  }

  update(changes: Partial<IHubSolutionTemplate>): void {
    // TODO
  }

  async save(): Promise<void> {
    // TODO
  }

  async delete(): Promise<void> {
    // TODO
  }
}
