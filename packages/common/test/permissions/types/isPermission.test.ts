import { isPermission } from "../../../src";
import { ProjectPermissions } from "../../../src/projects/_internal/ProjectBusinessRules";
import { SitePermissions } from "../../../src/sites/_internal/SiteBusinessRules";
import { InitiativePermissions } from "../../../src/initiatives/_internal/InitiativeBusinessRules";
import { DiscussionPermissions } from "../../../src/discussions/_internal/DiscussionBusinessRules";
import { ContentPermissions } from "../../../src/content/_internal/ContentBusinessRules";
import { GroupPermissions } from "../../../src/groups/_internal/GroupBusinessRules";
import { PagePermissions } from "../../../src/pages/_internal/PageBusinessRules";
import { PlatformPermissions } from "../../../src/permissions/PlatformPermissionPolicies";
import { InitiativeTemplatePermissions } from "../../../src/initiative-templates/_internal/InitiativeTemplateBusinessRules";

describe("isPermission:", () => {
  const allPermissions = [
    ...SitePermissions,
    ...ProjectPermissions,
    ...InitiativePermissions,
    ...ContentPermissions,
    ...GroupPermissions,
    ...PagePermissions,
    ...PlatformPermissions,
    ...DiscussionPermissions,
    ...InitiativeTemplatePermissions,
    "temp:workspace:released",
  ];

  allPermissions.forEach((permission) => {
    it(`returns true for ${permission} permission`, () => {
      expect(isPermission(permission)).toBe(true);
    });
  });

  it("returns fails for invalid permission", () => {
    expect(isPermission("foo:site:create")).toBe(false);
  });
});
