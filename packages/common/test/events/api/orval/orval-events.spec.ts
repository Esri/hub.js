import { describe, it, expect, vi, afterEach } from "vitest";
import * as mod from "../../../../src/events/api/orval/api/orval-events";

afterEach(() => vi.restoreAllMocks());

describe("orval events wrappers execute", () => {
  it("calls several wrapper functions", async () => {
    const okResp = { items: [], nextStart: 0, total: 0 };
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => okResp,
        statusText: "OK",
        status: 200,
      })
    );

    // call a subset of wrapper functions
    await mod.searchEvents({}, { hubApiUrl: "https://api.test" });
    await mod.getRegistrations({}, { hubApiUrl: "https://api.test" });
    await mod.getRegistration("1", { hubApiUrl: "https://api.test" });
    await mod.updateRegistration("1", {}, { hubApiUrl: "https://api.test" });
    await mod.deleteRegistration("1", { hubApiUrl: "https://api.test" });
    await mod.createEvent(
      {
        title: "t",
        startDate: "2020-01-01",
        startTime: "00:00:00",
        endDate: "2020-01-01",
        endTime: "01:00:00",
        timeZone: "UTC",
      },
      { hubApiUrl: "https://api.test" }
    );
    await mod.getEvent("1", { hubApiUrl: "https://api.test" });
    await mod.updateEvent("1", {}, { hubApiUrl: "https://api.test" });
    await mod.deleteEvent("1", { hubApiUrl: "https://api.test" });
    await mod.createRegistration(
      { eventId: "1", type: mod.EventAttendanceType.VIRTUAL },
      { hubApiUrl: "https://api.test" }
    );

    const fetchMock = (globalThis as any).fetch;
    expect(fetchMock).toHaveBeenCalled();
  });
});

describe("orval events enums and exports coverage", () => {
  it("touches enums and exported functions", () => {
    // Access a few enums to trigger their runtime initialization
    expect((mod as any).RegistrationRole.OWNER).toBe("OWNER");
    expect((mod as any).EventAttendanceType.VIRTUAL).toBe("VIRTUAL");
    expect((mod as any).EventLocationType.item).toBe("item");
    expect((mod as any).EventAccess.PUBLIC).toBe("PUBLIC");

    // Ensure wrapper functions exist
    [
      "createEvent",
      "searchEvents",
      "getEvent",
      "updateEvent",
      "deleteEvent",
      "createRegistration",
      "getRegistrations",
      "getRegistration",
      "updateRegistration",
      "deleteRegistration",
    ].forEach((fn) => {
      expect(typeof (mod as any)[fn]).toBe("function");
    });

    // enumerate keys to execute any other top-level code
    const keys = Object.keys(mod as any);
    expect(keys.length).toBeGreaterThan(10);
  });
});
