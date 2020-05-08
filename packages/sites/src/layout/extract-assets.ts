import { ISettings } from "./types";

export const extractAssets = function extractAssets (obj : ISettings) : string[] {
  const assets = [];

  if (obj.fileSrc) {
    assets.push(obj.fileSrc);
  }

  if (obj.cropSrc) {
    assets.push(obj.cropSrc);
  }
  
  return assets;
};
