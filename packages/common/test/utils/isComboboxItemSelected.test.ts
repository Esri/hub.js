import { IUiSchemaComboboxItem } from "../../src/core/schemas/types";
import { isComboboxItemSelected } from "../../src/utils/isComboboxItemSelected";

const nodes = [
  {
    value: "/Categories/Thing A",
    label: "Thing A",
  } as IUiSchemaComboboxItem,
  {
    value: "/Categories/Thing B",
    label: "Thing B",
    children: [
      {
        value: "/Categories/Thing B/Child of B",
        label: "Child of B",
      },
    ],
  } as IUiSchemaComboboxItem,
  {
    value: "/Categories/Thing C",
    label: "Thing C",
    children: [
      {
        value: "/Categories/Thing C/Child of C",
        label: "Child of C",
      } as IUiSchemaComboboxItem,
      {
        value: "/Categories/Thing C/Thing A", // note the duplicate label from before, but different value
        label: "Thing A",
      } as IUiSchemaComboboxItem,
    ],
  } as IUiSchemaComboboxItem,
];

describe("isComboboxItemSelected:", () => {
  it("will select top level node", async () => {
    const selected = ["/Categories/Thing A"];
    expect(isComboboxItemSelected(nodes[0], selected)).toBe(true);
    expect(isComboboxItemSelected(nodes[1], selected)).toBe(false);
    expect(isComboboxItemSelected(nodes[1].children![0], selected)).toBe(false);
    expect(isComboboxItemSelected(nodes[2], selected)).toBe(false);
    expect(isComboboxItemSelected(nodes[2].children![0], selected)).toBe(false);
    expect(isComboboxItemSelected(nodes[2].children![1], selected)).toBe(false);
  });

  it("will select child node and subsequently its parent node", async () => {
    const selected = ["/Categories/Thing B/Child of B"];
    expect(isComboboxItemSelected(nodes[0], selected)).toBe(false);
    expect(isComboboxItemSelected(nodes[1], selected)).toBe(true);
    expect(isComboboxItemSelected(nodes[1].children![0], selected)).toBe(true);
    expect(isComboboxItemSelected(nodes[2], selected)).toBe(false);
    expect(isComboboxItemSelected(nodes[2].children![0], selected)).toBe(false);
    expect(isComboboxItemSelected(nodes[2].children![1], selected)).toBe(false);
  });

  it("will check correct nodes even if there are two nodes with equal labels (but differing values)", async () => {
    const selected = ["/Categories/Thing C/Thing A"];
    expect(isComboboxItemSelected(nodes[0], selected)).toBe(false);
    expect(isComboboxItemSelected(nodes[1], selected)).toBe(false);
    expect(isComboboxItemSelected(nodes[1].children![0], selected)).toBe(false);
    expect(isComboboxItemSelected(nodes[2], selected)).toBe(true);
    expect(isComboboxItemSelected(nodes[2].children![0], selected)).toBe(false);
    expect(isComboboxItemSelected(nodes[2].children![1], selected)).toBe(true);
  });
});
