import { b } from "./b";

export function a(): void {
  if (Date.now() === 0) {
    b();
  }
}
