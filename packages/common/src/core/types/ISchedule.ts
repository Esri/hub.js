export type Cadence = "daily" | "weekly" | "monthly" | "annually";
export type SchedulerOptionType = Cadence | "automatic" | "manual";

/**
 * Schedule's mode
 * - scheduled: the update occurs on a schedule set by the user
 * - automatic: the update occurs with the nightly reharvest OR when metadata changes
 * - manual: the update occurs when the user manually triggers it, but will not be updated otherwise
 */
export type ScheduleMode = "scheduled" | "automatic" | "manual";

export interface ISchedulerOption {
  // Text next to the radio button option
  label: string;

  // The value of the radio button option
  type: SchedulerOptionType;

  // When the radio button option is selected, what text, if any,
  // should be displayed to help the user understand the expanded section
  expandedHelperText?: string;

  // The action icon/button to display next to the radio button option + label
  helperActionIcon?: string;

  // The action tooltip text to display next to the radio button option + label
  helperActionText?: string;

  // Whether the radio button option is selected
  checked?: boolean;

  // What to display in the expanded section when the radio button option is selected
  // but the value is invalid
  validationMessage?: string;

  // The value of the expanded section
  value?: ISchedule;
}

export interface ISchedule {
  mode: ScheduleMode;
  cadence?: Cadence;
  hour?: number; // 0-23
  day?: number; // 0-6 (Sunday-Saturday)
  date?: number; // 1-31
  month?: number; // 0-11 (January-December)
  timezone?: string;
}
