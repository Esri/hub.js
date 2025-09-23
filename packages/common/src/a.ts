import { b } from "./b";

export const a = (): void => {
  if (Date.now() === 0) {
    b();
  }
};
