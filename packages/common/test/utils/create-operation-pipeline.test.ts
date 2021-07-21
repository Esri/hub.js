import {
  createOperationPipeline,
  IPipeable,
} from "../../src/utils/create-operation-pipeline";
import OperationStack from "../../src/OperationStack";
import { IHubRequestOptions } from "../../src/types";
import OperationError from "../../src/OperationError";
// Test Fakes
interface IFakeItem {
  id: string;
  name: string;
  owner: string;
  created: number;
  createdAt: Date;
  properties: Record<string, unknown>;
}

const delay = <T>(data: T, delayMs: number): Promise<T> =>
  new Promise((resolve) =>
    setTimeout(() => {
      return resolve(data);
    }, delayMs)
  );

const timeStampName = (
  input: IPipeable<Partial<IFakeItem>>
): Promise<IPipeable<Partial<IFakeItem>>> => {
  input.data.name = `${input.data.name}:${new Date().getTime()}`;
  const opId = input.stack.start("timeStampName");
  input.stack.finish(opId);
  return Promise.resolve(input);
};
const addCreatedAt = (
  input: IPipeable<Partial<IFakeItem>>
): Promise<IPipeable<Partial<IFakeItem>>> => {
  input.data.createdAt = new Date(input.data.created);
  const opId = input.stack.start("addCreatedAt");
  input.stack.finish(opId);
  return Promise.resolve(input);
};

const addProperties = (
  input: IPipeable<Partial<IFakeItem>>
): Promise<IPipeable<Partial<IFakeItem>>> => {
  input.data.properties = {
    foo: "bar",
    baz: {
      deep: "nesting",
    },
  };
  // each fn should create a new operation stack
  const s = new OperationStack();
  // add operations to it...
  const opId = s.start("addProperties");
  s.finish(opId);
  // then merge into the input stack at the end
  input.stack.merge(s.serialize());

  return Promise.resolve(input);
};

const addOwnerThrowsOpError = (
  input: IPipeable<Partial<IFakeItem>>
): Promise<IPipeable<Partial<IFakeItem>>> => {
  input.data.owner = "steve";
  const opId = input.stack.start("addOwnerThrowsOpError");

  const msg = `Some upstream error \n Operation Stack: \n ${input.stack.toString()}`;
  const err = new OperationError("addOwnerThrowsOpError", msg);
  err.operationStack = input.stack.serialize();

  return Promise.reject(err);
};

const addOwnerThrows = (
  input: IPipeable<Partial<IFakeItem>>
): Promise<IPipeable<Partial<IFakeItem>>> => {
  input.data.owner = "steve";
  const opId = input.stack.start("addOwnerThrows");
  return Promise.reject("Some random error");
};

const fetchOwner = (
  input: IPipeable<Partial<IFakeItem>>
): Promise<IPipeable<Partial<IFakeItem>>> => {
  input.data.owner = "steve";
  const opId = input.stack.start("fetchOwner");
  input.stack.finish(opId);
  return delay(input, 200);
};

// Fake request options
const ro = {} as unknown as IHubRequestOptions;

describe("createOperationPipeline:: ", () => {
  it("runs a single function", () => {
    const m = {
      name: "Foo",
      created: new Date().getTime() - 20000,
    } as Partial<IFakeItem>;
    const input = {
      data: m,
      stack: new OperationStack(),
    } as IPipeable<Partial<IFakeItem>>;
    const pipeline = createOperationPipeline([timeStampName]);
    return pipeline(input).then((result) => {
      expect(result.data.name.split(":")[1]).toBeGreaterThan(0);
    });
  });

  it("runs multiple functions", () => {
    const m = {
      name: "Foo",
      created: new Date().getTime() - 20000,
    } as Partial<IFakeItem>;
    const input = {
      data: m,
      stack: new OperationStack(),
      requestOptions: ro,
    } as IPipeable<Partial<IFakeItem>>;
    const pipeline = createOperationPipeline([
      timeStampName,
      addCreatedAt,
      addProperties,
      fetchOwner,
    ]);
    return pipeline(input).then((result) => {
      expect(result.data.name.split(":")[1]).toBeGreaterThan(0);
      expect(result.data.createdAt).not.toBeUndefined();
      expect(result.data.owner).not.toBeUndefined();
      expect(result.stack.getOperations().length).toBe(
        4,
        "should have 4 operations"
      );
    });
  });
  it("handles subfunction rejecting with OperationError", () => {
    const m = {
      name: "Foo",
      created: new Date().getTime() - 20000,
    } as Partial<IFakeItem>;
    const input = {
      data: m,
      stack: new OperationStack(),
      requestOptions: ro,
    } as IPipeable<Partial<IFakeItem>>;
    const pipeline = createOperationPipeline([
      timeStampName,
      addCreatedAt,
      addOwnerThrowsOpError,
      fetchOwner,
    ]);
    return pipeline(input).catch((err) => {
      expect(err.name).toBe(
        "OperationError",
        "Should reject with an OperationError"
      );
      expect(err.operationStack.operations.length).toBe(3);
      expect(err.message).toContain("Operation timeStampName");
      expect(err.message).toContain("Operation addCreatedAt");
      expect(err.message).toContain("Operation addOwnerThrowsOpError");
    });
  });
  it("handles subfunction rejecting without OperationError", () => {
    const m = {
      name: "Foo",
      created: new Date().getTime() - 20000,
    } as Partial<IFakeItem>;
    const input = {
      data: m,
      stack: new OperationStack(),
      requestOptions: ro,
    } as IPipeable<Partial<IFakeItem>>;
    const pipeline = createOperationPipeline([
      timeStampName,
      addCreatedAt,
      addOwnerThrows,
      fetchOwner,
    ]);
    return pipeline(input).catch((err) => {
      expect(err.name).toBe(
        "OperationError",
        "Should reject with an OperationError"
      );
      expect(err.operationStack.operations.length).toBe(3);
      expect(err.message).toContain("Operation timeStampName");
      expect(err.message).toContain("Operation addCreatedAt");
      expect(err.message).toContain("Operation addOwnerThrows");
    });
  });
});
