# Permissions

Please see the [Guide](https://esri.github.io/hub.js/guides/advanced/permissions/) for additional information.

## Permission Assertions

Example Assertions

```js
// To look up property on the context... use context.
const userIsAuthenticated: IPolicyAssertion = {
  property: "context:isAuthenticated",
  assertion: "eq",
  value: true,
};

// To look up property on the .. use
const mostlyComplete: IPolicyAssertion = {
  property: "entity:item.properties.percentComplete",
  assertion: "gt",
  value: 75,
};

// Array property does not contain a value
const withoutKeyword: IPolicyAssertion = {
  property: "entity:item.typekeywords",
  assertion: "without",
  value: "cannotDiscuss",
};

// Allow consuming code to pass in arbitrary structures
// and make assertions between props in the structure
// Example assumes an entity structured like {item:..., group:...}
const itemCreatedAfterGroup: IPolicyAssertion = {
  property: "entity:item.created",
  assertion: "gt",
  value: "entity:group.created",
};
```

### Assertion Types

```js
export interface IPolicyAssertion {
  property: string;
  assertion: AssertionType
  value: any;
}

export type AssertionType =
  | "eq"
  | "neq"
  | "gt"
  | "lt"
  | "contains"
  | "contains-all"
  | "without"
  | "included-in"
  | "is-group-admin"
  | "is-group-member"
  | "is-group-owner";

```

### `IPolicyAssertion.property`

Property is a string which is presumed to be a property path on the passed in `entity`.

```js
// Entity is a Web Map
// type equals "Web Map"
{
  property: "type", assertion: "eq", value: "Web Map",
},
```

Property **may** start with `context:` or `entity:`, in which case the rest of the string is used as a property lookup on the appropriate object.

```js
// User is Authenticated
// context.isAuthenticated equals true
{
  property: "context:isAuthenticated", assertion: "eq", value: true,
},
```

### `IPolicyAssertion.assertion`

The `assertion` property denotes the comparison operation to be applied as the assertion. The valid values are:

| Assertion          | Description                                                                          |
| ------------------ | ------------------------------------------------------------------------------------ |
| "eq"               | property equals specified value                                                      |
| "neq"              | property does not equal specified value                                              |
| "gt"               | property greater than specified value. Must be numeric                               |
| "lt"               | property less than specified value. Must be numeric                                  |
| "contains"         | property contains the specified value. Property must reference an array              |
| "contains-all"     | property contains all the specified values. Property and value must reference arrays |
| "without"          | property does not contain the specified value. Property must reference an array      |
| "included-in"      | property is included in the specified value. Value must be array                     |
| "is-group-manager" | user must be manager of group id specified in value prop                             |
| "is-group-member"  | user must be member of group id specified in value prop                              |
| "is-group-owner"   | user must be owner of group id specified in value prop                               |

## `IPolicyAssertion.value`

Value can be a string, number or boolean. If it is a string, similarly to `property`, the string can be prefixed with `context:` or `entity:` to specify that it's a lookup instead of a literal value.

```js
{
  // property color looked up on entity, and checked that it === the string "red"
  property: "color", assertion: "eq", value: "red",
},

{
  // property looked up on entity and checked if it ===
  // value looked up on entity
  property: "person.favColor", assertion: "eq", value: "entity:car.color",
},
{
  // owner property looked up on entity must equal current user
  property: "entity:owner", assertion: "eq", value: "context:currentUser.username",
},
{
  // same rule stated another way
  property: "context:currentUser.username", assertion: "eq", value: "entity:owner",
},
```

### Permission Example

```js
const permission: IPermissionPolicy = {
  permission: "discussions:channel:createprivate",
  services: ["discussions"],
  authenticated: true,
  licenses: ["hub-premium"],
  alpha: true,
  assertions: [
    {
      property: "entity:item.typeKeywords",
      assertion: "not-contains",
      value: "cannotDiscuss",
    },
    {
      property: "context:currentUser",
      assertion: "is-group-manager",
      value: "entity:group.id",
    },
  ],
};
```
