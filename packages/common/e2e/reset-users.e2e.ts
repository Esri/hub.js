import { IUserRequestOptions, UserSession } from "@esri/arcgis-rest-auth";
import { resetConfig } from "./fixtures/resetConfig";
import { adminInfo } from "./fixtures/env";
import { request } from "@esri/arcgis-rest-request";

const DRY_RUN = true;
fdescribe("reset-users harness: ", () => {
  it("reset passwords", async () => {
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
        const adminPwd = adminInfo[adminUser.env].admin;
        const newPwd = adminInfo[adminUser.env].user;
        // create session as this user
        const session = new UserSession({
          username: adminUser.user,
          server: org.url,
          password: adminPwd,
        });
        // verify auth by getting the token
        const token = await session.getToken(org.url);
        if (token) {
          // tslint:disable-next-line:no-console
          console.info(`${adminUser.user} Authenticated to ${org.url}`);
          // start resetting the passwords
          for (const user of org.users) {
            // reset the password
            // tslint:disable-next-line:no-console
            console.info(`Resetting password for ${user}`);
            const result = await resetPassword(
              session,
              user,
              "e2e1hubtest",
              newPwd,
              DRY_RUN
            );
            // log the result
            // tslint:disable-next-line:no-console
            console.log(result);
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
  console.info(`${username} ${password} => ${newPassword}`);
  if (dry) {
    return Promise.resolve();
  } else {
    return request(url, options);
  }
}
