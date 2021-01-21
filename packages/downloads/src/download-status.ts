export type DownloadStatus =
  | "ready"
  | "ready_unknown"
  | "stale"
  | "not_ready"
  | "locked"
  | "stale_locked"
  | "creating"
  | "updating"
  | "error_creating"
  | "error_updating"
  | "error";
