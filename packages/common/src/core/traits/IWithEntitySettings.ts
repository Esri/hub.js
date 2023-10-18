import { IEntitySetting } from "../../discussions";

/**
 * Entity settings
 */
export interface IWithEntitySettings {
  entitySettings: Omit<IEntitySetting, "id"> & {
    id?: string;
  };
}
