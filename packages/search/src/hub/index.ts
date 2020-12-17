import { UserSession } from "@esri/arcgis-rest-auth";

type iso8601Date = string;

export interface DateRange {
  from: iso8601Date;
  to: iso8601Date;
}

export interface UserFilter {
  lastHubSession: DateRange;
}

const userQuery = gql`
  query Self {
    self {
      username
      lastHubSession
      firstName
      lastName
      lastLogin
    }
  }
`;

export class HubService {
  static create(userSession: UserSession): HubService {
    return new HubService(userSession);
  }

  constructor(private userSession: UserSession) {}

  /*
    import UserService from '@esri/crap';

    const service = UserService.create(userSession);
    const searchResults = service.searchUser(filter);
    searchResults.data.map(...);
    await searchResults.next()
  */
  async searchUser(filter: UserFilter): ICursorSearchResults<IUser> {
    // TODO: by EOD fill this in and return search results
  }
}
