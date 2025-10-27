import { _checkStatusAndParseJson } from "../../../src/sites/domains/_check-status-and-parse-json";
import {
  describe,
  it,
  expect,
  afterEach,
  vi,
} from "vitest";

describe("_checkStatusAndParseJson", function () {
  afterEach(() => vi.restoreAllMocks());

  it("resolves with JSON when success", async function () {
    const res = {
      status: 200,
      json: () => {
        return {};
      },
    } as Response;
    vi.spyOn(res, "json").mockReturnValue(
      Promise.resolve({ message: "my json response" }) as any
    );

    const result = await _checkStatusAndParseJson(res);
    expect(result.message).toBe("my json response");
  });

  it("rejects with error when fail with message", async function () {
    const jsonRes: any = {
      error: {
        title: "title",
        detail: "an error",
      },
    };

    const res = {
      status: 404,
      json: () => {
        return {};
      },
    } as Response;
    vi.spyOn(res, "json").mockImplementation(
      () => Promise.resolve(jsonRes) as any
    );

    await expect(_checkStatusAndParseJson(res)).rejects.toThrow(
      "title :: an error :: 404"
    );
  });

  it("rejects with error when fail", async function () {
    const jsonRes: any = {};

    const res = {
      status: 404,
      json: () => {
        return {};
      },
    } as Response;
    vi.spyOn(res, "json").mockImplementation(
      () => Promise.resolve(jsonRes) as any
    );

    await expect(_checkStatusAndParseJson(res)).rejects.toBeDefined();
  });
});
