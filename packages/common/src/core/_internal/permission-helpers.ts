import { IGroup } from "@esri/arcgis-rest-portal";
import { IArcGISContext } from "../../ArcGISContext";
import { getWithDefault } from "../../objects";
import { cloneObject } from "../../util";
import {
  HubSystemPermissions,
  ICheck,
  IEntityPermissionDefinition,
  IPermissionDefinition,
  IPermissionResult,
  isPermission,
  Permission,
} from "../configuration";
import { HubEntity } from "../types/HubEntity";

export async function checkSystemPermission(
  permission: Permission,
  context: IArcGISContext
): Promise<IPermissionDefinition> {
  // Early Exit: Is this even a valid permission?
  if (!isPermission(permission)) {
    return Promise.reject({
      id: permission,
      result: {
        access: false,
        reason: "invalid-permission",
      },
    } as IPermissionDefinition);
  }

  let def: IPermissionDefinition = {
    id: permission,
    checks: [],
  };
  // Expansions
  // Add system/platform level checks for this permission
  def = mergeSystemPermissions(def);

  // Pipe through functions that check each level of permission
  // while setting the result on the definition
  // TODO Change to operation pipeline
  def = await checkLicense(def, null, context);
  def = await checkPrivileges(def, null, context);
  def = await checkRoles(def, null, context);
  def = await checkOwner(def, null, context);
  def = await checkEdit(def, null, context);
  return Promise.resolve(def);
}

export async function checkEntityPermission(
  permission: Permission,
  entity: HubEntity,
  context: IArcGISContext
): Promise<IPermissionDefinition> {
  // Early Exit: Is this even a valid permission?
  if (!isPermission(permission)) {
    return Promise.reject({
      id: permission,
      result: {
        access: false,
        reason: "invalid-permission",
      },
    } as IPermissionDefinition);
  }

  let def: IPermissionDefinition = {
    id: permission,
    checks: [],
  };
  // Expansions
  // Add system/platform level checks for this permission
  def = mergeSystemPermissions(def);
  def = mergeEntityPermissions(def, entity);

  // Pipe through functions that check each level of permission
  // while setting the result on the definition
  // TODO: Change to operation pipeline
  def = await checkLicense(def, entity, context);
  def = await checkPrivileges(def, entity, context);
  def = await checkRoles(def, entity, context);
  def = await checkOwner(def, entity, context);
  def = await checkEdit(def, entity, context);
  // may break this one up more for more granular checks
  def = await checkEntity(def, entity, context);

  return Promise.resolve(def);
}

export function mergeSystemPermissions(
  permission: IPermissionDefinition
): IPermissionDefinition {
  const systemPermissions = cloneObject(HubSystemPermissions);
  // Merge in the entity specific permissions
  const sys = systemPermissions.find((p) => p.id === permission.id);
  if (sys) {
    // if the permission exists in the system permissions, merge the two
    permission = {
      ...sys,
      ...permission,
    } as IPermissionDefinition;
  }
  return permission;
}

export function mergeEntityPermissions(
  permission: IPermissionDefinition,
  entity: HubEntity
): IPermissionDefinition {
  // Merge in the entity specific permissions
  const entityPermissions: IEntityPermissionDefinition[] = getWithDefault(
    entity,
    "permissions",
    []
  );
  const entityPermission = entityPermissions.find(
    (p) => p.id === permission.id
  );
  if (entityPermission) {
    // if the permission exists in the entity permissions, merge the two
    permission = {
      ...entityPermission,
      ...permission,
    } as IPermissionDefinition;
  }
  return permission;
}

export function checkEntity(
  permission: IPermissionDefinition,
  entity: HubEntity,
  context: IArcGISContext
): Promise<IPermissionDefinition> {
  const user = context.currentUser;
  const entityPermissions: IEntityPermissionDefinition[] = getWithDefault(
    entity,
    "permissions",
    []
  );

  // get the specifics for this permission
  const rules = entityPermissions.filter((e) => e.id === permission.id);
  // if there are no rules, then the permission is not defined for this entity

  // We only need one rule to pass
  let result: IPermissionResult = {
    access: false,
    reason: "no-entity-permission",
  };
  rules.forEach((rule) => {
    const [target, targetId] = rule.target.split(":");
    const check: ICheck = {
      check: "entity:permissions",
      value: rule.target,
      result: "fail",
    };

    if (target === "user") {
      if (targetId === user.username) {
        check.result = "pass";
        result = {
          access: true,
          reason: "direct-user",
        };
      } else {
        result = {
          access: false,
          reason: "direct-user",
        };
      }
    }

    if (target === "org") {
      if (targetId === user.orgId) {
        check.result = "pass";
        result = {
          access: true,
          reason: "org-member",
        };
      } else {
        result = {
          access: false,
          reason: "not-org-member",
        };
      }
    }

    if (target === "group") {
      if (user.groups?.find((g: IGroup) => g.id === targetId)) {
        check.result = "pass";
        result = {
          access: true,
          reason: "group-member",
        };
      } else {
        check.result = "fail";
        result = {
          access: false,
          reason: "not-group-member",
        };
      }
    }
    check.result = result.access ? "pass" : "fail";
    permission.checks.push(check);
  });

  permission.result = result;

  return Promise.resolve(permission);
}

export function checkEdit(
  permission: IPermissionDefinition,
  entity: HubEntity,
  context: IArcGISContext
): Promise<IPermissionDefinition> {
  if (permission.platform.edit) {
    const check: ICheck = {
      check: "entity:edit",
      value: "true",
      result: "pass",
    };
    if (!["admin", "edit"].includes(entity.itemControl)) {
      permission.result = {
        access: false,
        reason: "no-edit-access",
      };
      check.result = "fail";
    }
    permission.checks.push(check);
  }
  return Promise.resolve(permission);
}

export function checkOwner(
  permission: IPermissionDefinition,
  entity: HubEntity,
  context: IArcGISContext
): Promise<IPermissionDefinition> {
  if (permission.platform.owner) {
    const check: ICheck = {
      check: "entity:owner",
      value: entity.owner,
      result: "pass",
    };
    if (entity.owner !== context.currentUser.username) {
      permission.result = {
        access: false,
        reason: "not-owner",
      };
      check.result = "fail";
    }
  }
  return Promise.resolve(permission);
}

export function checkRoles(
  permission: IPermissionDefinition,
  entity: HubEntity,
  context: IArcGISContext
): Promise<IPermissionDefinition> {
  if (permission.platform?.roles) {
    const check: ICheck = {
      check: "platform:role",
      value: permission.platform.roles.join(", "),
      result: "pass",
    };
    if (!permission.platform.roles.includes(context.currentUser.role)) {
      permission.result = {
        access: false,
        reason: "missing-privilege",
      };
      check.result = "fail";
    }
    permission.checks.push(check);
  }
  return Promise.resolve(permission);
}

export function checkPrivileges(
  permission: IPermissionDefinition,
  entity: HubEntity,
  context: IArcGISContext
): Promise<IPermissionDefinition> {
  if (permission.platform?.privileges) {
    permission.platform.privileges.forEach((privilege) => {
      const check: ICheck = {
        check: "platform:privilege",
        value: privilege,
        result: "pass",
      };
      if (!context.currentUser.privileges.includes(privilege)) {
        permission.result = {
          access: false,
          reason: "missing-privilege",
        };
        check.result = "fail";
      }
      permission.checks.push(check);
    });
  }
  return Promise.resolve(permission);
}

export function checkLicense(
  permission: IPermissionDefinition,
  entity: HubEntity,
  context: IArcGISContext
): Promise<IPermissionDefinition> {
  if (permission.licenses) {
    const check: ICheck = {
      check: "platform:license",
      value: permission.licenses.join(", "),
      result: "pass",
    };
    if (!permission.licenses.includes(context.hubLicense)) {
      permission.result = {
        access: false,
        reason: "not-licensed",
      };
      check.result = "fail";
    }
    permission.checks.push(check);
  }

  return Promise.resolve(permission);
}

// const PermissionPlatformChecks = [
//   {
//     id: "hub:project:edit",
//     platform: {
//       owner: false,
//       canEdit: true,
//       privileges: []
//     }
//   },
//   {
//     id: "hub:project:view",
//     platform: {
//       owner: false,
//       canEdit: false,
//       privileges: []
//     }
//   },
//   {
//     id: "hub:project:manageDiscussions",
//     platform: {
//       owner: false,
//       canEdit: false,
//       privileges: []
//     }
//   }
// ]

// const defaultProjectPermissions = [
//   {
//     context: "item:00c",
//     target: "group:10c",
//     id: "hub:project:edit"
//   },
//   {
//     context: "item:00c",
//     target: "group:10c",
//     id: "hub:project:view"
//   },
//    {
//     context: "item:00c",
//     target: "group:10c",
//     id: "hub:project:settings"
//   },
//   {
//     context: "item:00c",
//     target: "group:10c",
//     id: "hub:project:manageDiscussions"
//   },
//   {
//     context: "item:00c",
//     target: "group:20c",
//     id: "hub:project:view"
//   },

// ]

// export const PermissionRequirements = {
//   hub: {
//     project: {
//       view: {
//         owner: false,
//         edit: true,
//         privileges: [],
//       },
//       edit: {
//         owner: false,
//         edit: true,
//         privileges: [],
//       },
//     },
//   },
// };

// export type WorkspaceAction = 'overview' | 'details' | 'settings';

// export type WorkspaceLinkDefinition = {
//   action: WorkspaceAction;
//   component: string;
//   i18nLabel: string;
//   icon: string;
//   entities: HubEntityType[];
//   permissions: string[];
//   order: number;
// };

// export const WorkspaceLinks: WorkspaceLinkDefinition[] = [
//   {
//     action: 'overview',
//     component: 'arcgis-hub-entity-overview',
//     i18nLabel: 'links.overview',
//     icon: 'home',
//     entities: ['project', 'initiative', 'site', 'page'],
//     permissions: ['hub:entity:view'],
//     order: 1,
//   },
//   {
//     action: 'details',
//     component: 'arcgis-hub-entity-editor',
//     i18nLabel: 'links.details',
//     icon: 'edit-attributes',
//     entities: ['project', 'initiative', 'site', 'page'],
//     permissions: ['hub:entity:view', 'hub:entity:edit'],
//     order: 2,
//   },
//   {
//     action: 'settings',
//     component: 'arcgis-hub-entity-settings',
//     i18nLabel: 'links.settings',
//     icon: 'gear',
//     entities: ['project', 'site', 'page'],
//     permissions: ['hub:entity:settings'],
//     order: 3,
//   },
//   {
//     action: 'settings',
//     component: 'arcgis-hub-initiative-settings',
//     upsellComponent: 'arcgis-hub-initiative-settings',
//     downComponent: 'arcgis-hub-initiative-settings',
//     i18nLabel: 'links.settings',
//     icon: 'gear',
//     entities: ['initiative'],
//     permissions: ['hub:entity:settings'],
//     order: 3,
//   },
// ];

// export const EntityWorkspaceLinks = {
//   project: [
//     {
//       action: 'overview',
//       component: 'arcgis-hub-entity-overview',
//       i18nLabel: 'links.overview',
//       icon: 'home',
//       permissions: ['hub:entity:view'],
//       order: 1,
//     },
//     {
//       action: 'details',
//       component: 'arcgis-hub-entity-editor',
//       i18nLabel: 'links.details',
//       icon: 'edit-attributes',
//       permissions: ['hub:entity:view', 'hub:entity:edit'],
//       order: 2,
//     },
//     {
//       action: 'settings',
//       component: 'arcgis-hub-entity-settings',
//       i18nLabel: 'links.settings',
//       icon: 'gear',
//       permissions: ['hub:entity:settings'],
//       order: 3,
//     },
//   ],
//   initiative: [
//     {
//       action: 'overview',
//       component: 'arcgis-hub-entity-overview',
//       i18nLabel: 'links.overview',
//       icon: 'home',
//       permissions: ['hub:entity:view'],
//       order: 1,
//     },
//     {
//       action: 'details',
//       component: 'arcgis-hub-entity-editor',
//       i18nLabel: 'links.details',
//       icon: 'edit-attributes',
//       permissions: ['hub:entity:view', 'hub:entity:edit'],
//       order: 2,
//     },
//     {
//       action: 'settings',
//       component: 'arcgis-hub-initiative-settings',
//       i18nLabel: 'links.settings',
//       icon: 'gear',
//       permissions: ['hub:entity:settings'],
//       order: 3,
//     },
//   ],
// };

// // export enum HubSubsystems {
// //   pages = "PAGES",
// //   domains = "DOMAINS",
// //   events = "EVENTS"
// // }

// // export enum DiscussionsSubsystems {
// //   posts=  "POSTS",
// //   channels = "CHANNELS"
// // }

// // This is nice, but does not play well with Json serialization
// export enum SubsystemStatusEnum {
//   nominal = 'NOMINAL',
//   maintenance = 'MAINTENANCE',
//   down = 'DOWN',
// }

// /**
//  * Thinking in Sub-systems
//  */
// export type HubSubsystem = 'pages' | 'domains' | 'events';
// export type DiscussionsSubsystems = 'channels' | 'posts';
// export type MetricsSubsystems = 'logging' | 'reporting';

// export type SubsystemStatus = 'nominal' | 'maintenance' | 'down';

// export type HubSubsystemStatus = {
//   [key in Lowercase<HubSubsystem>]: SubsystemStatus;
// };

// export type MetricsSubsystemStatus = {
//   [key in Lowercase<MetricsSubsystems>]: SubsystemStatus;
// };

// export type DiscussionSubsystemStatus = {
//   [key in Lowercase<DiscussionsSubsystems>]: SubsystemStatus;
// };

// export type SystemStatus = {
//   hub: HubSubsystemStatus;
//   discussions: DiscussionSubsystemStatus;
//   metrics: MetricsSubsystemStatus;
// };

// export const systemStatus: SystemStatus = {
//   hub: {
//     pages: 'nominal',
//     domains: 'nominal',
//     events: 'down',
//   },
//   discussions: {
//     posts: 'nominal',
//     channels: 'nominal',
//   },
//   metrics: {
//     logging: 'nominal',
//     reporting: 'nominal',
//   },
// };

// /**
//  * Thinking in Capabilities
//  */

// /**
//  * License Status
//  * This is context relative
//  * e.g. if we're on a Site, it's derived from the Site owner's org
//  * not the current user's org
//  */
// const licenseStatusPremium: PlatformLicenseStatus = {
//   context: 'item:0c1', // "org:BC1"
//   hub: {
//     pages: {
//       available: true,
//       licensed: true,
//     },
//     domains: {
//       available: true,
//       licensed: true,
//     },
//     events: {
//       available: true,
//       licensed: true,
//     },
//   },
//   discussions: {
//     channels: {
//       available: true,
//       licensed: true,
//     },
//     posts: {
//       available: true,
//       licensed: true,
//     },
//   },
//   metrics: {
//     logging: {
//       available: true,
//       licensed: true,
//     },
//     reporting: {
//       available: true,
//       licensed: true,
//     },
//   },
// };

// const licenseStatusBasic: PlatformLicenseStatus = {
//   hub: {
//     pages: {
//       available: false,
//       licensed: false,
//     },
//     domains: {
//       available: true,
//       licensed: true,
//     },
//     events: {
//       available: true,
//       licensed: false,
//     },
//   },
//   metrics: {
//     logging: {
//       available: true,
//       licensed: true,
//     },
//     reporting: {
//       available: true,
//       licensed: false,
//     },
//   },
//   discussions: {
//     channels: {
//       available: true,
//       licensed: true,
//     },
//     posts: {
//       available: true,
//       licensed: true,
//     },
//   },
// };

// const licenseStatusEnt: PlatformLicenseStatus = {
//   context: 'org:ABC123',
//   hub: {
//     pages: {
//       available: false,
//       licensed: false,
//     },
//     domains: {
//       available: false,
//       licensed: false,
//     },
//     events: {
//       available: false,
//       licensed: false,
//     },
//   },
//   discussions: {
//     channels: {
//       available: true,
//       licensed: true,
//     },
//     posts: {
//       available: true,
//       licensed: true,
//     },
//   },
//   metrics: {
//     // no metrics on enterprise
//     logging: {
//       available: false,
//       licensed: false,
//     },
//     reporting: {
//       available: false,
//       licensed: false,
//     },
//   },
// };

// const permissionHashExample = {
//   permissions: [
//     {
//       label: 'City X Public Conversations',
//       // granting read access to the channel
//       permissionId: 'discussions:channel:read',
//       // we need a means to "connect" this to something
//       // aka how would a the system know what the
//       // Public Conversations channel is? Connected to a Site?
//       context: 'channel:{cityofxpublicchannelid}',
//       // any user in any org
//       target: 'org:*',
//     },
//     {
//       label: 'City X Public Conversations',
//       // granting post access to the channel
//       permissionId: 'discussions:channel:post',
//       // we need a means to "connect" this to something
//       // aka how would a the system know what the
//       // Public Conversations channel is? Connected to a Site?
//       context: 'channel:{cityofxpublicchannelid}',
//       // any user in any org
//       target: 'org:*',
//     },
//     {
//       label: 'City X Mayors Office Internal',
//       permissionId: 'discussions:channel:read',
//       context: 'channel:{channelId}',
//       target: 'group:{mayorsofficegroup}',
//     },
//     {
//       label: 'City X Mayors Office Internal',
//       permissionId: 'discussions:channel:reply',
//       context: 'channel:{channelId}',
//       target: 'group:{mayorsofficegroup}',
//     },
//     {
//       label: 'City X Mayors Office Internal',
//       permissionId: 'discussions:channel:post',
//       context: 'channel:{channelId}',
//       target: 'group:{mayorsofficegroup}',
//     },
//     {
//       label: 'City X Mayors Office Internal',
//       permissionId: 'discussions:channel:moderate',
//       context: 'channel:{channelId}',
//       target: 'group:{mayorsofficegroup}',
//     },
//   ],
// };

// const denser = [
//   {
//     label: 'City X Mayors Office Internal',
//     permissions: ['discussions:channel:read', 'discussions:channel:reply', 'discussions:channel:post', 'discussions:channel:moderate'],
//     context: 'channel:{channelId}',
//     target: 'group:{mayorsofficegroup}',
//   },
//   {
//     label: 'Trees Project',
//     permissions: ['discussions:channel:read', 'discussions:channel:reply', 'discussions:channel:post', 'discussions:channel:moderate'],
//     context: 'item:{treesProjectId}',
//     target: 'channel:{channelId}',
//   },
// ];

// // Possible Entity Capabilities

// export type EntityCapabilityEntry = {
//   [key in HubEntityType]: Array<HubSubsystem | DiscussionsSubsystems | MetricsSubsystems>;
// };

// const EntityCapabilities: EntityCapabilityEntry = {
//   project: ['events', 'channels', 'logging'],
//   initiative: [],
// };

// // Item Capabilities
// const data = {
//   // Flat array is good b/c it does not "reveal" other capabilities at the downfall of convenience
//   // e.g. having a deep structure that mirrors the System and License status means "merging" is more complex
//   capabilitiesArry: ['events', 'discussions'],
//   capabilities: {
//     hub: {
//       pages: 'disabled',
//       events: 'enabled',
//     },
//   },
// };
