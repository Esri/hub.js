import { IChannel, IUpdateChannel } from "@esri/hub-common";

// TODO: V2 use IUpdateChannel as param type when hoisted to hub.js from service
export function dtoToChannel(dto: any): IChannel {
  const { channelAclDefinition, ...rest } = dto;

  return {
    ...rest,
    channelAcl: channelAclDefinition,
  };
}
