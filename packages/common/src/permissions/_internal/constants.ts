import { ProjectPermissions } from "../../projects/_internal/ProjectPermissions";
import { SitePermissions } from "../../sites/_internal/SitePermissions";
import { InitiativePermissions } from "../../initiatives/_internal/InitiativePermissions";
import { DiscussionPermissions } from "../../discussions/_internal/DiscussionsPermissions";
import { ChannelPermissions } from "../../channels/_internal/ChannelPermissions";
import { ContentPermissions } from "../../content/_internal/ContentPermissions";
import { GroupPermissions } from "../../groups/_internal/GroupPermissions";
import { PagePermissions } from "../../pages/_internal/PagePermissions";
import { PlatformPermissions } from "../PlatformPermissions";
import { InitiativeTemplatePermissions } from "../../initiative-templates/_internal/InitiativeTemplatePermissions";
import { TemplatePermissions } from "../../templates/_internal/TemplatePermissions";
import { EventPermissions } from "../../events/_internal/EventPermissions";
import { UserPermissions } from "../../users/_internal/UserPermissions";

/**
 * Defines the values for Permissions
 * It's critical that the arrays defined in the modules use `as const`
 * otherwise Permission devolves into just a string type
 */
export const SystemPermissions = [
  "hub:release:2025R3",
  "hub:release:2026R1",
  "hub:release:2026R2",
  "hub:release:2026R3",
  "hub:gating:workspace:released",
  "hub:gating:configurableViews:released",
  "hub:feature:ai-assistant",
  "hub:platform:ai-assistant",
  "hub:feature:privacy",
  "hub:feature:workspace",
  "hub:feature:configurableViews",
  "hub:feature:user:preferences",
  "hub:card:follow",
  "hub:feature:workspace:user",
  "hub:feature:workspace:org",
  "hub:feature:keyboardshortcuts",
  "hub:feature:newentityview",
  "hub:feature:history",
  "hub:feature:catalogs", // DEPRECATED - TODO: remove at next major version
  /** remove once sites support all catalog configuration features */
  "hub:feature:catalogs:edit:advanced",
  "hub:feature:catalogs:edit:appearance",
  "hub:feature:gallery-card:enterprise",
  "hub:feature:inline-workspace",
  "hub:feature:pagescatalog",
  "hub:feature:discussions:subscription",
  "hub:license:hub-premium",
  "hub:license:hub-basic",
  "hub:license:enterprise-sites",
  "hub:availability:alpha",
  "hub:availability:beta",
  "hub:availability:general",
  "hub:environment:qaext",
  "hub:environment:devext",
  "hub:environment:production",
  "hub:environment:enterprise",
  "hub:card:embed",
] as const;

/**
 * An array of all valid/supported permissions
 */
export const ValidPermissions = [
  ...SitePermissions,
  ...ProjectPermissions,
  ...InitiativePermissions,
  ...ContentPermissions,
  ...GroupPermissions,
  ...PagePermissions,
  ...PlatformPermissions,
  ...DiscussionPermissions,
  ...InitiativeTemplatePermissions,
  ...TemplatePermissions,
  ...SystemPermissions,
  ...EventPermissions,
  ...UserPermissions,
  ...ChannelPermissions,
] as const;
