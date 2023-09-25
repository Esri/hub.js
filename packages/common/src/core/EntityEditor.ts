import { IArcGISContext } from "../ArcGISContext";
import { HubContent } from "../content/HubContent";
import { HubDiscussion } from "../discussions/HubDiscussion";
import { HubGroup } from "../groups/HubGroup";
import { HubInitiative } from "../initiatives/HubInitiative";
import { HubInitiativeTemplate } from "../initiativeTemplates";
import { HubPage } from "../pages/HubPage";
import { HubProject } from "../projects/HubProject";
import { HubSite } from "../sites/HubSite";
import { IEditorConfig, IWithEditorBehavior } from "./behaviors";
import { getTypeFromEntity } from "./getTypeFromEntity";
import { EditorType, UiSchemaElementOptions } from "./schemas";
import { HubEntity } from "./types/HubEntity";
import { HubEntityEditor, IEntityEditorContext } from "./types/HubEntityEditor";

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
    if (editor) {
      return new EntityEditor(editor);
    } else {
      throw new Error(`Unsupported entity type: ${entity.type}`);
    }
  }

  async getConfig(i18nScope: string, type: EditorType): Promise<IEditorConfig> {
    return this.instance.getEditorConfig(i18nScope, type);
  }

  toEditor(editorContext: IEntityEditorContext = {}): HubEntityEditor {
    // This is ugly but it's the only way to get the type to be correct
    return this.instance.toEditor(editorContext) as unknown as HubEntityEditor;
  }

  async save(editor: HubEntityEditor): Promise<HubEntity> {
    return this.instance.fromEditor(editor);
  }
}
