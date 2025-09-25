import type { IArcGISContext } from "../types/IArcGISContext";
import { HubContent } from "../content/HubContent";
import { HubDiscussion } from "../discussions/HubDiscussion";
import { HubGroup } from "../groups/HubGroup";
import { HubInitiative } from "../initiatives/HubInitiative";
import { HubPage } from "../pages/HubPage";
import { HubProject } from "../projects/HubProject";
import { HubSite } from "../sites/HubSite";
import { IEditorConfig, EntityEditorType } from "./schemas/types";
import { getTypeFromEntity } from "./getTypeFromEntity";
import { HubEntity } from "./types/HubEntity";
import { HubEntityEditor, IEntityEditorContext } from "./types/HubEntityEditor";
import { HubEvent } from "../events/HubEvent";
import { HubUser } from "../users/HubUser";
import { HubChannel } from "../channels/HubChannel";
import { HubInitiativeTemplate } from "../initiative-templates/HubInitiativeTemplate";
import { HubTemplate } from "../templates/HubTemplate";
import { IWithEditorBehavior } from "./behaviors/IWithEditorBehavior";
import { IHubChannel } from "./types/IHubChannel";
import { IHubDiscussion } from "./types/IHubDiscussion";
import { IHubEditableContent } from "./types/IHubEditableContent";
import { IHubEvent } from "./types/IHubEvent";
import { IHubGroup } from "./types/IHubGroup";
import { IHubInitiative } from "./types/IHubInitiative";
import { IHubInitiativeTemplate } from "./types/IHubInitiativeTemplate";
import { IHubPage } from "./types/IHubPage";
import { IHubProject } from "./types/IHubProject";
import { IHubSite } from "./types/IHubSite";
import { IHubTemplate } from "./types/IHubTemplate";
import { IHubUser } from "./types/IHubUser";

export class EntityEditor {
  instance: IWithEditorBehavior;

  private constructor(instance: IWithEditorBehavior) {
    this.instance = instance;
  }

  static fromEntity(entity: HubEntity, context: IArcGISContext): EntityEditor {
    const entityType = getTypeFromEntity(entity);
    // Create the instance and cast to EntityEditor
    let editor: IWithEditorBehavior;
    if (entityType === "project") {
      editor = HubProject.fromJson(entity as IHubProject, context);
    }
    if (entityType === "initiative") {
      editor = HubInitiative.fromJson(entity as IHubInitiative, context);
    }
    if (entityType === "content") {
      editor = HubContent.fromJson(entity as IHubEditableContent, context);
    }
    if (entityType === "site") {
      editor = HubSite.fromJson(entity as IHubSite, context);
    }
    if (entityType === "page") {
      editor = HubPage.fromJson(entity as IHubPage, context);
    }
    if (entityType === "discussion") {
      editor = HubDiscussion.fromJson(entity as IHubDiscussion, context);
    }
    if (entityType === "template") {
      editor = HubTemplate.fromJson(entity as IHubTemplate, context);
    }
    if (entityType === "channel") {
      editor = HubChannel.fromJson(entity as IHubChannel, context);
    }
    if (entityType === "event") {
      editor = HubEvent.fromJson(entity as IHubEvent, context);
    }
    if (entityType === "group") {
      editor = HubGroup.fromJson(entity as IHubGroup, context);
    }
    if (entityType === "initiativeTemplate") {
      editor = HubInitiativeTemplate.fromJson(
        entity as IHubInitiativeTemplate,
        context
      );
    }
    if (entityType === "user") {
      editor = HubUser.fromJson(entity as IHubUser, context);
    }
    if (editor) {
      return new EntityEditor(editor);
    } else {
      throw new Error(`Unsupported entity type: ${entity.type}`);
    }
  }

  async getConfig(
    i18nScope: string,
    type: EntityEditorType
  ): Promise<IEditorConfig> {
    return this.instance.getEditorConfig(i18nScope, type);
  }

  toEditor(
    editorContext: IEntityEditorContext = {},
    include: string[] = []
  ): Promise<HubEntityEditor> {
    // This is ugly but it's the only way to get the type to be correct
    return this.instance.toEditor(editorContext, include);
  }

  async save(
    editor: HubEntityEditor,
    editorContext?: IEntityEditorContext
  ): Promise<HubEntity> {
    return this.instance.fromEditor(editor, editorContext);
  }
}
