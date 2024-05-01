import { eventAttendeeToSearchResult } from "../../../../src/events/api/utils/search";
import {
  registration,
  user,
} from "../../../search/_internal/mocks/getRegistrationsResponse";
import * as arcgisRestPortal from "@esri/arcgis-rest-portal";

describe("event search utils", () => {
  describe("eventAttendeeToSearchResult", () => {
    it("should convert attendee to search result", async () => {
      spyOn(arcgisRestPortal, "getUser").and.returnValue(user);
      const attendee = registration.items[0];
      const result = await eventAttendeeToSearchResult(attendee);
      expect(result).toEqual({
        ...attendee,
        id: String(attendee.id),
        name: "John Green",
        createdDate: new Date(attendee.createdAt),
        createdDateSource: "attendee.createdAt",
        updatedDate: new Date(attendee.updatedAt),
        updatedDateSource: "attendee.updatedAt",
        access: "private",
        type: "Event Attendee",
        family: "eventAttendees",
        rawResult: attendee,
      });
    });
  });
});
