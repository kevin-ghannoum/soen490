import "reflect-metadata";
import { container } from "tsyringe";
import UserRepository from "../../main/repositories/UserRepository";
import { mock } from "jest-mock-extended";
import axios from "axios";
import { UserService } from "../../main/services/UserService";

// Creating a mock of axios library
jest.mock("axios");
// Due to typescript being strict we need to as axios as a jest mocked in order to mock the implementation.
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe("User service test example", () => {
  it("should be true", async () => {
    // Mocking UserRepository
    const userRepositoryMock = mock<UserRepository>();
    // Mocking return value
    userRepositoryMock.get.mockResolvedValue("Retrieve user test example");
    // Replacing UserRepository dependencies with mock such that it will be injected instead of the real module
    container.registerInstance(UserRepository, userRepositoryMock);
    mockedAxios.get.mockResolvedValue({ response: "A api response test" });

    // Calling the service which it's dependencies are properly mock (userRepository)
    const userService = container.resolve(UserService);
    const result = await userService.getUser("1");

    expect(result).toBe("Retrieve user test example");

    // Clearing the mock from container
    container.clearInstances();
  });

  // Example of testing a 3rd party module
  it("axios test", async () => {
    mockedAxios.get.mockResolvedValue({ response: "A api response test" });

    // What's happening here is that axios module is being mock
    // therefore all call to axios in the application code are mocked based on what we define

    expect(await axios.get("/a-url-endpoint")).toEqual({
      response: "A api response test",
    });
  });
});
