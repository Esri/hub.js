import {
  IHubRequestOptionsPortalSelf,
  getHubRequestOptions,
} from "../../src/index";
import { UserSession } from "@esri/arcgis-rest-auth";
import * as restPortal from "@esri/arcgis-rest-portal";
import * as getHubApiUrlFromPortalModule from "../../src/urls/get-hub-api-url-from-portal";
import * as getPortalApiUrlModule from "../../src/urls/get-portal-api-url";

describe("getHubRequestOptions", () => {
  const token = "token-12345";
  const portalUrl = "https://qa-pre-a-hub.mapsqa.arcgis.com";
  const hubUrl = "https://hubqa.arcgis.com";
  const portalObject = {
    id: "r2d2",
    isPortal: false,
  } as IHubRequestOptionsPortalSelf;

  let getSelfSpy: jasmine.Spy;
  let getHubApiUrlFromPortalSpy: jasmine.Spy;
  let getPortalApiUrlSpy: jasmine.Spy;

  beforeEach(() => {
    getSelfSpy = spyOn(restPortal, "getSelf").and.returnValue(
      Promise.resolve(portalObject)
    );
    getHubApiUrlFromPortalSpy = spyOn(
      getHubApiUrlFromPortalModule,
      "getHubApiUrlFromPortal"
    ).and.returnValue(hubUrl);
    getPortalApiUrlSpy = spyOn(
      getPortalApiUrlModule,
      "getPortalApiUrl"
    ).and.returnValue(portalUrl);
  });

  it("resolves an IHubRequestOptions when providing a UserSession", async () => {
    const userSession = new UserSession({
      token: "token-123",
      portal: portalUrl,
    });
    const { isPortal, hubApiUrl, portalSelf, authentication } =
      await getHubRequestOptions({ authentication: userSession });
    expect(getPortalApiUrlSpy).not.toHaveBeenCalled();
    expect(getSelfSpy).toHaveBeenCalledTimes(1);
    expect(getSelfSpy).toHaveBeenCalledWith({ authentication: userSession });
    expect(getHubApiUrlFromPortalSpy).toHaveBeenCalledTimes(1);
    expect(getHubApiUrlFromPortalSpy).toHaveBeenCalledWith(portalObject);
    expect(isPortal).toEqual(false);
    expect(hubApiUrl).toEqual(hubUrl);
    expect(portalSelf).toEqual(portalObject);
    expect(authentication).toEqual(userSession);
  });

  it("resolves an IHubRequestOptions when providing a portal and token", async () => {
    const { isPortal, hubApiUrl, portalSelf, authentication } =
      await getHubRequestOptions({
        portal: portalUrl,
        token,
      });
    expect(getPortalApiUrlSpy).toHaveBeenCalledTimes(1);
    expect(getPortalApiUrlSpy).toHaveBeenCalledWith(portalUrl);
    expect(getSelfSpy).toHaveBeenCalledTimes(1);
    const [{ authentication: session }] = getSelfSpy.calls.first().args;
    expect(session instanceof UserSession).toEqual(true);
    expect(session.token).toEqual(token);
    expect(session.portal).toEqual(portalUrl);
    expect(getHubApiUrlFromPortalSpy).toHaveBeenCalledTimes(1);
    expect(getHubApiUrlFromPortalSpy).toHaveBeenCalledWith(portalObject);
    expect(isPortal).toEqual(false);
    expect(hubApiUrl).toEqual(hubUrl);
    expect(portalSelf).toEqual(portalObject);
    expect(authentication).toEqual(session);
  });

  it("resolves an IHubRequestOptions when providing a portalSelf and token", async () => {
    const { isPortal, hubApiUrl, portalSelf, authentication } =
      await getHubRequestOptions({
        portalSelf: portalObject,
        token,
      });
    expect(getPortalApiUrlSpy).toHaveBeenCalledTimes(1);
    expect(getPortalApiUrlSpy).toHaveBeenCalledWith(portalObject);
    expect(getSelfSpy).not.toHaveBeenCalled();
    expect(getHubApiUrlFromPortalSpy).toHaveBeenCalledTimes(1);
    expect(getHubApiUrlFromPortalSpy).toHaveBeenCalledWith(portalObject);
    expect(isPortal).toEqual(false);
    expect(hubApiUrl).toEqual(hubUrl);
    expect(portalSelf).toEqual(portalObject);
    expect(authentication instanceof UserSession).toEqual(true);
    expect((authentication as UserSession).token).toEqual(token);
    expect((authentication as UserSession).portal).toEqual(portalUrl);
  });

  it("rejects when token is provided, but not portal or portalSelf", async (done) => {
    try {
      await getHubRequestOptions({ token });
      done.fail(new Error("Promise should have rejected"));
    } catch (e) {
      expect(e.message).toEqual(
        "Must provide portal or portalSelf when token is provided"
      );
      done();
    }
  });

  it("resolves an IHubRequestOptions when no options are provided", async () => {
    const { isPortal, hubApiUrl, portalSelf, authentication } =
      await getHubRequestOptions();
    expect(getSelfSpy).toHaveBeenCalledTimes(1);
    expect(getSelfSpy).toHaveBeenCalledWith({ authentication: undefined });
    expect(getHubApiUrlFromPortalSpy).toHaveBeenCalledTimes(1);
    expect(getHubApiUrlFromPortalSpy).toHaveBeenCalledWith(portalObject);
    expect(isPortal).toEqual(false);
    expect(hubApiUrl).toEqual(hubUrl);
    expect(portalSelf).toEqual(portalObject);
    expect(authentication).toBeUndefined();
  });
});
