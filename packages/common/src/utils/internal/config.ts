import { IHubConfig } from "../IHubConfig";

// the default settings
const DEFAULT_CONFIG: IHubConfig = {
  logLevel: "error",
};

// the global variable name that consumers use to override the defaults
const GLOBAL_VARIABLE_NAME = "arcgisHubConfig";

// merge consumer supplied config (if any) with the defaults
const config = {
  ...DEFAULT_CONFIG,
  ...(globalThis as any)[GLOBAL_VARIABLE_NAME],
} as IHubConfig;

// export the settings as immutable consts
export const logLevel = config.logLevel;
