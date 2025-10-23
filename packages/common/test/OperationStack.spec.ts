import OperationStack from "../src/OperationStack";

describe("OperationStack", () => {
  it("new stack has no completed", () => {
    const stack = new OperationStack();
    expect(stack.getCompleted().length).toBe(0);
  });

  it("can add an operation and get it", () => {
    const stack = new OperationStack();
    const id = stack.start("foo");
    const op = stack.getOperation(id);
    expect(op.type).toBe("foo");
    expect(op.id).toBe(id);
  });

  it("start, finish and toString", () => {
    const stack = new OperationStack();
    stack.startOperation({
      id: "get-bc3",
      type: "getItem",
      inputs: { id: "bc3", owner: "vader" },
    });
    expect(stack.getCompleted().length).toBe(0);
    stack.finish("get-bc3", { newId: "33a" });
    const completed = stack.getCompleted();
    expect(completed.length).toBe(1);
    const op = completed[0];
    expect(op.id).toBe("get-bc3");
    expect(op.inputs).toBeDefined();
    expect(op.output.newId).toBeDefined();
    const output = stack.toString();
    expect(output).toContain("Operation get-bc3 took");
    expect(output).toContain("with inputs {");
    expect(output).toContain("and output {");
  });

  it("start, toString", () => {
    const stack = new OperationStack();
    stack.startOperation({
      id: "get-bc3",
      type: "getItem",
      inputs: { id: "bc3", owner: "vader" },
    });
    const output = stack.toString();
    expect(output).toContain("Operation get-bc3 started");
  });

  it("finish works without options", () => {
    const stack = new OperationStack();
    stack.startOperation({
      id: "get-bc3",
      type: "getItem",
      inputs: { id: "bc3", owner: "vader" },
    });
    stack.startOperation({
      id: "create-webmap",
      type: "createItem",
      inputs: { type: "Web Map", owner: "vader" },
    });
    expect(stack.getCompleted().length).toBe(0);
    stack.finish("get-bc3");
    const completed = stack.getCompleted();
    stack.finish("create-webmap");
    expect(completed.length).toBe(1);
    const op = completed[0];
    expect(op.id).toBe("get-bc3");
    expect(op.inputs).toBeDefined();
    expect(op.output).not.toBeDefined();
    const output = stack.toString();
    expect(output).toContain("Operation get-bc3 took");
    expect(output).toContain("with inputs {");
    expect(output).toContain("and output n/a");
    expect(output).toContain("Operation create-webmap took");
  });

  it("throws trying to finish non-existant operation", () => {
    const stack = new OperationStack();
    expect(() => stack.finish("not-real")).toThrow(Error);
  });

  it("getWorking returns empty array if no working ops", () => {
    const stack = new OperationStack();
    expect(Array.isArray(stack.getWorking())).toBe(true);
    expect(stack.getWorking().length).toBe(0);
  });

  it("can merge multiple stacks completed and working", () => {
    const mainStack = new OperationStack();
    mainStack.startOperation({
      id: "get-bc3",
      type: "getItem",
      inputs: { id: "bc3", owner: "vader" },
    });
    mainStack.finish("get-bc3");
    mainStack.startOperation({
      id: "create-webmap",
      type: "createItem",
      inputs: { type: "Web Map", owner: "vader" },
    });
    mainStack.finish("create-webmap");
    mainStack.startOperation({ id: "other-thing", type: "thing", inputs: {} });
    const deepStack = new OperationStack();
    deepStack.startOperation({
      id: "work-3ef",
      type: "createDashboardTemplate",
      inputs: { itemId: "3ef" },
    });
    deepStack.startOperation({
      id: "thumbnail-3ef",
      type: "getThumbnail",
      inputs: { itemId: "3ef" },
    });
    deepStack.finish("thumbnail-3ef");

    mainStack.merge(deepStack.serialize());
    const completed = mainStack.getCompleted();
    expect(completed.length).toBe(3);
    const working = mainStack.getWorking();
    expect(working.length).toBe(2);
  });
  it("merge stacks", () => {
    const stack = new OperationStack();
    stack.start("getItem", { id: "get-bc3" });
    stack.finish("get-bc3");
    stack.start("updateItem", { id: "update-bc3" });
    stack.finish("update-bc3");
    const otherStack = new OperationStack();
    otherStack.start("protectItem", { id: "protect-00c" });
    otherStack.finish("protect-00c");
    stack.merge(otherStack.serialize());
    expect(stack.getOperations().length).toBe(3);
  });
  it("can create an simple operation", () => {
    const mainStack = new OperationStack();
    const id = mainStack.start("getItem");
    expect(id).toBeDefined();
    expect(mainStack.getWorking().length).toBe(1);
    mainStack.finish(id);
    expect(mainStack.getWorking().length).toBe(0);
    expect(mainStack.getCompleted().length).toBe(1);
  });
  it("it orders operations in the messages", () => {
    const mainStack = new OperationStack();
    const id1 = mainStack.start("getItem");
    const id2 = mainStack.start("getItem2");
    const id3 = mainStack.start("getItem3");
    mainStack.getOperation(id2).startedAt = new Date().getTime() - 50000;
    mainStack.getOperation(id3).startedAt = new Date().getTime() + 50000;
    mainStack.finish(id1);
    mainStack.finish(id2);
    mainStack.finish(id3);
    const msg = mainStack.toString();
    expect(msg.indexOf(`getItem2_`)).toBeGreaterThan(msg.indexOf(`getItem1_`));
  });
});
