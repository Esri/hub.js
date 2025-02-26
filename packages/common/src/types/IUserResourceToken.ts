import type { IUserResourceConfig } from "./IUserResourceConfig";

// After exchangeToken call is successful, this is the structure
// stored in the context.userResourceTokens prop

export interface IUserResourceToken extends IUserResourceConfig {
  token: string;
}
