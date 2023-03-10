import { IArcGISContext } from "../ArcGISContext";
import { HubItemEntity } from "../core/HubItemEntity";
import { IHubEditableContent, IWithStoreBehavior } from "../core";

export class HubContent
  extends HubItemEntity<IHubEditableContent>
  implements IWithStoreBehavior<IHubEditableContent>
{
  private constructor(content: IHubEditableContent, context: IArcGISContext) {
    super(content, context);
  }

  /**
   * Create an instance from an IHubEditableContent object
   * @param json - JSON object to create a HubContent from
   * @param context - ArcGIS context
   * @returns
   */
  static fromJson(
    json: Partial<IHubEditableContent>,
    context: IArcGISContext
  ): HubContent {
    // TODO: merge what we have with the default values
    // const pojo = this.applyDefaults(json, context);
    const pojo = json as IHubEditableContent;
    return new HubContent(pojo, context);
  }

  /**
   * Save the HubContent to the backing store. Currently Projects are stored as Items in Portal
   * @returns
   */
  async save(): Promise<void> {
    this._checkDestroyed();
    const { createContent, updateContent } = await import("./edit");

    if (this.entity.id) {
      // update it
      this.entity = await updateContent(
        this.entity,
        this.context.userRequestOptions
      );
    } else {
      // create it
      this.entity = await createContent(
        this.entity,
        this.context.userRequestOptions
      );
    }
    // call the after save hook on superclass
    await super.afterSave();

    return;
  }

  /**
   * Apply a new state to the instance
   * @param changes
   */
  update(changes: Partial<IHubEditableContent>): void {
    this._checkDestroyed();
    // merge partial onto existing entity
    this.entity = { ...this.entity, ...changes };
  }

  /**
   * Delete the HubContent from the store
   * set a flag to indicate that it is destroyed
   * @returns
   */
  async delete(): Promise<void> {
    this._checkDestroyed();
    this.isDestroyed = true;
    const { deleteContent } = await import("./edit");
    // Delegate to module fn
    await deleteContent(this.entity.id, this.context.userRequestOptions);
  }

  // TODO: move this to HubItemEntity
  private _checkDestroyed() {
    if (this.isDestroyed) {
      throw new Error("HubContent is already destroyed.");
    }
  }
}
