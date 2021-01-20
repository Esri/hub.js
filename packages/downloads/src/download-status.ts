export type DownloadStatus =
  | "ready"
  | "ready_unknown"
  | "stale"
  | "not_ready"
  | "locked"
  | "locked_stale"
  | "creating"
  | "updating"
  | "error_creating"
  | "error_updating"
  | "error";
