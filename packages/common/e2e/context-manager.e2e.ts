import { ArcGISContextManager } from "../src";
import Artifactory from "./helpers/Artifactory";
import config from "./helpers/config";

jasmine.DEFAULT_TIMEOUT_INTERVAL = 200000;

function delay(milliseconds: number) {
  return new Promise((resolve) => setTimeout(resolve, milliseconds));
}
describe("context-manager:", () => {
  let factory: Artifactory;
  beforeAll(() => {
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 200000;
    factory = new Artifactory(config);
  });
  it("can set thumbnail on a project", async () => {
    // create context
    const ctxMgr = await factory.getContextManager("hubBasic", "admin");
    // serialize
    const serializedSession = ctxMgr.serialize();
    // create new context manager from serialized session
    const newCtxMgr = await ArcGISContextManager.deserialize(serializedSession);
    // verify that the new context manager has the same session as the original
    const newSession = JSON.parse(newCtxMgr.context.session.serialize());
    const oldSession = JSON.parse(ctxMgr.context.session.serialize());
    expect(newSession.token).toEqual(oldSession.token);
    // verify that the new context manager has the same portal as the original
    expect(newCtxMgr.context.portal).toEqual(ctxMgr.context.portal);
  });
});
