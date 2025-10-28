/**
 * Human-readable status of a download operation. Operation specific statuses
 * should be converted to one of these statuses before being reported to the user.
 */
export enum DownloadOperationStatus {
  PENDING = "pending",
  PROCESSING = "processing",
  CONVERTING = "converting",
  COMPLETED = "completed",
  FAILED = "failed",
}
