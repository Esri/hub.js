import { IHubConfig } from "../IHubConfig";

// the default settings
const DEFAULT_CONFIG: IHubConfig = {
  logLevel: "info",
};

// the global variable name that consumers use to override the defaults
const GLOBAL_VARIABLE_NAME = "arcgisHubConfig";

// NOTE: we want to move to a config that is read-only
// once it has been initialized from the above global variable
// see https://devtopia.esri.com/dc/hub/issues/10713#issuecomment-5337749
// but for now we have to support the deprecated Logger.setLogLevel()
// so we need these temporary functions to get/set config settings

export const _getConfigSetting = (key: keyof IHubConfig) => {
  const config = {
    ...DEFAULT_CONFIG,
    ...(globalThis as any)[GLOBAL_VARIABLE_NAME],
  } as IHubConfig;
  return config && config[key];
};

export const _setConfigSetting = (key: keyof IHubConfig, value: any) => {
  const config = (globalThis as any)[GLOBAL_VARIABLE_NAME] as IHubConfig;
  if (!config) {
    (globalThis as any)[GLOBAL_VARIABLE_NAME] = {};
  }
  (globalThis as any)[GLOBAL_VARIABLE_NAME][key] = value;
};

// TODO: once we remove Logger.setLogLevel() we should
// replace the above functions with the following:

// merge consumer supplied config (if any) with the defaults
// const config = {
//   ...DEFAULT_CONFIG,
//   ...(globalThis as any)[GLOBAL_VARIABLE_NAME]
// } as IHubConfig;

// export the settings as immutable consts
// export const logLevel = config.logLevel;
