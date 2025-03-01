import type { IArcGISContext } from "../types/IArcGISContext";
import { HubContent } from "../content/HubContent";
import { HubDiscussion } from "../discussions/HubDiscussion";
import { HubGroup } from "../groups/HubGroup";
import { HubInitiative } from "../initiatives/HubInitiative";
import { HubInitiativeTemplate } from "../initiative-templates";
import { HubPage } from "../pages/HubPage";
import { HubProject } from "../projects/HubProject";
import { HubSite } from "../sites/HubSite";
import { HubTemplate } from "../templates";
import { HubSurvey } from "../surveys/HubSurvey";
import { IEditorConfig, EntityEditorType } from "./schemas/types";
import { IWithEditorBehavior } from "./behaviors";
import { getTypeFromEntity } from "./getTypeFromEntity";
import { HubEntity } from "./types/HubEntity";
import { HubEntityEditor, IEntityEditorContext } from "./types/HubEntityEditor";
import { HubEvent } from "../events/HubEvent";
import { HubUser } from "../users/HubUser";
import { IHubUser } from "./types";

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
      editor = HubProject.fromJson(entity, context) as IWithEditorBehavior;
    }
    if (entityType === "initiative") {
      editor = HubInitiative.fromJson(entity, context) as IWithEditorBehavior;
    }
    if (entityType === "content") {
      editor = HubContent.fromJson(entity, context) as IWithEditorBehavior;
    }
    if (entityType === "site") {
      editor = HubSite.fromJson(entity, context) as IWithEditorBehavior;
    }
    if (entityType === "page") {
      editor = HubPage.fromJson(entity, context) as IWithEditorBehavior;
    }
    if (entityType === "discussion") {
      editor = HubDiscussion.fromJson(entity, context) as IWithEditorBehavior;
    }
    if (entityType === "template") {
      editor = HubTemplate.fromJson(entity, context) as IWithEditorBehavior;
    }
    if (entityType === "survey") {
      editor = HubSurvey.fromJson(entity, context) as IWithEditorBehavior;
    }
    if (entityType === "event") {
      editor = HubEvent.fromJson(entity, context) as IWithEditorBehavior;
    }
    if (entityType === "group") {
      editor = HubGroup.fromJson(
        entity as unknown as HubGroup,
        context
      ) as IWithEditorBehavior;
    }
    if (entityType === "initiativeTemplate") {
      editor = HubInitiativeTemplate.fromJson(
        entity,
        context
      ) as IWithEditorBehavior;
    }
    if (entityType === "user") {
      editor = HubUser.fromJson(
        entity as IHubUser,
        context
      ) as IWithEditorBehavior;
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
  ): HubEntityEditor {
    // This is ugly but it's the only way to get the type to be correct
    return this.instance.toEditor(
      editorContext,
      include
    ) as unknown as HubEntityEditor;
  }

  async save(
    editor: HubEntityEditor,
    editorContext?: IEntityEditorContext
  ): Promise<HubEntity> {
    return this.instance.fromEditor(editor, editorContext);
  }
}
