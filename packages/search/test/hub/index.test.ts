import { HubService, UserFilter, DateRange } from "../../src/hub/index";
import { UserSession } from "@esri/arcgis-rest-auth";

describe("user indexing test", () => {
  fit("test", async done => {

    const session: UserSession = new UserSession({
      token: 'M_aUTmaQ_WDelzgaSOFvSmp_oyifpgghla-NZc9HldE9gjF9ndVZr0E5dI7TznuI2U20hvZu89I-bpM2qFDKR12rXwqlDocOg9ANiKjdqA3CGrEOCRE7MvHF5mcWwomua72-s3FjsZ3iDGMNuobzgqTyxIsSW1TL1GFZeBtD14Pfb4SDK-J9dgLNeNNUDHUq'
    });

    const service = HubService.create(session);

    const filter: UserFilter = {
      lastHubSession: {
        from: '2020-11-12T12:00:00.000Z',
        to: '2020-12-17T18:47:59.999Z'
      }
    }

    const resp: any = await service.searchUsers(filter);

    expect(resp).toEqual({})
    done();
  });


});
