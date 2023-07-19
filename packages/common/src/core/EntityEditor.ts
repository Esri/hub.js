import { IArcGISContext } from "../ArcGISContext";
import { HubInitiative } from "../initiatives/HubInitiative";
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
    // TODO: Uncomment as we support more entity types
    // if (entityType === "initiative") {
    //   editor = HubInitiative.fromJson(entity, context) as EntityEditor;
    // }
    // if (entity.type === "site") {
    //   editor = HubSite.fromJson(entity, context) as EntityEditor;
    // }

    return new EntityEditor(editor);
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
