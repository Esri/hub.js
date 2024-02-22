import {
  ICreateEventParams,
  IDeleteEventParams,
  IGetEventParams,
  IGetEventsParams,
  IUpdateEventParams,
  createEvent,
  deleteEvent,
  getEvent,
  getEvents,
  // updateEvent,
  IEvent,
  EventAttendanceType,
  EventStatus,
} from "../../../src/events/api";
import * as authenticateRequestModule from "../../../src/events/api/utils/authenticate-request";
import * as orvalModule from "../../../src/events/api/orval/api/orval-events";

describe("Events", () => {
  const token = "aaa";
  let authenticateRequestSpy: any;

  beforeEach(() => {
    authenticateRequestSpy = spyOn(
      authenticateRequestModule,
      "authenticateRequest"
    ).and.callFake(async () => token);
  });

  describe("createEvent", () => {
    it("should create an event", async () => {
      const mockEvent = { burrito: "supreme" } as unknown as IEvent;
      const createEventSpy = spyOn(orvalModule, "createEvent").and.callFake(
        async () => mockEvent
      );

      const options: ICreateEventParams = {
        data: {
          addresses: [
            {
              address: "111 Crunchy Street Bend, OR 97703",
              address2: "Room 203",
              capacity: 100,
              description: "Tacos are here",
              venue: "Taco Hall",
            },
          ],
          allDay: false,
          attendanceType: [
            EventAttendanceType.IN_PERSON,
            EventAttendanceType.VIRTUAL,
          ],
          description: "a description",
          endDateTime: "2023-12-19T19:52:13.584Z",
          geometry: {
            type: "Feature",
            geometry: { type: "Point", coordinates: [0, 0] },
            properties: {},
          },
          notifyAttendees: true,
          onlineMeetings: [
            {
              url: "https://www.esri.com",
              capacity: 50,
              details: "Tacos online are here",
            },
          ],
          startDateTime: "2023-12-01T19:52:13.584Z",
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
      const mockEvent = { burrito: "supreme" } as unknown as IEvent;
      const getEventSpy = spyOn(orvalModule, "getEvent").and.callFake(
        async () => mockEvent
      );

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

  describe("getEvents", () => {
    it("should get events", async () => {
      const mockEvent = { burrito: "supreme" } as unknown as IEvent;
      const getEventsSpy = spyOn(orvalModule, "getEvents").and.callFake(
        async () => [mockEvent]
      );

      const options: IGetEventsParams = {
        data: {
          startDateTimeBefore: "2024-02-19T21:52:29.525Z",
        },
      };

      const result = await getEvents(options);
      expect(result).toEqual([mockEvent]);

      expect(authenticateRequestSpy).toHaveBeenCalledWith(options);
      expect(getEventsSpy).toHaveBeenCalledWith(options.data, {
        ...options,
        token,
      });
    });
  });

  // describe("updateEvent", () => {
  //   it("should update an event", async () => {
  //     const mockEvent = { burrito: "supreme" } as unknown as IEvent;
  //     const updateEventSpy = spyOn(orvalModule, "updateEvent").and.callFake(
  //       async () => mockEvent
  //     );

  //     const options: IUpdateEventParams = {
  //       eventId: "111",
  //       data: { description: "a new description" },
  //     };

  //     const result = await updateEvent(options);
  //     // todo: remove when updateEvent return type is defined
  //     // @ts-ignore
  //     expect(result).toEqual(mockEvent);

  //     expect(authenticateRequestSpy).toHaveBeenCalledWith(options);
  //     expect(updateEventSpy).toHaveBeenCalledWith(
  //       options.eventId,
  //       options.data,
  //       { ...options, token }
  //     );
  //   });
  // });

  describe("deleteEvent", () => {
    it("should delete an event", async () => {
      const mockEvent = { burrito: "supreme" } as unknown as IEvent;
      const deleteEventSpy = spyOn(orvalModule, "deleteEvent").and.callFake(
        async () => mockEvent
      );

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
