// /**
//  * Defines status structure for subsystem license information
//  */
// export interface ISubsystemLicenseStatus {
//   /**
//    * Subsystem is available in this environment, but may not be licenesed for the current user
//    */
//   available: boolean;
//   /**
//    * Capablility is available in this environment and is licenesed for the current user
//    */
//   licensed: boolean;
// }

// /**
//  * Structure that's used to determine if a subsystem is available and licensed
//  */
// export interface IPlatformLicenseStatus {
//   /**
//    * Current license type
//    */
//   license: HubLicense;
//   /**
//    * Status of each subsystem
//    */
//   subsystems: SubsystemLicenseStatus;
// }

// /**
//  * Typing for subsystem status information
//  */
// export type SubsystemLicenseStatus = {
//   [key in HubSubsystem]: ISubsystemLicenseStatus;
// };
