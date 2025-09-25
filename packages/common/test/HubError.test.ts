import HubError from "../src/HubError";
import OperationStack from "../src/OperationStack";

describe("HubError: ", () => {
  it("has defaults", () => {
    const e = new HubError("Random");
    expect(e.name).toBe("HubError", "should have name");
    expect(e.operation).toBe("Random", "operation is required");
    expect(e.message).toBe("UNKNOWN_ERROR", "should have default message");
    expect(e.rootCause).not.toBeDefined(
      "should not have rootCause if not passed"
    );
    expect(e.stack).toBeDefined("should have a stack");
  });

  it("takes a message and rootError", () => {
    const root = new Error("This is the rootError");
    const e = new HubError("Random", "Whoopsie", root);
    expect(e.name).toBe("HubError", "should have name");
    expect(e.message).toBe("Whoopsie", "should have message");
    expect(e.rootCause).toBeDefined("should have rootCause");
    expect(e.stack).toBeDefined("should have a stack");
  });

  it("can attach a serialized OperationStack", () => {
    const stack = new OperationStack();
    const id = stack.start("someJob");
    stack.finish(id);
    stack.start("job-23");
    const e = new HubError("Random", "Has OpStack");
    e.operationStack = stack.serialize();
    expect(e.operationStack.operations.length).toBe(2, "should have two ops");
    expect(e.operationStack.operations[0]).not.toBe(
      stack.getCompleted()[0],
      "should not be a shared ref back to stack entries"
    );
  });
});
