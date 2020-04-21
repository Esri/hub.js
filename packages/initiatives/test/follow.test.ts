/* Copyright (c) 2018 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */

import { IUser } from "@esri/arcgis-rest-portal";
import { followInitiative, unfollowInitiative } from "../src/follow";
import { MOCK_REQUEST_OPTIONS } from "./mocks/fake-session";
import * as fetchMock from "fetch-mock";

afterEach(() => {
  fetchMock.restore();
});

describe("follow/unfollowInitiative", () => {
  describe("initiative without a followers group", () => {
    const NON_FOLLOWER: IUser = {
      username: "vader",
      fullName: "Anakin Skywalker",
      availableCredits: 54161.586,
      assignedCredits: -1,
      firstName: "Anakin",
      lastName: "Skywalker",
      preferredView: null,
      description: null,
      email: "darth@earthlink.net",
      idpUsername: null,
      favGroupId: "3746d652b4c44a3fa7b778631145298c",
      lastLogin: 1552516637000,
      mfaEnabled: false,
      access: "org",
      storageUsage: 1394828039,
      storageQuota: 2199023255552,
      orgId: "uCXeTVveQzP4IIcx",
      role: "org_user",
      privileges: [],
      level: "2",
      disabled: false,
      tags: [],
      culture: "en-US",
      region: "WO",
      units: "english",
      thumbnail: null,
      created: 1539911814000,
      modified: 1545167865000,
      provider: "arcgis",
      groups: []
    };

    const FOLLOWER: IUser = {
      username: "vader",
      fullName: "Anakin Skywalker",
      availableCredits: 54161.586,
      assignedCredits: -1,
      firstName: "Anakin",
      lastName: "Skywalker",
      preferredView: null,
      description: null,
      email: "darth@earthlink.net",
      idpUsername: null,
      favGroupId: "3746d652b4c44a3fa7b778631145298c",
      lastLogin: 1552516637000,
      mfaEnabled: false,
      access: "org",
      storageUsage: 1394828039,
      storageQuota: 2199023255552,
      orgId: "uCXeTVveQzP4IIcx",
      role: "org_user",
      privileges: [],
      level: "2",
      disabled: false,
      tags: ["hubInitiativeId|fe8"],
      culture: "en-US",
      region: "WO",
      units: "english",
      thumbnail: null,
      created: 1539911814000,
      modified: 1545167865000,
      provider: "arcgis",
      groups: []
    };

    const ANOTHER_FOLLOWER: IUser = {
      username: "vader",
      fullName: "Anakin Skywalker",
      availableCredits: 54161.586,
      assignedCredits: -1,
      firstName: "Anakin",
      lastName: "Skywalker",
      preferredView: null,
      description: null,
      email: "darth@earthlink.net",
      idpUsername: null,
      favGroupId: "3746d652b4c44a3fa7b778631145298c",
      lastLogin: 1552516637000,
      mfaEnabled: false,
      access: "org",
      storageUsage: 1394828039,
      storageQuota: 2199023255552,
      orgId: "uCXeTVveQzP4IIcx",
      role: "org_user",
      privileges: [],
      level: "2",
      disabled: false,
      tags: ["I drive a Dodge Stratus", "hubInitiativeId|fe8"],
      culture: "en-US",
      region: "WO",
      units: "english",
      thumbnail: null,
      created: 1539911814000,
      modified: 1545167865000,
      provider: "arcgis",
      groups: []
    };

    const INITIATIVE_ITEM = {
      id: "",
      properties: {}
    };

    it("should add user tags if they arent already following", done => {
      // mock two fetch calls...
      // user metadata
      fetchMock.post(
        `https://www.arcgis.com/sharing/rest/community/users/vader`,
        NON_FOLLOWER
      );

      // user update
      fetchMock.post(
        `https://www.arcgis.com/sharing/rest/community/users/vader/update`,
        {
          success: true,
          username: "vader"
        }
      );

      // initiative fetch
      fetchMock.get(
        "https://www.arcgis.com/sharing/rest/content/items/fe8?f=json&token=fake-token",
        INITIATIVE_ITEM
      );
      fetchMock.get(
        "https://www.arcgis.com/sharing/rest/content/items/fe8/data?f=json&token=fake-token",
        {}
      );

      followInitiative({
        initiativeId: `fe8`,
        ...MOCK_REQUEST_OPTIONS
      })
        .then(response => {
          // check that the mocks were called
          expect(fetchMock.done()).toBeTruthy();
          // inspect the POST call...
          const [metadataUrl, metadataOptions] = fetchMock.lastCall(
            `https://www.arcgis.com/sharing/rest/community/users/vader`
          );
          expect(metadataUrl).toEqual(metadataUrl);
          expect(metadataOptions.method).toBe("POST");
          expect(metadataOptions.body).toContain("f=json");
          expect(metadataOptions.body).toContain("token=fake-token");

          const [updateUrl, updateOptions] = fetchMock.lastCall(
            `https://www.arcgis.com/sharing/rest/community/users/vader/update`
          );
          expect(updateUrl).toEqual(updateUrl);
          expect(updateOptions.method).toBe("POST");
          expect(updateOptions.body).toContain("f=json");
          expect(updateOptions.body).toContain("token=fake-token");
          expect(updateOptions.body).toContain(
            `tags=${encodeURIComponent("hubInitiativeId|fe8")}`
          );
          expect(response.success).toBe(true);
          done();
        })
        .catch(() => {
          fail();
        });
    });

    it("should not add user tags if they are already following", done => {
      // mock two fetch calls...
      // user metadata
      fetchMock.post(
        `https://www.arcgis.com/sharing/rest/community/users/vader`,
        FOLLOWER
      );

      // user update
      fetchMock.post(
        `https://www.arcgis.com/sharing/rest/community/users/vader/update`,
        {
          success: true,
          username: "vader"
        }
      );

      // initiative fetch
      fetchMock.get(
        "https://www.arcgis.com/sharing/rest/content/items/fe8?f=json&token=fake-token",
        INITIATIVE_ITEM
      );
      fetchMock.get(
        "https://www.arcgis.com/sharing/rest/content/items/fe8/data?f=json&token=fake-token",
        {}
      );

      followInitiative({
        initiativeId: `fe8`,
        ...MOCK_REQUEST_OPTIONS
      }).catch(err => {
        expect(err).toBe(`user is already following this initiative.`);
        done();
      });
    });

    it("should remove a user tag if they were already following an initiative", done => {
      // mock two fetch calls...
      // user metadata
      fetchMock.post(
        `https://www.arcgis.com/sharing/rest/community/users/vader`,
        FOLLOWER
      );

      // user update
      fetchMock.post(
        `https://www.arcgis.com/sharing/rest/community/users/vader/update`,
        {
          success: true,
          username: "vader"
        }
      );

      // initiative fetch
      fetchMock.get(
        "https://www.arcgis.com/sharing/rest/content/items/fe8?f=json&token=fake-token",
        INITIATIVE_ITEM
      );
      fetchMock.get(
        "https://www.arcgis.com/sharing/rest/content/items/fe8/data?f=json&token=fake-token",
        {}
      );

      unfollowInitiative({
        initiativeId: `fe8`,
        ...MOCK_REQUEST_OPTIONS
      })
        .then(response => {
          // check that the mocks were called
          expect(fetchMock.done()).toBeTruthy();
          // inspect the POST call...
          const [metadataUrl, metadataOptions] = fetchMock.lastCall(
            `https://www.arcgis.com/sharing/rest/community/users/vader`
          );
          expect(metadataUrl).toEqual(metadataUrl);
          expect(metadataOptions.method).toBe("POST");
          expect(metadataOptions.body).toContain("f=json");
          expect(metadataOptions.body).toContain("token=fake-token");

          const [updateUrl, updateOptions] = fetchMock.lastCall(
            `https://www.arcgis.com/sharing/rest/community/users/vader/update`
          );
          expect(updateUrl).toEqual(updateUrl);
          expect(updateOptions.method).toBe("POST");
          expect(updateOptions.body).toContain("f=json");
          expect(updateOptions.body).toContain("token=fake-token");
          expect(updateOptions.body).toContain(
            `tags=${encodeURIComponent(",")}`
          );
          expect(response.success).toBe(true);
          done();
        })
        .catch(() => {
          fail();
        });
    });

    it("should remove a tag if they are already following and other tags are present", done => {
      // mock two fetch calls...
      // user metadata
      fetchMock.post(
        `https://www.arcgis.com/sharing/rest/community/users/vader`,
        ANOTHER_FOLLOWER
      );

      // user update
      fetchMock.post(
        `https://www.arcgis.com/sharing/rest/community/users/vader/update`,
        {
          success: true,
          username: "vader"
        }
      );

      // initiative fetch
      fetchMock.get(
        "https://www.arcgis.com/sharing/rest/content/items/fe8?f=json&token=fake-token",
        INITIATIVE_ITEM
      );
      fetchMock.get(
        "https://www.arcgis.com/sharing/rest/content/items/fe8/data?f=json&token=fake-token",
        {}
      );

      unfollowInitiative({
        initiativeId: `fe8`,
        ...MOCK_REQUEST_OPTIONS
      })
        .then(response => {
          // check that the mocks were called
          expect(fetchMock.done()).toBeTruthy();
          // inspect the POST call...
          const [metadataUrl, metadataOptions] = fetchMock.lastCall(
            `https://www.arcgis.com/sharing/rest/community/users/vader`
          );
          expect(metadataUrl).toEqual(metadataUrl);
          expect(metadataOptions.method).toBe("POST");
          expect(metadataOptions.body).toContain("f=json");
          expect(metadataOptions.body).toContain("token=fake-token");

          const [updateUrl, updateOptions] = fetchMock.lastCall(
            `https://www.arcgis.com/sharing/rest/community/users/vader/update`
          );
          expect(updateUrl).toEqual(updateUrl);
          expect(updateOptions.method).toBe("POST");
          expect(updateOptions.body).toContain("f=json");
          expect(updateOptions.body).toContain("token=fake-token");
          expect(updateOptions.body).toContain(
            `tags=${encodeURIComponent("I drive a Dodge Stratus")}`
          );
          expect(response.success).toBe(true);
          done();
        })
        .catch(() => {
          fail();
        });
    });

    it("should not add user tags if they are already following", done => {
      // mock two fetch calls...
      // user metadata
      fetchMock.post(
        `https://www.arcgis.com/sharing/rest/community/users/vader`,
        NON_FOLLOWER
      );

      // user update
      fetchMock.post(
        `https://www.arcgis.com/sharing/rest/community/users/vader/update`,
        {
          success: true,
          username: "vader"
        }
      );

      // initiative fetch
      fetchMock.get(
        "https://www.arcgis.com/sharing/rest/content/items/fe8?f=json&token=fake-token",
        INITIATIVE_ITEM
      );
      fetchMock.get(
        "https://www.arcgis.com/sharing/rest/content/items/fe8/data?f=json&token=fake-token",
        {}
      );

      unfollowInitiative({
        initiativeId: `fe8`,
        ...MOCK_REQUEST_OPTIONS
      }).catch(err => {
        expect(err).toBe(`user is not following this initiative.`);
        done();
      });
    });
  });

  describe("initiative with a followers group", () => {
    const NON_FOLLOWER: IUser = {
      username: "vader",
      fullName: "Anakin Skywalker",
      availableCredits: 54161.586,
      assignedCredits: -1,
      firstName: "Anakin",
      lastName: "Skywalker",
      preferredView: null,
      description: null,
      email: "darth@earthlink.net",
      idpUsername: null,
      favGroupId: "3746d652b4c44a3fa7b778631145298c",
      lastLogin: 1552516637000,
      mfaEnabled: false,
      access: "org",
      storageUsage: 1394828039,
      storageQuota: 2199023255552,
      orgId: "uCXeTVveQzP4IIcx",
      role: "org_user",
      privileges: [],
      level: "2",
      disabled: false,
      tags: [],
      culture: "en-US",
      region: "WO",
      units: "english",
      thumbnail: null,
      created: 1539911814000,
      modified: 1545167865000,
      provider: "arcgis",
      groups: []
    };

    const FOLLOWER: IUser = {
      username: "vader",
      fullName: "Anakin Skywalker",
      availableCredits: 54161.586,
      assignedCredits: -1,
      firstName: "Anakin",
      lastName: "Skywalker",
      preferredView: null,
      description: null,
      email: "darth@earthlink.net",
      idpUsername: null,
      favGroupId: "3746d652b4c44a3fa7b778631145298c",
      lastLogin: 1552516637000,
      mfaEnabled: false,
      access: "org",
      storageUsage: 1394828039,
      storageQuota: 2199023255552,
      orgId: "uCXeTVveQzP4IIcx",
      role: "org_user",
      privileges: [],
      level: "2",
      disabled: false,
      tags: [],
      culture: "en-US",
      region: "WO",
      units: "english",
      thumbnail: null,
      created: 1539911814000,
      modified: 1545167865000,
      provider: "arcgis",
      groups: [
        {
          id: "abc123",
          access: "public",
          title: "",
          autoJoin: true,
          created: 1234567,
          isFav: false,
          isInvitationOnly: false,
          isViewOnly: false,
          modified: 1234567,
          owner: "ldksjf",
          protected: true,
          tags: ["hubInitiativeFollowers|fe8"]
        }
      ]
    };

    const ANOTHER_FOLLOWER: IUser = {
      username: "vader",
      fullName: "Anakin Skywalker",
      availableCredits: 54161.586,
      assignedCredits: -1,
      firstName: "Anakin",
      lastName: "Skywalker",
      preferredView: null,
      description: null,
      email: "darth@earthlink.net",
      idpUsername: null,
      favGroupId: "3746d652b4c44a3fa7b778631145298c",
      lastLogin: 1552516637000,
      mfaEnabled: false,
      access: "org",
      storageUsage: 1394828039,
      storageQuota: 2199023255552,
      orgId: "uCXeTVveQzP4IIcx",
      role: "org_user",
      privileges: [],
      level: "2",
      disabled: false,
      tags: ["I drive a Dodge Stratus"],
      culture: "en-US",
      region: "WO",
      units: "english",
      thumbnail: null,
      created: 1539911814000,
      modified: 1545167865000,
      provider: "arcgis",
      groups: [
        {
          id: "def456",
          access: "public",
          title: "",
          autoJoin: true,
          created: 1234567,
          isFav: false,
          isInvitationOnly: false,
          isViewOnly: false,
          modified: 1234567,
          owner: "ldksjf",
          protected: true,
          tags: []
        },
        {
          id: "abc123",
          access: "public",
          title: "",
          autoJoin: true,
          created: 1234567,
          isFav: false,
          isInvitationOnly: false,
          isViewOnly: false,
          modified: 1234567,
          owner: "ldksjf",
          protected: true,
          tags: ["hubInitiativeFollowers|fe8"]
        }
      ]
    };

    const INITIATIVE_ITEM = {
      id: "",
      properties: {
        followersGroupId: "ghi789"
      }
    };

    it("should join the followers group if they arent already following", done => {
      // mock two fetch calls...
      // user metadata
      fetchMock.post(
        `https://www.arcgis.com/sharing/rest/community/users/vader`,
        NON_FOLLOWER
      );

      // initiative fetch
      fetchMock.get(
        "https://www.arcgis.com/sharing/rest/content/items/fe8?f=json&token=fake-token",
        INITIATIVE_ITEM
      );
      fetchMock.get(
        "https://www.arcgis.com/sharing/rest/content/items/fe8/data?f=json&token=fake-token",
        {}
      );

      fetchMock.post(
        "https://www.arcgis.com/sharing/rest/community/groups/ghi789/join",
        {
          success: true,
          groupId: "ghi789"
        }
      );

      followInitiative({
        initiativeId: `fe8`,
        ...MOCK_REQUEST_OPTIONS
      })
        .then(response => {
          const [updateUrl, updateOptions] = fetchMock.lastCall(
            `https://www.arcgis.com/sharing/rest/community/groups/ghi789/join`
          );
          expect(updateUrl).toEqual(updateUrl);
          expect(updateOptions.method).toBe("POST");
          expect(updateOptions.body).toContain("f=json");
          expect(updateOptions.body).toContain("token=fake-token");
          expect(response.success).toBe(true);
          done();
        })
        .catch(() => {
          fail();
        });
    });

    it("should not join the followers group if they are already following", done => {
      // mock two fetch calls...
      // user metadata
      fetchMock.post(
        `https://www.arcgis.com/sharing/rest/community/users/vader`,
        FOLLOWER
      );

      // initiative fetch
      fetchMock.get(
        "https://www.arcgis.com/sharing/rest/content/items/fe8?f=json&token=fake-token",
        INITIATIVE_ITEM
      );
      fetchMock.get(
        "https://www.arcgis.com/sharing/rest/content/items/fe8/data?f=json&token=fake-token",
        {}
      );

      followInitiative({
        initiativeId: `fe8`,
        ...MOCK_REQUEST_OPTIONS
      }).catch(err => {
        expect(err).toBe(`user is already following this initiative.`);
        done();
      });
    });

    it("should leave followers group if they were already following an initiative", done => {
      // mock two fetch calls...
      // user metadata
      fetchMock.post(
        `https://www.arcgis.com/sharing/rest/community/users/vader`,
        FOLLOWER
      );

      // initiative fetch
      fetchMock.get(
        "https://www.arcgis.com/sharing/rest/content/items/fe8?f=json&token=fake-token",
        INITIATIVE_ITEM
      );
      fetchMock.get(
        "https://www.arcgis.com/sharing/rest/content/items/fe8/data?f=json&token=fake-token",
        {}
      );

      fetchMock.post(
        "https://www.arcgis.com/sharing/rest/community/groups/ghi789/leave",
        {
          success: true,
          groupId: "ghi789"
        }
      );

      unfollowInitiative({
        initiativeId: `fe8`,
        ...MOCK_REQUEST_OPTIONS
      })
        .then(response => {
          // check that the mocks were called
          const [updateUrl, updateOptions] = fetchMock.lastCall(
            `https://www.arcgis.com/sharing/rest/community/groups/ghi789/leave`
          );
          expect(updateOptions.method).toBe("POST");
          expect(updateOptions.body).toContain("f=json");
          expect(updateOptions.body).toContain("token=fake-token");
          expect(response.success).toBe(true);
          done();
        })
        .catch(() => {
          fail();
        });
    });
  });
});
