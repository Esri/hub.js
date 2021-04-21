import * as consolidateResultsModule from "../../../src/utils/_add-users-to-group/_consolidate-results";
import * as processAutoAddModule from "../../../src/utils/_add-users-to-group/_process-auto-add";
import * as processInviteModule from "../../../src/utils/_add-users-to-group/_process-invite";
import * as processPrimaryEmailModule from "../../../src/utils/_add-users-to-group/_process-primary-email";
import * as processSecondaryEmailModule from "../../../src/utils/_add-users-to-group/_process-secondary-email";
import * as getAutoAddUsersModule from "../../../src/utils/_add-users-to-group/_get-auto-add-users";
import * as getEmailUsersModule from "../../../src/utils/_add-users-to-group/_get-email-users";
import * as getInviteUsersModule from "../../../src/utils/_add-users-to-group/_get-invite-users";

import { addUsersToGroup } from "../../../src/utils/_add-users-to-group/add-users-to-group";
import {
  IAddMemberContext,
  IConsolidatedResult,
  IEmail
} from "../../../src/utils/_add-users-to-group/interfaces";
import { IUser } from "@esri/arcgis-rest-portal";
import { IHubRequestOptions, cloneObject } from "@esri/hub-common";
import { MOCK_AUTH } from "./fixtures";

describe("add-users-to-group", () => {
  ////////////////////////////////
  // Spies
  ////////////////////////////////

  let consolidateSpy: jasmine.Spy;
  let processAddSpy: jasmine.Spy;
  let processInviteSpy: jasmine.Spy;
  let processPESpy: jasmine.Spy;
  let processSESpy: jasmine.Spy;
  let getAddUsersSpy: jasmine.Spy;
  let getEmailUsersSpy: jasmine.Spy;
  let getInviteUsersSpy: jasmine.Spy;

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
    privileges: []
  };
  const communityAdmin: IUser = {
    username: "Adam",
    orgId: cOrgId
  };
  const users: IUser[] = [
    {
      username: "Baird",
      orgId: eOrgId
    },
    {
      username: "Dom",
      orgId: eOrgId
    },
    {
      username: "Cole",
      orgId: eOrgId
    },
    {
      username: "Anya",
      orgId: cOrgId
    },
    {
      username: "Myrrah",
      orgId: otherOrgId
    }
  ];

  const usersToAutoAdd: IUser[] = [];
  const usersToInvite: IUser[] = users;
  const usersToEmail: IUser[] = users.filter(
    u => cOrgId === u.orgId || eOrgId === u.orgId
  );

  const email: IEmail = {
    subject: "Time's up",
    body: "Let's do this"
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
              orgId: cOrgId
            }
          }
        }
      }
    }
  };

  const secondaryRO: IHubRequestOptions = {
    isPortal: false,
    hubApiUrl: "a-different-url",
    authentication: MOCK_AUTH,
    portalSelf: {
      isPortal: false,
      id: "a different portal id",
      name: "a different portal name",
      user: communityAdmin
    }
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
    secondaryRO
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
      success: true
    },
    email: {
      success: true
    }
  };

  ////////////////////////////////////
  // Test Setup and Clean Up
  ////////////////////////////////////

  beforeEach(() => {
    consolidateSpy = spyOn(
      consolidateResultsModule,
      "_consolidateResults"
    ).and.callFake(() => Promise.resolve(finalResult));
    processAddSpy = spyOn(processAutoAddModule, "_processAutoAdd").and.callFake(
      () => Promise.resolve(autoAddResultContext)
    );
    processInviteSpy = spyOn(
      processInviteModule,
      "_processInvite"
    ).and.callFake(() => Promise.resolve(inviteResultContext));
    processPESpy = spyOn(
      processPrimaryEmailModule,
      "_processPrimaryEmail"
    ).and.callFake(() => Promise.resolve(primaryEmailResultContext));
    processSESpy = spyOn(
      processSecondaryEmailModule,
      "_processSecondaryEmail"
    ).and.callFake(() => Promise.resolve(secondaryEmailResultContext));
    getAddUsersSpy = spyOn(
      getAutoAddUsersModule,
      "_getAutoAddUsers"
    ).and.returnValue(usersToAutoAdd);
    getEmailUsersSpy = spyOn(
      getEmailUsersModule,
      "_getEmailUsers"
    ).and.returnValue(usersToEmail);
    getInviteUsersSpy = spyOn(
      getInviteUsersModule,
      "_getInviteUsers"
    ).and.returnValue(usersToInvite);
  });

  afterEach(() => {
    consolidateSpy.calls.reset();
    processAddSpy.calls.reset();
    processInviteSpy.calls.reset();
    processPESpy.calls.reset();
    processSESpy.calls.reset();
    getAddUsersSpy.calls.reset();
    getEmailUsersSpy.calls.reset();
    getInviteUsersSpy.calls.reset();
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
