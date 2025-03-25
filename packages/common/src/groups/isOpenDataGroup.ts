import type { IGroup } from "@esri/arcgis-rest-portal";

export const isOpenDataGroup = (group: IGroup) => !!group.isOpenData;
