import {
  HubService,
  ICursorSearchResults,
  SearchUsersFilter,
  SortableField,
  SortDirection,
  User
} from "../../src/hub/index";
import { UserSession } from "@esri/arcgis-rest-auth";

describe("user indexing test",  () => {
  beforeEach(function () {
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 1000000;
  })
  fit("test", async () => {
    const session: UserSession = new UserSession({
      token: '6tWbJAR1uvrTOR7xh4JtTnbxlJMAunTcEOofFSmIVqOVod1b9msGstvy-ynza4MXWEPpHzMIKKpd1Pd8hVV9oeSGBExbaoQBtdSVvitCdOETeo1lsgTOfx3GWtyu-evyvLyq1MsCPX2yVfYyTAw4p7e6idlgTRB376IURvdCJCWd9X3_CKg8ucxhYT635sNqDWpJMK9m6SkMPGzlie4i4RRCNoXujCfFhGh_17EKekM.'
    });

    const service = HubService.create(session);

    const filter: SearchUsersFilter = {
      lastHubSession: {
        // from: '2020-11-12T12:00:00.000Z',
        // to: '2020-12-17T18:47:59.999Z'
        from: "2020-10-12T12:00:00.000Z",
        to:"2020-12-31T18:47:59.999Z"
      },
      // team: "286ef07438c446a4bd6d1b0cd7a14925"
    }

    // TODO seems like a bad way to specify a default pagingOptions (having to pass null)
    const resp: ICursorSearchResults<User> = await service.searchUsers(filter, null, [{ field: SortableField.LAST_HUB_SESSION, sortDirection: SortDirection.ASC }]);

    console.log(resp)
    // console.log(resp.results.map(f => f.username))

    if (resp.next().done) {
      console.log('got next')
      const next = await resp.next().value(); // TODO this seems bad
      console.log(next)
    } else console.log('did not get next')

    console.log('-----------------------------------------------')

    expect({}).toEqual({})
  });


});
