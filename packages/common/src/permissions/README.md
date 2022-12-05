# Permissions

## Permission Assertions

```js
{
  property: "context.isAuthenticated",
  assertion: "eq",
  value: true,
},
```

### Property

Property is a string which is presumed to be a property path on the passed in `entity`.

```js
// Entity is a Web Map
// entity.type equals "Web Map"
{
  property: "type", assertion: "eq", value: "Web Map",
},
```

Property **may** start with `context.` and is then looked up on the context object

```js
// User is Authenticated
// context.isAuthenticated equals true
{
  property: "context.isAuthenticated", assertion: "eq", value: true,
},
```

Property **may** start with `mapBy:<string>:<property path>` which will result in the property value being an array of the property.

```js
// User is a member of the group passed in as part of the entity
// property value is the array of ids, mapped from context.currentUser.groups
{
  property: "mapBy:id:context.currentUser.groups", assertion: "contains", value: "group.id",
},

### Assertion

The `assertion` property denotes the comparison operation to be applied as the assertion. The valid values are:

| Assertion | Description |
| --- | --- |
| "eq" | property equals specified value |
| "neq" | property does not equal specified value |
| "gt" | property greater than specified value. Must be numeric |
| "lt" | property less than specified value. Must be numeric |
| "contains" | property contains the specified value. Property must reference an array |
| "contains-all" | property contains all the specified values. Property and value must reference arrays |
| "not-contains" | property does not contain the specified value. Property must reference an array |
| "included-in" | property is included in the specified value. Value must be array |

## Value
```
