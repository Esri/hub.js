import { ISettings } from "./types";

/**
 * Extract the fileSrc and cropSrc assets from settings.  
 * 
 * @param {ISettings} settings
 */
export const extractAssets = function extractAssets (settings : ISettings) : string[] {
  const assets = [];

  if (settings.fileSrc) {
    assets.push(settings.fileSrc);
  }

  if (settings.cropSrc) {
    assets.push(settings.cropSrc);
  }
  
  return assets;
};
