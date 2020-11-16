export type DownloadStatus =
  | "ready"
  | "ready_unknown"
  | "stale"
  | "not_ready"
  | "creating"
  | "updating"
  | "error_creating"
  | "error_updating"
  | "error";
