import {
  HubService,
  ICursorSearchResults,
  SearchUsersFilter,
  UserSortableField,
  UserSortDirection,
  User
} from "../../src/hub/index";
import { UserSession } from "@esri/arcgis-rest-auth";

describe("user indexing test",  () => {
  beforeEach(function () {
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 1000000;
  })

  const token = 'SLmpFv49xhL_A2nuzBfyAxlp46j-o-muVJKAfyZGB-zJ2AVg4qzCWcIGNvg7Jz7qQL0zWr8VDXmO9mT2zyiwgvRe-6B53aqAYV5vOYQLPqunLoY0w0C3lXamalLHBvNU-sKHAzcxQ9yr6dzLDrfFiM3C_9zNFsx2dQllsZQGj5EDyiqcuEQ_jH5rQREy_8GplJ8zP_51BBvESYQDTt_kak9WjIvjsBpaIds89KAmIbc.'
  fit("test", async () => {
    const session: UserSession = new UserSession({
      token
    });

    const service = HubService.create('https://devext.arcgis.com', 'https://afbc9443d4ebd4830afdc4793a3c191d-857540221.us-east-2.elb.amazonaws.com/graphql', session);

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
    const resp: ICursorSearchResults<User> = await service.searchUsers(filter, undefined, [{ field: UserSortableField.LAST_HUB_SESSION, sortDirection: UserSortDirection.ASC }]);

    console.log(resp)

    if (resp.hasNext) {
      console.log('got next')
      const next = await resp.next();
      console.log(next)
    } else console.log('did not get next')

    console.log('-----------------------------------------------')

    expect({}).toEqual({})
  });

  it("test2", async () => {
    const session: UserSession = new UserSession({
      token
    });

    const service = HubService.create('https://devext.arcgis.com', 'https://afbc9443d4ebd4830afdc4793a3c191d-857540221.us-east-2.elb.amazonaws.com/graphql', session);

    await service.createSession();

    const resp = await service.getSelf();

    console.log(resp)

    console.log('-----------------------------------------------')

    expect({}).toEqual({})
  });

});
