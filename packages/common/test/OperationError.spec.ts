import OperationError from "../src/OperationError";
import OperationStack from "../src/OperationStack";

describe("OperationError: ", () => {
  it("is has defaults", () => {
    const e = new OperationError("Random");
    expect(e.name).toBe("OperationError");
    expect(e.operation).toBe("Random");
    expect(e.message).toBe("UNKNOWN_ERROR");
    expect(e.rootCause).not.toBeDefined();
    expect(e.stack).toBeDefined();
  });
  it("takes a message and rootError", () => {
    const root = new Error("This is the rootError");
    const e = new OperationError("Random", "Whoopsie", root);
    expect(e.name).toBe("OperationError");
    expect(e.message).toBe("Whoopsie");
    expect(e.rootCause).toBeDefined();
    expect(e.stack).toBeDefined();
  });
  it("can attach a serialized OperationStack", () => {
    const stack = new OperationStack();
    const id = stack.start("someJob");
    stack.finish(id);
    stack.start("job-23");
    const e = new OperationError("Random", "Has OpStack");
    e.operationStack = stack.serialize();
    expect(e.operationStack.operations.length).toBe(2);
    expect(e.operationStack.operations[0]).not.toBe(stack.getCompleted()[0]);
  });
});
