import {
  ICreateUserParams,
  IDeleteUserParams,
  IGetUserParams,
  IUpdateUserParams,
  IUser,
} from "../../../src/newsletters/api/types";
import * as authenticateRequestModule from "../../../src/newsletters/api/utils/authenticate-request";
import * as orvalModule from "../../../src/newsletters/api/orval/api/orval-newsletters";
import {
  createUser,
  deleteUser,
  getUser,
  updateUser,
} from "../../../src/newsletters/api/users";

describe("Users", () => {
  const token = "aaa";
  let authenticateRequestSpy: any;

  beforeEach(() => {
    authenticateRequestSpy = vi
      .spyOn(authenticateRequestModule, "authenticateRequest")
      .mockImplementation(async () => token);
  });

  describe("createUser", () => {
    it("should create a new user", async () => {
      const mockUser = { user: "mock" } as unknown as IUser;
      const createUserSpy = vi
        .spyOn(orvalModule, "createUser")
        .mockImplementation(async () => mockUser);

      const options: ICreateUserParams = {
        data: {},
      };

      const result = await createUser(options);
      expect(result).toEqual(mockUser);

      expect(authenticateRequestSpy).toHaveBeenCalledWith(options);
      expect(createUserSpy).toHaveBeenCalledWith(options.data, {
        ...options,
        token,
      });
    });
  });

  describe("getUser", () => {
    it("should get a user", async () => {
      const mockUser = { user: "mock" } as unknown as IUser;
      const getUserSpy = vi
        .spyOn(orvalModule, "getUser")
        .mockImplementation(async () => mockUser);

      const options: IGetUserParams = {
        userId: "111",
      };

      const result = await getUser(options);
      expect(result).toEqual(mockUser);

      expect(authenticateRequestSpy).toHaveBeenCalledWith(options);
      expect(getUserSpy).toHaveBeenCalledWith(options.userId, {
        ...options,
        token,
      });
    });
  });

  describe("updateUser", () => {
    it("should update a user", async () => {
      const mockUser = { user: "mock" } as unknown as IUser;
      const updateUserSpy = vi
        .spyOn(orvalModule, "updateUser")
        .mockImplementation(async () => mockUser);

      const options: IUpdateUserParams = {
        userId: "111",
        data: { email: "newemail@mock.com" },
      };

      const result = await updateUser(options);
      expect(result).toEqual(mockUser);

      expect(authenticateRequestSpy).toHaveBeenCalledWith(options);
      expect(updateUserSpy).toHaveBeenCalledWith(options.userId, options.data, {
        ...options,
        token,
      });
    });
  });

  describe("deleteUser", () => {
    it("should delete a user", async () => {
      const mockUser = { user: "mock" } as unknown as IUser;
      const deleteUserSpy = vi
        .spyOn(orvalModule, "deleteUser")
        .mockImplementation(async () => mockUser);

      const options: IDeleteUserParams = {
        userId: "111",
      };

      const result = await deleteUser(options);
      expect(result).toEqual(mockUser);

      expect(authenticateRequestSpy).toHaveBeenCalledWith(options);
      expect(deleteUserSpy).toHaveBeenCalledWith(options.userId, {
        ...options,
        token,
      });
    });
  });
});
