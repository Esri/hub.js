/**
 * Orval generates return types for functions using utility type Awaited
 * This was introduced in Typescript 4.5, but hub.js is using Typescript 3
 *
 * Replaces Awaited<ReturnType<T>> with AsyncReturnType<T>
 */
export type AsyncReturnType<T extends (...args: any) => any> = T extends (
  ...args: any
) => Promise<infer U>
  ? U
  : T extends (...args: any) => infer U
  ? U
  : any;
