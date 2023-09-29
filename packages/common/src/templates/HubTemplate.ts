import { IArcGISContext } from "../ArcGISContext";
import { HubItemEntity } from "../core/HubItemEntity";
import { IHubTemplate } from "../core/types/IHubTemplate";
import { DEFAULT_TEMPLATE } from "./defaults";
import { createTemplate, updateTemplate } from "./edit";

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

  /**
   * Create an HubTemplate instance from an IHubTemplate object
   * @param json - JSON object to create a HubTemplate from
   * @param context - ArcGIS context
   * @returns
   */
  static fromJson(
    json: Partial<IHubTemplate>,
    context: IArcGISContext
  ): HubTemplate {
    // merge what we have with the default values
    const pojo = this.applyDefaults(json, context);
    return new HubTemplate(pojo, context);
  }

  /**
   * Create a new HubTemplate, returning a HubTemplate instance.
   * This does not automatically persist the Template into
   * the backing store unless save is set to true
   *
   * NOTE: we have no immediate plans to allow template creation
   * from the context of our application, but scaffolding this
   * method for potential future implementation
   * @param partialTemplate
   * @param context
   * @param save
   */
  static async create(
    partialTemplate: Partial<IHubTemplate>,
    context: IArcGISContext,
    save: boolean = false
  ): Promise<HubTemplate> {
    const pojo = this.applyDefaults(partialTemplate, context);
    const instance = HubTemplate.fromJson(pojo, context);
    if (save) {
      await instance.save();
    }
    return instance;
  }

  /**
   * Given a partial Template, apply defaults to
   * it to ensure that a baseline of properties are set
   * @param partialTemplate
   * @param context
   * @returns
   */
  private static applyDefaults(
    partialTemplate: Partial<IHubTemplate>,
    context: IArcGISContext
  ): IHubTemplate {
    // ensure we have the orgUrlKey
    if (!partialTemplate.orgUrlKey) {
      partialTemplate.orgUrlKey = context.portal.urlKey;
    }
    // extend the partial over the defaults
    const pojo = { ...DEFAULT_TEMPLATE, ...partialTemplate } as IHubTemplate;
    return pojo;
  }

  update(changes: Partial<IHubTemplate>): void {
    // TODO
  }

  /** Save the HubTemplate to the backing store */
  async save(): Promise<void> {
    if (this.isDestroyed) {
      throw new Error("HubTemplate is already destroyed.");
    }

    // 1. create or update
    this.entity = this.entity.id
      ? await updateTemplate(this.entity, this.context.userRequestOptions)
      : await createTemplate(this.entity, this.context.userRequestOptions);

    // 2. call the after save hook on HubItemEntity superclass
    await super.afterSave();
  }

  async delete(): Promise<void> {
    // TODO
  }
}
