export enum DownloadStatus {
  READY = "ready",
  READY_UNKNOWN = "ready_unknown",
  STALE = "stale",
  NOT_READY = "not_ready",
  DISABLED = "disabled",
  CREATING = "creating",
  UPDATING = "updating",
  ERROR_CREATING = "error_creating",
  ERROR_UPDATING = "error_updating",
  ERROR = "error"
}

export type DownloadStatuses =
  | "ready"
  | "ready_unknown"
  | "stale"
  | "not_ready"
  | "disabled"
  | "creating"
  | "updating"
  | "error_creating"
  | "error_updating"
  | "error";
