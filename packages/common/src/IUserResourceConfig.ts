import type { UserResourceApp } from "./types";

// Passed into ContextManager, specifying what exchangeToken calls
// should be made

export interface IUserResourceConfig {
  app: UserResourceApp;
  clientId: string;
}
