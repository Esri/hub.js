import type { IGroup } from "../rest/types";

export const isOpenDataGroup = (group: IGroup) => !!group.isOpenData;
