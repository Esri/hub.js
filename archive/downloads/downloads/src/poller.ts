export interface IPoller {
  disablePoll(): void;

  /**
   * @ignore
   */
  activatePoll(params: any): void;
}
