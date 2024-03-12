/**
 * Orval generates return types for functions using utility type Awaited
 * This was introduced in Typescript 4.5, but hub.js is using Typescript 3
 */
export type Awaited<T> = T extends PromiseLike<infer U> ? U : T;
