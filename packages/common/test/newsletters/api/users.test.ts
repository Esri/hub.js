import {
  ICreateUserParams,
  IDeleteUserParams,
  IGetUserParams,
  IUpdateUserParams,
  IUser,
  createUser,
  deleteUser,
  getUser,
  updateUser,
} from "../../../src/newsletters/api";
import * as authenticateRequestModule from "../../../src/newsletters/api/utils/authenticate-request";
import * as orvalModule from "../../../src/newsletters/api/orval/api/orval-newsletters";

describe("Users", () => {
  const token = "aaa";
  let authenticateRequestSpy: any;

  beforeEach(() => {
    authenticateRequestSpy = spyOn(
      authenticateRequestModule,
      "authenticateRequest"
    ).and.callFake(async () => token);
  });

  describe("createUser", () => {
    it("should create a new user", async () => {
      const mockUser = { user: "mock" } as unknown as IUser;
      const createUserSpy = spyOn(orvalModule, "createUser").and.callFake(
        async () => mockUser
      );

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
      const getUserSpy = spyOn(orvalModule, "getUser").and.callFake(
        async () => mockUser
      );

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
      const updateUserSpy = spyOn(orvalModule, "updateUser").and.callFake(
        async () => mockUser
      );

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
      const deleteUserSpy = spyOn(orvalModule, "deleteUser").and.callFake(
        async () => mockUser
      );

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
