import { getProp } from "../../objects";
import {
  CollaborationType,
  IEntityPermissionPolicy,
  Permission,
} from "../../permissions";
import { IModel } from "../../types";
import { cloneObject } from "../../util";

/**
 * Informal migration that creates default permission policies based on the
 * Content and Collaboration Groups
 * @param model
 */
export function applyPermissionMigration(model: IModel) {
  // TODO: Once we formalize the permission mapping we need to
  // bump the current schema version, and add it here so this gets
  // applied once and then never again.
  // const PERMISSION_SCHEMA_VERSION = 1.6
  // if (
  //   getProp(model, "item.properties.schemaVersion") >= PERMISSION_SCHEMA_VERSION
  // )
  //   return model;

  const clone = cloneObject(model);
  clone.data.permissions = clone.data.permissions || [];
  const permissionMigrations = [
    // Per discussion with @jaydev on 2022-12-01 we are going to
    // allow content team members to create projects in the context
    // of a site
    {
      prop: "item.properties.contentGroupId",
      type: "group" as CollaborationType,
      permissions: ["hub:project:create"] as Permission[],
    },
    {
      prop: "item.owner",
      type: "user" as CollaborationType,
      permissions: ["hub:site:delete"] as Permission[],
    },
  ];

  permissionMigrations.forEach((defn) => {
    const value = getProp(clone, defn.prop);
    if (value) {
      defn.permissions.forEach((permission: Permission) => {
        const present = clone.data.permissions.find(
          (p: IEntityPermissionPolicy) =>
            p.permission === permission && p.collaborationId === value
        );
        if (!present) {
          clone.data.permissions.push({
            permission,
            collaborationType: defn.type,
            collaborationId: value,
          });
        }
      });
    }
  });
  // TODO: Uncomment when we formalize the schema version this applies to
  // clone.item.properties.schemaVersion = PERMISSION_SCHEMA_VERSION;
  return clone;
}
