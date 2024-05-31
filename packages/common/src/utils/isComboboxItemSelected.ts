import { IUiSchemaComboboxItem } from "../core/schemas/types";

/**
 * To be used with combobox items; determines if a given combobox item is selected
 * @param node the combo box item (to possible check)
 * @param values the selected values in the greater combobox options
 * @returns whether or not the combo box item is selected
 */
export function isComboboxItemSelected(
  node: IUiSchemaComboboxItem,
  values: string[]
): boolean {
  return (
    values.includes(node.value) || // if this node is selected
    (!!node.children?.length &&
      node.children.some((child: IUiSchemaComboboxItem) =>
        isComboboxItemSelected(child, values)
      ))
  ); // or any of its children are selected
}
