import { IGroup } from "@esri/arcgis-rest-portal";
import { IUiSchemaComboboxItem } from "../types";

/**
 * Filter an array of groups into the set the user has the rights to share content
 * into, and then convert them to UiSchemaComboboxItem array for use in the Entity Editor component
 */
export function getSharableGroupsComboBoxItems(
  groups: IGroup[]
): IUiSchemaComboboxItem[] {
  return groups.reduce((groupItems: IUiSchemaComboboxItem[], group: IGroup) => {
    const isEditGroup = group.capabilities.includes("updateitemcontrol");
    const memberType = group.userMembership?.memberType;

    /**
     * a user can only share to a group if:
     * 1. the group is NOT view only
     * 2. their membership type in a view only group is "owner" or "admin"
     */
    const canShareToGroup =
      !group.isViewOnly ||
      (group.isViewOnly && ["owner", "admin"].includes(memberType));
    if (canShareToGroup) {
      groupItems.push({
        value: group.id,
        label: group.title,
        icon: isEditGroup ? "unlock" : "view-mixed",
      });
    }

    return groupItems;
  }, []);
}
