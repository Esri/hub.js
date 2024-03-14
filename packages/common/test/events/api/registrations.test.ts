import {
  ICreateRegistrationParams,
  IDeleteRegistrationParams,
  IGetRegistrationParams,
  IUpdateRegistrationParams,
  createRegistration,
  deleteRegistration,
  getRegistration,
  updateRegistration,
  IRegistration,
  RegistrationRole,
  RegistrationStatus,
  EventAttendanceType,
} from "../../../src/events/api";
import * as authenticateRequestModule from "../../../src/events/api/utils/authenticate-request";
import * as orvalModule from "../../../src/events/api/orval/api/orval-events";

describe("Registrations", () => {
  const token = "aaa";
  let authenticateRequestSpy: any;

  beforeEach(() => {
    authenticateRequestSpy = spyOn(
      authenticateRequestModule,
      "authenticateRequest"
    ).and.callFake(async () => token);
  });

  describe("createRegistration", () => {
    it("should create a registration", async () => {
      const mockRegistration = {
        burrito: "supreme",
      } as unknown as IRegistration;
      const createRegistrationSpy = spyOn(
        orvalModule,
        "createRegistration"
      ).and.callFake(async () => mockRegistration);

      const options: ICreateRegistrationParams = {
        token,
        data: {
          eventId: "111",
          role: RegistrationRole.ATTENDEE,
          type: EventAttendanceType.IN_PERSON,
        },
      };

      const result = await createRegistration(options);
      expect(result).toEqual(mockRegistration);

      expect(authenticateRequestSpy).toHaveBeenCalledWith(options);
      expect(createRegistrationSpy).toHaveBeenCalledWith(options.data, {
        ...options,
        token,
      });
    });
  });

  describe("getRegistration", () => {
    it("should get an event", async () => {
      const mockRegistration = {
        burrito: "supreme",
      } as unknown as IRegistration;
      const getRegistrationSpy = spyOn(
        orvalModule,
        "getRegistration"
      ).and.callFake(async () => mockRegistration);

      const options: IGetRegistrationParams = {
        registrationId: 111,
      };

      const result = await getRegistration(options);
      expect(result).toEqual(mockRegistration);

      expect(authenticateRequestSpy).toHaveBeenCalledWith(options);
      expect(getRegistrationSpy).toHaveBeenCalledWith(options.registrationId, {
        ...options,
        token,
      });
    });
  });

  describe("updateRegistration", () => {
    it("should update an event", async () => {
      const mockRegistration = {
        burrito: "supreme",
      } as unknown as IRegistration;
      const updateRegistrationSpy = spyOn(
        orvalModule,
        "updateRegistration"
      ).and.callFake(async () => mockRegistration);

      const options: IUpdateRegistrationParams = {
        registrationId: 111,
        data: {
          role: RegistrationRole.ORGANIZER,
          status: RegistrationStatus.DECLINED,
          type: EventAttendanceType.VIRTUAL,
        },
      };

      const result = await updateRegistration(options);
      expect(result).toEqual(mockRegistration);

      expect(authenticateRequestSpy).toHaveBeenCalledWith(options);
      expect(updateRegistrationSpy).toHaveBeenCalledWith(
        options.registrationId,
        options.data,
        { ...options, token }
      );
    });
  });

  describe("deleteRegistration", () => {
    it("should delete an event", async () => {
      const mockRegistration = {
        burrito: "supreme",
      } as unknown as IRegistration;
      const deleteRegistrationSpy = spyOn(
        orvalModule,
        "deleteRegistration"
      ).and.callFake(async () => mockRegistration);

      const options: IDeleteRegistrationParams = {
        registrationId: 111,
      };

      const result = await deleteRegistration(options);
      expect(result).toEqual(mockRegistration);

      expect(authenticateRequestSpy).toHaveBeenCalledWith(options);
      expect(deleteRegistrationSpy).toHaveBeenCalledWith(
        options.registrationId,
        { ...options, token }
      );
    });
  });
});
