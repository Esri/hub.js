/* Copyright (c) 2021 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */

import { gql } from "graphql-request";

const userFieldsFragment = gql`
  fragment userFields on User {
    username
    lastHubSession
    groups {
      id
      memberType
      title
    }
  }
`;

const pageInfoFieldsFragment = gql`
  fragment pageInfoFields on PageInfo {
    endCursor
    hasNextPage
  }
`;

const searchFieldsFragment = gql`
  fragment searchFields on SearchUsersResponse {
    totalCount
    edges {
      node {
        ...userFields
      }
    }
    pageInfo {
      ...pageInfoFields
    }
  }
  ${userFieldsFragment}
  ${pageInfoFieldsFragment}
`;

/**
 * GraphQL query for creating a sessiono
 */
export const createSessionMutation = gql`
  mutation($portalUrl: String!) {
    createSession(createSessionInput: { url: $portalUrl }) {
      username
      url
      ipAddress
    }
  }
`;

/**
 * GraphQL query for getting self
 */
export const userSelfQuery = gql`
  {
    self {
      ...userFields
    }
  }
  ${userFieldsFragment}
`;

/**
 * GraphQL query for searching for users, passing the specified filter, pagingOptions,
 * and sortingOptions
 */
export const userSearchQuery = gql`
  query(
    $filter: SearchUsersFilter
    $pagingOptions: PagingOptions
    $sortingOptions: [SortingOption!]
  ) {
    searchUsers(
      filter: $filter
      pagingOptions: $pagingOptions
      sortingOptions: $sortingOptions
    ) {
      ...searchFields
    }
  }
  ${searchFieldsFragment}
`;
