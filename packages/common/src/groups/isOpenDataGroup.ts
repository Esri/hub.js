import { IGroup } from "@esri/arcgis-rest-types";

export const isOpenDataGroup = (group: IGroup) => !!group.isOpenData;
