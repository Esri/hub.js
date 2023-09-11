import { IHubInitiativeTemplate } from "../core/types/IHubInitiativeTemplate";
import { HubItemEntity } from "../core/HubItemEntity";
import {
  IWithStoreBehavior,
  IWithCatalogBehavior,
  IWithSharingBehavior,
  IWithCardBehavior,
  IConvertToCardModelOpts,
  IHubCardViewModel,
} from "../core";

import { IArcGISContext } from "..";
import { Catalog } from "../search";
import { DEFAULT_INITIATIVE_TEMPLATE } from "./defaults";

export class HubInitiativeTemplate
  extends HubItemEntity<IHubInitiativeTemplate>
  implements
    IWithStoreBehavior<IHubInitiativeTemplate>,
    IWithCatalogBehavior,
    IWithSharingBehavior,
    IWithCardBehavior
{
  private _catalog: Catalog;

  private constructor(
    initiativeTemplate: IHubInitiativeTemplate,
    context: IArcGISContext
  ) {
    super(initiativeTemplate, context);
    this._catalog = Catalog.fromJson(initiativeTemplate.catalog, this.context);
  }

  get catalog(): Catalog {
    return this._catalog;
  }

  /**
   * Create an instance from an IHubInitiativeTemplate object
   * @param json - JSON object to create a HubInitiativeTemplate from
   * @param context - ArcGIS context
   * @returns - instance of HubInitiativeTemplate
   */
  static fromJson(
    json: Partial<IHubInitiativeTemplate>,
    context: IArcGISContext
  ): HubInitiativeTemplate {
    // merge what we have with the default values
    const pojo = this.applyDefaults(json, context);
    return new HubInitiativeTemplate(pojo, context);
  }

  /**
   * Create a new HubInitiativeTemplate, returning a HubInitiativeTemplate instance.
   * Note: This does not persist the HubInitiativeTemplate into the backing store
   * @param partialInitiativeTemplate
   * @param context
   * @param save
   * @returns
   */
  static async create(
    partialInitiativeTemplate: Partial<IHubInitiativeTemplate>,
    context: IArcGISContext,
    save: boolean = false
  ): Promise<HubInitiativeTemplate> {
    const pojo = this.applyDefaults(partialInitiativeTemplate, context);
    // return an instance of HubInitiativeTemplate
    const instance = HubInitiativeTemplate.fromJson(pojo, context);
    if (save) {
      await instance.save();
    }
    return instance;
  }

  /**
   * Fetch a HubInitiativeTemplate from the backing store and return a HubInitiativeTemplate instance.
   * @param identifier - Identifier of the initiative template to load
   * @param context
   */
  static async fetch(
    identifier: string,
    context: IArcGISContext
  ): Promise<HubInitiativeTemplate> {
    return;
  }

  /**
   * Given a partial initiative template, apply defaults to it to ensure that a baseline of properties are set
   * @param partialInitiativeTemplate
   * @param context
   * @returns
   */
  private static applyDefaults(
    partialInitiativeTemplate: Partial<IHubInitiativeTemplate>,
    context: IArcGISContext
  ): IHubInitiativeTemplate {
    const pojo = {
      ...DEFAULT_INITIATIVE_TEMPLATE,
      ...partialInitiativeTemplate,
    } as IHubInitiativeTemplate;
    return pojo;
  }

  /**
   * Convert the project entity into a card view model that can
   * be consumed by the suite of hub gallery components
   * @param opts - view model options
   * @returns
   */
  convertToCardModel(opts?: IConvertToCardModelOpts): IHubCardViewModel {
    // TODO
    return;
  }

  /**
   * Delete the HubInitiativeTemplate from the store
   * set a flag to indicate that it is destroyed
   * @returns
   */
  delete(): Promise<void> {
    // TODO
    return;
  }

  /**
   * Save the HubInitiativeTemplate to the backing store.
   * @returns
   */
  save(): Promise<void> {
    // TODO
    return;
  }

  /**
   * Apply a new state to the instance
   * @param changes
   */
  update(changes: Partial<IHubInitiativeTemplate>): void {
    // TODO
  }
}
