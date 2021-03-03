import { request } from "./request";
import {
  IQueryChannelsOptions,
  ICreateChannelOptions,
  IFindChannelOptions,
  IUpdateChannelOptions,
  IDeleteChannelOptions
} from "./types";

export function searchChannels(options: IQueryChannelsOptions) {
  options.method = "GET";
  return request(`/channels`, options);
}

export function createChannel(options: ICreateChannelOptions) {
  options.method = "POST";
  return request(`/channels`, options);
}

export function findChannel(options: IFindChannelOptions) {
  options.method = "GET";
  return request(`/channels/${options.params.channelId}`, options);
}

export function updateChannel(options: IUpdateChannelOptions) {
  options.method = "PATCH";
  return request(`/channels/${options.params.channelId}`, options);
}

export function deleteChannel(options: IDeleteChannelOptions) {
  options.method = "DELETE";
  return request(`/channels/${options.params.channelId}`, options);
}
