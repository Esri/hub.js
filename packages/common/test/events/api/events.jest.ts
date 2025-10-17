import * as authenticateRequestModule from "../../../src/events/api/utils/authenticate-request";
import * as orvalModule from "../../../src/events/api/orval/api/orval-events";
import {
  ICreateEventParams,
  IDeleteEventParams,
  IGetEventParams,
  ISearchEventsParams,
  IUpdateEventParams,
} from "../../../src/events/api/types";
import {
  createEvent,
  deleteEvent,
  getEvent,
  searchEvents,
  updateEvent,
} from "../../../src/events/api/events";

describe("Events", () => {
  const token = "aaa";
  let authenticateRequestSpy: any;

  beforeEach(() => {
    authenticateRequestSpy = jest
      .spyOn(authenticateRequestModule, "authenticateRequest")
      .mockImplementation(async () => token);
  });

  describe("createEvent", () => {
    it("should create an event", async () => {
      const mockEvent = { burrito: "supreme" } as unknown as orvalModule.IEvent;
      const createEventSpy = jest
        .spyOn(orvalModule, "createEvent")
        .mockImplementation(async () => mockEvent);

      const options: ICreateEventParams = {
        data: {
          access: orvalModule.EventAccess.ORG,
          allDay: false,
          attendanceType: [
            orvalModule.EventAttendanceType.IN_PERSON,
            orvalModule.EventAttendanceType.VIRTUAL,
          ],
          description: "a description",
          editGroups: ["111"],
          endDate: "2023-12-01",
          endTime: "11:30:00",
          inPersonCapacity: 50,
          location: {
            addNum: "111",
            city: "Bend",
            cntryName: "Mexico",
            geometries: [{ x: 50, y: 100, spatialReference: { wkid: 4326 } }],
            nbrhd: "Old Mill",
            placeAddr:
              "111 Taco Blvd S, Bend, District of Somewhere Else, 97703",
            placeName: "The Burrito House",
            postal: 97703,
            region: "District of Somewhere Else",
            stDir: "S",
            stName: "Taco",
            stType: "Blvd",
            subRegion: "District of Somewhere Else",
            type: orvalModule.EventLocationType.custom,
          },
          notifyAttendees: true,
          onlineMeeting: {
            url: "https://www.esri.com",
            capacity: 50,
            details: "Tacos online are here",
          },
          readGroups: ["111"],
          startDate: "2023-12-01",
          startTime: "10:30:00",
          summary: "a summary",
          timeZone: "America/Los_Angeles",
          title: "a title",
        },
      };

      const result = await createEvent(options);
      expect(result).toEqual(mockEvent);

      expect(authenticateRequestSpy).toHaveBeenCalledWith(options);
      expect(createEventSpy).toHaveBeenCalledWith(options.data, {
        ...options,
        token,
      });
    });
  });

  describe("getEvent", () => {
    it("should get an event", async () => {
      const mockEvent = { burrito: "supreme" } as unknown as orvalModule.IEvent;
      const getEventSpy = jest
        .spyOn(orvalModule, "getEvent")
        .mockImplementation(async () => mockEvent);

      const options: IGetEventParams = {
        eventId: "111",
      };

      const result = await getEvent(options);
      expect(result).toEqual(mockEvent);

      expect(authenticateRequestSpy).toHaveBeenCalledWith(options);
      expect(getEventSpy).toHaveBeenCalledWith(options.eventId, {
        ...options,
        token,
      });
    });
  });

  describe("searchEvents", () => {
    it("should search events", async () => {
      const mockEvent = { burrito: "supreme" } as unknown as orvalModule.IEvent;
      const pagedResponse = {
        total: 1,
        nextStart: 2,
        items: [mockEvent],
      };
      const searchEventsSpy = jest
        .spyOn(orvalModule, "searchEvents")
        .mockImplementation(async () => pagedResponse);

      const options: ISearchEventsParams = {
        data: {
          startDateTimeBefore: "2024-02-19T21:52:29.525Z",
        },
      };

      const result = await searchEvents(options);
      expect(result).toEqual(pagedResponse);

      expect(authenticateRequestSpy).toHaveBeenCalledWith(options);
      expect(searchEventsSpy).toHaveBeenCalledWith(options.data, {
        ...options,
        token,
      });
    });
  });

  describe("updateEvent", () => {
    it("should update an event", async () => {
      const mockEvent = { burrito: "supreme" } as unknown as orvalModule.IEvent;
      const updateEventSpy = jest
        .spyOn(orvalModule, "updateEvent")
        .mockImplementation(async () => mockEvent);

      const options: IUpdateEventParams = {
        eventId: "111",
        data: { description: "a new description" },
      };

      const result = await updateEvent(options);
      expect(result).toEqual(mockEvent);

      expect(authenticateRequestSpy).toHaveBeenCalledWith(options);
      expect(updateEventSpy).toHaveBeenCalledWith(
        options.eventId,
        options.data,
        { ...options, token }
      );
    });
  });

  describe("deleteEvent", () => {
    it("should delete an event", async () => {
      const mockEvent = { burrito: "supreme" } as unknown as orvalModule.IEvent;
      const deleteEventSpy = jest
        .spyOn(orvalModule, "deleteEvent")
        .mockImplementation(async () => mockEvent);

      const options: IDeleteEventParams = {
        eventId: "111",
      };

      const result = await deleteEvent(options);
      expect(result).toEqual(mockEvent);

      expect(authenticateRequestSpy).toHaveBeenCalledWith(options);
      expect(deleteEventSpy).toHaveBeenCalledWith(options.eventId, {
        ...options,
        token,
      });
    });
  });
});
