export interface Poller {
  disablePoll(): void; 

  /**
   * @ignore
   */
  activatePoll(params: any): void;
}