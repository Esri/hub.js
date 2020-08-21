export interface Poller {
  cancelPolling: boolean;
  cancel(): void;
  poll(params:any): void;
}