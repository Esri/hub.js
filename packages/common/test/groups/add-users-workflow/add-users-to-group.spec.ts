import * as consolidateResultsModule from "../../../src/groups/add-users-workflow/output-processors/_consolidate-results";
import * as processAutoAddModule from "../../../src/groups/add-users-workflow/output-processors/_process-auto-add";
import * as processInviteModule from "../../../src/groups/add-users-workflow/output-processors/_process-invite";
import * as processPrimaryEmailModule from "../../../src/groups/add-users-workflow/output-processors/_process-primary-email";
import * as processSecondaryEmailModule from "../../../src/groups/add-users-workflow/output-processors/_process-secondary-email";
import * as getAutoAddUsersModule from "../../../src/groups/add-users-workflow/utils/_get-auto-add-users";
import * as getEmailUsersModule from "../../../src/groups/add-users-workflow/utils/_get-email-users";
import * as getInviteUsersModule from "../../../src/groups/add-users-workflow/utils/_get-invite-users";

import { addUsersToGroup } from "../../../src/groups/add-users-workflow/add-users-to-group";
import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import {
  IAddMemberContext,
  IConsolidatedResult,
} from "../../../src/groups/add-users-workflow/interfaces";
import { IUser } from "@esri/arcgis-rest-portal";
import { IHubRequestOptions } from "../../../src/hub-types";
import { cloneObject } from "../../../src/util";
import { MOCK_AUTH } from "./fixtures";
import { IEmail } from "../../../src/groups/types/types";

describe("add-users-to-group", () => {
  ////////////////////////////////
  // Spies
  ////////////////////////////////

  let consolidateSpy: any;
  let processAddSpy: any;
  let processInviteSpy: any;
  let processPESpy: any;
  let processSESpy: any;
  let getAddUsersSpy: any;
  let getEmailUsersSpy: any;
  let getInviteUsersSpy: any;

  ////////////////////////////////
  // Common Values
  ////////////////////////////////

  const eOrgId = "COG Army";
  const cOrgId = "COG Staff";
  const otherOrgId = "Locust";
  const groupId = "Delta Squad";
  const requestingUser: IUser = {
    username: "Marcus",
    orgId: eOrgId,
    privileges: [],
  };
  const communityAdmin: IUser = {
    username: "Adam",
    orgId: cOrgId,
  };
  const users: IUser[] = [
    {
      username: "Baird",
      orgId: eOrgId,
    },
    {
      username: "Dom",
      orgId: eOrgId,
    },
    {
      username: "Cole",
      orgId: eOrgId,
    },
    {
      username: "Anya",
      orgId: cOrgId,
    },
    {
      username: "Myrrah",
      orgId: otherOrgId,
    },
  ];

  const usersToAutoAdd: IUser[] = [];
  const usersToInvite: IUser[] = users;
  const usersToEmail: IUser[] = users.filter(
    (u) => cOrgId === u.orgId || eOrgId === u.orgId
  );

  const email: IEmail = {
    subject: "Time's up",
    body: "Let's do this",
  };

  const primaryRO: IHubRequestOptions = {
    isPortal: false,
    hubApiUrl: "a-url",
    authentication: MOCK_AUTH,
    portalSelf: {
      isPortal: false,
      id: "a portal id",
      name: "a portal name",
      user: requestingUser,
      portalProperties: {
        hub: {
          settings: {
            communityOrg: {
              orgId: cOrgId,
            },
          },
        },
      },
    },
  };

  const secondaryRO: IHubRequestOptions = {
    isPortal: false,
    hubApiUrl: "a-different-url",
    authentication: MOCK_AUTH,
    portalSelf: {
      isPortal: false,
      id: "a different portal id",
      name: "a different portal name",
      user: communityAdmin,
    },
  };

  //////////////////////////////////
  // Contexts
  //////////////////////////////////

  const baseContext: IAddMemberContext = {
    groupId,
    allUsers: users,
    usersToAutoAdd,
    usersToInvite,
    usersToEmail,
    requestingUser: Object.assign(cloneObject(requestingUser), { cOrgId }),
    email,
    primaryRO,
    secondaryRO,
  };

  const autoAddResultContext: IAddMemberContext = cloneObject(baseContext);
  const inviteResultContext: IAddMemberContext = Object.assign(
    cloneObject(autoAddResultContext),
    { inviteResult: { success: true } }
  );
  const primaryEmailResultContext: IAddMemberContext = Object.assign(
    cloneObject(inviteResultContext),
    { primaryEmailResult: { success: true } }
  );
  const secondaryEmailResultContext: IAddMemberContext = Object.assign(
    cloneObject(primaryEmailResultContext),
    { secondaryEmailResult: { success: true } }
  );

  const finalResult: IConsolidatedResult = {
    success: true,
    autoAdd: undefined,
    invite: {
      success: true,
    },
    email: {
      success: true,
    },
  };

  ////////////////////////////////////
  // Test Setup and Clean Up
  ////////////////////////////////////

  beforeEach(() => {
    consolidateSpy = vi
      .spyOn(consolidateResultsModule, "_consolidateResults")
      .mockResolvedValue(finalResult as any);
    processAddSpy = vi
      .spyOn(processAutoAddModule, "_processAutoAdd")
      .mockResolvedValue(autoAddResultContext as any);
    processInviteSpy = vi
      .spyOn(processInviteModule, "_processInvite")
      .mockResolvedValue(inviteResultContext as any);
    processPESpy = vi
      .spyOn(processPrimaryEmailModule, "_processPrimaryEmail")
      .mockResolvedValue(primaryEmailResultContext as any);
    processSESpy = vi
      .spyOn(processSecondaryEmailModule, "_processSecondaryEmail")
      .mockResolvedValue(secondaryEmailResultContext as any);
    getAddUsersSpy = vi
      .spyOn(getAutoAddUsersModule, "_getAutoAddUsers")
      .mockReturnValue(usersToAutoAdd);
    getEmailUsersSpy = vi
      .spyOn(getEmailUsersModule, "_getEmailUsers")
      .mockReturnValue(usersToEmail);
    getInviteUsersSpy = vi
      .spyOn(getInviteUsersModule, "_getInviteUsers")
      .mockReturnValue(usersToInvite);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  /////////////////////////////////
  // Tests
  /////////////////////////////////

  it("Generates the correct initial context", async () => {
    await addUsersToGroup(groupId, users, primaryRO, email, secondaryRO);
    expect(getAddUsersSpy).toHaveBeenCalled();
    expect(getInviteUsersSpy).toHaveBeenCalled();
    expect(getEmailUsersSpy).toHaveBeenCalled();
    expect(processAddSpy).toHaveBeenCalledWith(baseContext);
  });

  it("Propagates the correct contexts down the promise chain", async () => {
    await addUsersToGroup(groupId, users, primaryRO, email, secondaryRO);
    expect(processAddSpy).toHaveBeenCalledWith(baseContext);
    expect(processInviteSpy).toHaveBeenCalledWith(autoAddResultContext);
    expect(processPESpy).toHaveBeenCalledWith(inviteResultContext);
    expect(processSESpy).toHaveBeenCalledWith(primaryEmailResultContext);
    expect(consolidateSpy).toHaveBeenCalledWith(secondaryEmailResultContext);
  });

  it("Resolves to a consolidated result", async () => {
    const result = await addUsersToGroup(
      groupId,
      users,
      primaryRO,
      email,
      secondaryRO
    );
    expect(result).toEqual(finalResult);
  });
});
