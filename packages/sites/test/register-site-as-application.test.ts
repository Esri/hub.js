import { registerSiteAsApplication } from "../src";
import * as registerBrowserModule from "../src/register-browser-app";
import { IHubRequestOptions, IModel } from "@esri/hub-common";

describe("registerSiteAsApplication", () => {
  it("registers the site", async () => {
    const registerSpy = spyOn(
      registerBrowserModule,
      "registerBrowserApp"
    ).and.returnValue({});

    const model = ({
      item: {
        id: "site-id"
      },
      data: {
        values: {
          defaultHostname: "default-hostname"
        }
      }
    } as unknown) as IModel;

    await registerSiteAsApplication(model, {} as IHubRequestOptions);

    expect(registerSpy).toHaveBeenCalledTimes(1);
    const redirectUris = registerSpy.calls.argsFor(0)[1];
    expect(redirectUris.length).toBe(
      2,
      "registers default hostname as redirect uri"
    );
    expect(redirectUris).toContain(
      "https://default-hostname",
      "registers default hostname as redirect uri"
    );
    expect(redirectUris).toContain(
      "http://default-hostname",
      "registers default hostname as redirect uri"
    );
  });

  it("registers the site", async () => {
    const registerSpy = spyOn(
      registerBrowserModule,
      "registerBrowserApp"
    ).and.returnValue({});

    const model = ({
      item: {
        id: "site-id"
      },
      data: {
        values: {
          defaultHostname: "default-hostname",
          customHostname: "custom-hostname"
        }
      }
    } as unknown) as IModel;

    await registerSiteAsApplication(model, {} as IHubRequestOptions);

    expect(registerSpy).toHaveBeenCalledTimes(1);
    const redirectUris = registerSpy.calls.argsFor(0)[1];
    expect(redirectUris.length).toBe(
      4,
      "includes custom hostname as redirect uri present"
    );
    expect(redirectUris).toContain(
      "https://default-hostname",
      "includes custom hostname as redirect uri present"
    );
    expect(redirectUris).toContain(
      "http://default-hostname",
      "includes custom hostname as redirect uri present"
    );
  });

  it("does nothing on portal", async () => {
    const registerSpy = spyOn(
      registerBrowserModule,
      "registerBrowserApp"
    ).and.returnValue({});

    const model = ({
      item: {
        id: "site-id"
      },
      data: {
        values: {
          defaultHostname: "default-hostname",
          customHostname: "custom-hostname"
        }
      }
    } as unknown) as IModel;

    await registerSiteAsApplication(model, {
      isPortal: true
    } as IHubRequestOptions);

    expect(registerSpy).not.toHaveBeenCalled();
  });
});
