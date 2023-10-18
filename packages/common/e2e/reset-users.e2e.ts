import { IUserRequestOptions, UserSession } from "@esri/arcgis-rest-auth";
import { resetConfig } from "./fixtures/resetConfig";
import { adminInfo } from "./fixtures/env";
import { request } from "@esri/arcgis-rest-request";
import { getProp } from "../src";
/* tslint:disable:no-string-literal */
const DRY_RUN = true;
// Intentionally disabled. To use this, you will need to add a /fixtures/.env
// file with the current admin pwds for the envs, and the new e2e user pwds for the envs
xdescribe("reset-users harness: ", () => {
  it("reset passwords", async () => {
    jasmine["DEFAULT_TIMEOUT_INTERVAL"] = 200000;
    // iterate the resetConfig.orgs
    const admins = resetConfig.admins || [];
    // debugger;
    for (const org of resetConfig.orgs) {
      // tslint:disable-next-line:no-console
      console.info(`Resetting passwords for ${org.orgShort}`);
      // get the admin user for the org
      const adminUser = admins.find((a) => a.orgShort === org?.orgShort);
      if (adminUser) {
        // tslint:disable-next-line:no-console
        console.info(`Admin user for ${org.orgShort} is ${adminUser.user}`);
        // get the password for the admin user
        const adminPwd = getProp(adminInfo, `${adminUser.env}.admin`) as string;
        const newPwd = getProp(adminInfo, `${adminUser.env}.user`) as string;
        // create session as this user
        const session = new UserSession({
          username: adminUser.user,
          portal: `${org.url}/sharing/rest`,
          password: adminPwd,
        });
        // verify auth by getting the token
        const token = await session.getToken(`${org.url}/sharing/rest`);
        if (token) {
          // tslint:disable-next-line:no-console
          console.info(`${adminUser.user} Authenticated to ${org.url}`);
          // start resetting the passwords
          for (const user of org.users) {
            // reset the password
            // tslint:disable-next-line:no-console
            console.info(`Resetting password for ${user}`);
            try {
              const result = await resetPassword(
                session,
                user,
                "e2e1hubtest",
                newPwd,
                DRY_RUN
              );
              if (result.success) {
                // tslint:disable-next-line:no-console
                console.info(
                  `Successfully reset password for ${user} in ${org.orgShort}`
                );
              } else {
                // tslint:disable-next-line:no-console
                console.error(
                  `Failed to reset password for ${user} in ${org.orgShort}`
                );
              }
            } catch (ex) {
              // tslint:disable-next-line:no-console
              console.error(
                `Error resetting password for ${user} in ${org.orgShort}`
              );
            }
          }
        }
      }
    }
  });
});

function resetPassword(
  session: UserSession,
  username: string,
  password: string,
  newPassword: string,
  dry: boolean = false
) {
  const url = `${session.portal}/community/users/${username}/reset`;
  const options: IUserRequestOptions = {
    httpMethod: "POST",
    authentication: session,
    params: {
      f: "json",
      token: session.token,
      password,
      newPassword,
    },
  };
  // tslint:disable-next-line:no-console
  console.info(`POST ${url}`);
  // tslint:disable-next-line:no-console
  console.info(`Resetting ${username} ${password} => ${newPassword}`);
  if (dry) {
    return Promise.resolve({ success: true, username });
  } else {
    return request(url, options);
  }
}
