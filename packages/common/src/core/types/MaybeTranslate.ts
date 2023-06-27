/**
 * Type that could be a string or an object with key property to be used for translation
 */
export type MaybeTranslate = string | { key: string };

/**
 * Type that can be used to wrap a type to
 * add MaybeTranslate to all string properties
 */
export type Translatable<T> = {
  [P in keyof T]: T[P] extends string ? T[P] | MaybeTranslate : T[P];
};
