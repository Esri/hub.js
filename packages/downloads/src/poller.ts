export interface Poller {
  disablePoll(): void;
  activatePoll(params: any): void;
}