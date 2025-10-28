import { describe, it, expect, afterEach, vi } from "vitest";

// make ESM named-exports spyable
vi.mock("@esri/arcgis-rest-portal", async (importOriginal) => ({
  ...(await importOriginal()),
}));

import { IUser } from "@esri/arcgis-rest-portal";
import { AccessLevel } from "../../../../src/core/types/types";
import { eventAttendeeToSearchResult } from "../../../../src/search/_internal/hubEventsHelpers/eventAttendeeToSearchResult";
import * as arcgisRestPortal from "@esri/arcgis-rest-portal";
import {
  EventAttendanceType,
  IPagedRegistrationResponse,
  RegistrationRole,
  RegistrationStatus,
} from "../../../../src/events/api/types";
import { IHubSearchOptions } from "../../../../src/search/types/IHubSearchOptions";

describe("event search utils", () => {
  afterEach(() => vi.restoreAllMocks());

  describe("eventAttendeeToSearchResult", () => {
    const registration: IPagedRegistrationResponse = {
      items: [
        {
          createdAt: "2024-04-17T15:30:42+0000",
          createdById: "a creator id",
          eventId: "an event id",
          id: "0",
          permission: {
            canDelete: true,
            canEdit: true,
          },
          role: RegistrationRole.OWNER,
          status: RegistrationStatus.PENDING,
          type: EventAttendanceType.VIRTUAL,
          updatedAt: "2024-04-17T15:30:42+0000",
          userId: "a user id",
        },
      ],
      nextStart: -1,
      total: 1,
    };

    const user: IUser = {
      access: "private",
      email: "anemail@server.com",
      firstName: "John",
      lastName: "Green",
      fullName: "John Green",
      username: "fishingboatproceeds",
      thumbnail: "a_thumbnail_id",
    } as any;

    it("should convert attendee to search result", async () => {
      vi.spyOn(arcgisRestPortal, "getUser").mockReturnValue(user as any);
      const attendee = registration.items[0];
      const options: IHubSearchOptions = {
        requestOptions: {
          portal: "https://www.arcgis.com",
          authentication: {
            token: "abc",
          },
        },
      } as any;
      const result = await eventAttendeeToSearchResult(attendee, options);
      expect(result).toEqual({
        id: attendee.id.toString(),
        access: user.access as AccessLevel,
        name: user.fullName as any,
        createdDate: new Date(attendee.createdAt),
        createdDateSource: "attendee.createdAt",
        updatedDate: new Date(attendee.updatedAt),
        updatedDateSource: "attendee.updatedAt",
        type: "Event Attendee",
        family: "eventAttendee",
        owner: user.username,
        rawResult: attendee,
        links: {
          self: "https://www.arcgis.com/home/user.html?user=fishingboatproceeds",
          siteRelative: `/people/${user.username}`,
          thumbnail:
            "https://www.arcgis.com/community/users/fishingboatproceeds/info/a_thumbnail_id?token=abc",
        },
      });
    });

    it("should handle thumbnail when token is null", async () => {
      vi.spyOn(arcgisRestPortal, "getUser").mockReturnValue(user as any);
      const options: IHubSearchOptions = {
        requestOptions: {
          portal: "https://www.arcgis.com",
        },
      } as any;
      const result = await eventAttendeeToSearchResult(
        registration.items[0],
        options
      );
      expect(result.links?.thumbnail).toEqual(
        "https://www.arcgis.com/community/users/fishingboatproceeds/info/a_thumbnail_id"
      );
    });

    it("should handle when thumbnail is null", async () => {
      vi.spyOn(arcgisRestPortal, "getUser").mockReturnValue({
        ...user,
        thumbnail: undefined,
      } as any);
      const options: IHubSearchOptions = {
        requestOptions: {
          portal: "https://www.arcgis.com",
          authentication: {
            token: "abc",
          },
        },
      } as any;
      const result = await eventAttendeeToSearchResult(
        registration.items[0],
        options
      );
      expect(result.links?.thumbnail).toBeFalsy();
    });
  });
});
