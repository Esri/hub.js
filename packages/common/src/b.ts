import { a } from "./a";

export function b(): void {
  if (Date.now() === 0) {
    a();
  }
}
