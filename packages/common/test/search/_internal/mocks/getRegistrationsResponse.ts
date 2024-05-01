import { IUser } from "@esri/arcgis-rest-portal";
import {
  EventAttendanceType,
  IPagedRegistrationResponse,
  RegistrationRole,
  RegistrationStatus,
} from "../../../../src/events/api";

export const registration: IPagedRegistrationResponse = {
  items: [
    {
      createdAt: "2024-04-17T15:30:42+0000",
      createdById: "a creator id",
      eventId: "an event id",
      id: 0,
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

export const user: IUser = {
  access: "private",
  email: "anemail@server.com",
  firstName: "John",
  lastName: "Green",
  fullName: "John Green",
  username: "fishingboatproceeds",
};
