/**
 * Interface for a reference to another value in the same object graph.
 * Can be used with `getProp(obj, ref.$use)` to get the value of the referenced property
 */

export interface IReference {
  $use: string;
}
