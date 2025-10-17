/**
 * Base interface for migratable schemas
 */
export interface IMigratableSchema {
  schemaVersion?: number;
}

/**
 * Interface representing a map of key/value pairs where the key represents the output schema version
 * and the value represents a transform function that returns an object for that schema version.
 */
export type MigratableSchemaTransformMap = Record<
  string,
  (input: IMigratableSchema) => IMigratableSchema | Promise<IMigratableSchema>
>;
