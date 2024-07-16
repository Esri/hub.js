import { cloneObject, IArcGISContext, IPolicyAssertion } from "../../../src";
import { checkAssertion } from "../../../src/permissions/_internal/checkAssertion";

describe("checkAssertion:", () => {
  describe("property parsing:", () => {
    it("if default entity property lookup fails, returns error", () => {
      const assertion: IPolicyAssertion = {
        property: "foo",
        type: "eq",
        value: "bar",
      };
      const ctx = {
        isAuthenticated: true,
      } as unknown as IArcGISContext;
      const entity = {};
      const chk = checkAssertion(assertion, entity, ctx);
      expect(chk.response).toBe("assertion-property-not-found");
    });
    it("if entity property lookup fails, returns error", () => {
      const assertion: IPolicyAssertion = {
        property: "entity:foo",
        type: "eq",
        value: "bar",
      };
      const ctx = {
        isAuthenticated: true,
      } as unknown as IArcGISContext;
      const entity = {};
      const chk = checkAssertion(assertion, entity, ctx);
      expect(chk.response).toBe("assertion-property-not-found");
    });
    it("if context property lookup fails, returns error", () => {
      const assertion: IPolicyAssertion = {
        property: "context:foo",
        type: "eq",
        value: "bar",
      };
      const ctx = {
        isAuthenticated: true,
      } as unknown as IArcGISContext;
      const entity = {};
      const chk = checkAssertion(assertion, entity, ctx);
      expect(chk.response).toBe("assertion-property-not-found");
    });
    it("if entity value lookup fails, returns error", () => {
      const assertion: IPolicyAssertion = {
        property: "foo",
        type: "eq",
        value: "entity:baz",
      };
      const ctx = {
        isAuthenticated: true,
      } as unknown as IArcGISContext;
      const entity = {
        foo: "bar",
      };
      const chk = checkAssertion(assertion, entity, ctx);
      expect(chk.response).toBe("assertion-property-not-found");
    });
  });

  describe("equality checks: ", () => {
    it("entity prop eq val: granted", () => {
      const assertion: IPolicyAssertion = {
        property: "color",
        type: "eq",
        value: "red",
      };
      const ctx = {
        isAuthenticated: true,
      } as unknown as IArcGISContext;
      const entity = {
        color: "red",
      };
      const chk = checkAssertion(assertion, entity, ctx);
      expect(chk.response).toBe("granted");
    });
    it("entity prop neq val: granted", () => {
      const assertion: IPolicyAssertion = {
        property: "color",
        type: "neq",
        value: "blue",
      };
      const ctx = {
        isAuthenticated: true,
      } as unknown as IArcGISContext;
      const entity = {
        color: "red",
      };
      const chk = checkAssertion(assertion, entity, ctx);
      expect(chk.response).toBe("granted");
    });
    it("entity prop eq val: failed", () => {
      const assertion: IPolicyAssertion = {
        property: "color",
        type: "eq",
        value: "red",
      };
      const ctx = {
        isAuthenticated: true,
      } as unknown as IArcGISContext;
      const entity = {
        color: "orange",
      };
      const chk = checkAssertion(assertion, entity, ctx);
      expect(chk.response).toBe("assertion-failed");
    });
    it("entity prop neq val: failed", () => {
      const assertion: IPolicyAssertion = {
        property: "color",
        type: "neq",
        value: "blue",
      };
      const ctx = {
        isAuthenticated: true,
      } as unknown as IArcGISContext;
      const entity = {
        color: "blue",
      };
      const chk = checkAssertion(assertion, entity, ctx);
      expect(chk.response).toBe("assertion-failed");
    });
    it("entity: prop eq val: granted", () => {
      const assertion: IPolicyAssertion = {
        property: "entity:color",
        type: "eq",
        value: "red",
      };
      const ctx = {
        isAuthenticated: true,
      } as unknown as IArcGISContext;
      const entity = {
        color: "red",
      };
      const chk = checkAssertion(assertion, entity, ctx);
      expect(chk.response).toBe("granted");
    });
    it("entity: prop neq val: granted", () => {
      const assertion: IPolicyAssertion = {
        property: "entity:color",
        type: "neq",
        value: "blue",
      };
      const ctx = {
        isAuthenticated: true,
      } as unknown as IArcGISContext;
      const entity = {
        color: "red",
      };
      const chk = checkAssertion(assertion, entity, ctx);
      expect(chk.response).toBe("granted");
    });
    it("two props on entity eq: granted", () => {
      const assertion: IPolicyAssertion = {
        property: "entity:color",
        type: "eq",
        value: "entity:deep.color",
      };
      const ctx = {
        isAuthenticated: true,
      } as unknown as IArcGISContext;
      const entity = {
        color: "red",
        deep: { color: "red" },
      };
      const chk = checkAssertion(assertion, entity, ctx);
      expect(chk.response).toBe("granted");
    });
    it("two props on entity neq: granted", () => {
      const assertion: IPolicyAssertion = {
        property: "entity:color",
        type: "neq",
        value: "entity:deep.color",
      };
      const ctx = {
        isAuthenticated: true,
      } as unknown as IArcGISContext;
      const entity = {
        color: "red",
        deep: { color: "blue" },
      };
      const chk = checkAssertion(assertion, entity, ctx);
      expect(chk.response).toBe("granted");
    });
  });

  describe("string comparison checks: ", () => {
    it("entity prop starts-with val: granted", () => {
      const assertion: IPolicyAssertion = {
        property: "color",
        type: "starts-with",
        value: "red",
      };
      const ctx = {
        isAuthenticated: true,
      } as unknown as IArcGISContext;
      const entity = {
        color: "reddish",
      };
      const chk = checkAssertion(assertion, entity, ctx);
      expect(chk.response).toBe("granted");
    });
    it("entity prop starts-with val: failed", () => {
      const assertion: IPolicyAssertion = {
        property: "color",
        type: "starts-with",
        value: "red",
      };
      const ctx = {
        isAuthenticated: true,
      } as unknown as IArcGISContext;
      const entity = {
        color: "orangy-red",
      };
      const chk = checkAssertion(assertion, entity, ctx);
      expect(chk.response).toBe("assertion-failed");
    });
    it("entity prop not-starts-with val: granted", () => {
      const assertion: IPolicyAssertion = {
        property: "color",
        type: "not-starts-with",
        value: "red",
      };
      const ctx = {
        isAuthenticated: true,
      } as unknown as IArcGISContext;
      const entity = {
        color: "green",
      };
      const chk = checkAssertion(assertion, entity, ctx);
      expect(chk.response).toBe("granted");
    });
    it("entity prop not-starts-with val: failed", () => {
      const assertion: IPolicyAssertion = {
        property: "color",
        type: "not-starts-with",
        value: "red",
      };
      const ctx = {
        isAuthenticated: true,
      } as unknown as IArcGISContext;
      const entity = {
        color: "reddish",
      };
      const chk = checkAssertion(assertion, entity, ctx);
      expect(chk.response).toBe("assertion-failed");
    });
    it("entity prop ends-with val: granted", () => {
      const assertion: IPolicyAssertion = {
        property: "color",
        type: "ends-with",
        value: "red",
      };
      const ctx = {
        isAuthenticated: true,
      } as unknown as IArcGISContext;
      const entity = {
        color: "orangey-red",
      };
      const chk = checkAssertion(assertion, entity, ctx);
      expect(chk.response).toBe("granted");
    });
    it("entity prop ends-with val: failed", () => {
      const assertion: IPolicyAssertion = {
        property: "color",
        type: "ends-with",
        value: "red",
      };
      const ctx = {
        isAuthenticated: true,
      } as unknown as IArcGISContext;
      const entity = {
        color: "reddish",
      };
      const chk = checkAssertion(assertion, entity, ctx);
      expect(chk.response).toBe("assertion-failed");
    });
    it("entity prop not-ends-with val: granted", () => {
      const assertion: IPolicyAssertion = {
        property: "color",
        type: "not-ends-with",
        value: "red",
      };
      const ctx = {
        isAuthenticated: true,
      } as unknown as IArcGISContext;
      const entity = {
        color: "reddish",
      };
      const chk = checkAssertion(assertion, entity, ctx);
      expect(chk.response).toBe("granted");
    });
    it("entity prop not-ends-with val: failed", () => {
      const assertion: IPolicyAssertion = {
        property: "color",
        type: "not-ends-with",
        value: "red",
      };
      const ctx = {
        isAuthenticated: true,
      } as unknown as IArcGISContext;
      const entity = {
        color: "orangey-red",
      };
      const chk = checkAssertion(assertion, entity, ctx);
      expect(chk.response).toBe("assertion-failed");
    });
  });

  describe("array checks:", () => {
    it("entity prop contains val", () => {
      const assertion: IPolicyAssertion = {
        property: "colors",
        type: "contains",
        value: "red",
      };
      const ctx = {
        isAuthenticated: true,
      } as unknown as IArcGISContext;

      const chk = checkAssertion(assertion, { colors: ["red", "blue"] }, ctx);
      expect(chk.response).toBe("granted");
      const fail = checkAssertion(
        assertion,
        { colors: ["redish", "blue"] },
        ctx
      );
      expect(fail.response).toBe("array-missing-required-value");
    });

    it("entity prop contains all vals in array", () => {
      const assertion: IPolicyAssertion = {
        property: "colors",
        type: "contains",
        value: ["red", "blue"],
      };
      const ctx = {
        isAuthenticated: true,
      } as unknown as IArcGISContext;

      const chk = checkAssertion(
        assertion,
        { colors: ["red", "blue", "purple"] },
        ctx
      );
      expect(chk.response).toBe("granted");
      const fail = checkAssertion(
        assertion,
        { colors: ["redish", "blue", "purple"] },
        ctx
      );
      expect(fail.response).toBe("array-missing-required-value");
    });

    it("entity prop contains-some val", () => {
      const assertion: IPolicyAssertion = {
        property: "context:currentUser.privileges",
        type: "contains-some",
        value: [
          "portal:admin:shareToPublic",
          "portal:admin:shareToOrg",
          "portal:user:shareToPublic",
          "portal:user:shareToOrg",
        ],
      };
      const ctx = {
        currentUser: {
          privileges: ["portal:admin:shareToOrg"],
        },
      } as unknown as IArcGISContext;

      const chk1 = checkAssertion(assertion, {}, ctx);
      expect(chk1.response).toBe("granted");

      ctx.currentUser.privileges = [];
      const chk2 = checkAssertion(assertion, {}, ctx);
      expect(chk2.response).toBe("array-missing-required-value");

      assertion.value = "some string";
      const chk3 = checkAssertion(assertion, {}, ctx);
      expect(chk3.response).toBe("assertion-requires-array-value");
    });
    it("entity prop without val", () => {
      const assertion: IPolicyAssertion = {
        property: "colors",
        type: "without",
        value: "red",
      };
      const ctx = {
        isAuthenticated: true,
      } as unknown as IArcGISContext;

      const chk = checkAssertion(assertion, { colors: ["green", "blue"] }, ctx);
      expect(chk.response).toBe("granted");
      const fail = checkAssertion(assertion, { colors: ["red", "blue"] }, ctx);
      expect(fail.response).toBe("array-contains-invalid-value");
    });
    it("entity prop without any vals in array", () => {
      const assertion: IPolicyAssertion = {
        property: "colors",
        type: "without",
        value: ["red", "blue"],
      };
      const ctx = {
        isAuthenticated: true,
      } as unknown as IArcGISContext;

      const chk = checkAssertion(assertion, { colors: ["green"] }, ctx);
      expect(chk.response).toBe("granted");
      const fail1 = checkAssertion(assertion, { colors: ["blue"] }, ctx);
      const fail2 = checkAssertion(assertion, { colors: ["blue", "red"] }, ctx);
      expect(fail1.response).toBe("array-contains-invalid-value");
      expect(fail2.response).toBe("array-contains-invalid-value");
    });
    it("prop not array error", () => {
      const assertion: IPolicyAssertion = {
        property: "colors",
        type: "without",
        value: "red",
      };
      const ctx = {
        isAuthenticated: true,
      } as unknown as IArcGISContext;

      const chk = checkAssertion(
        assertion,
        {
          colors: "green",
        },
        ctx
      );
      expect(chk.response).toBe("property-not-array");
    });
  });
  describe("range checks:", () => {
    it("prop gt val", () => {
      const assertion: IPolicyAssertion = {
        property: "count",
        type: "gt",
        value: 12,
      };
      const ctx = {
        isAuthenticated: true,
      } as unknown as IArcGISContext;

      const chk = checkAssertion(
        assertion,
        {
          count: 13,
        },
        ctx
      );
      expect(chk.response).toBe("granted");
      let fail = checkAssertion(
        assertion,
        {
          count: 11,
        },
        ctx
      );
      expect(fail.response).toBe("assertion-failed");
      fail = checkAssertion(
        assertion,
        {
          count: 12,
        },
        ctx
      );
      expect(fail.response).toBe("assertion-failed");
    });
    it("prop lt val", () => {
      const assertion: IPolicyAssertion = {
        property: "count",
        type: "lt",
        value: 12,
      };
      const ctx = {
        isAuthenticated: true,
      } as unknown as IArcGISContext;

      const chk = checkAssertion(
        assertion,
        {
          count: 10,
        },
        ctx
      );
      expect(chk.response).toBe("granted");
      let fail = checkAssertion(
        assertion,
        {
          count: 13,
        },
        ctx
      );
      expect(fail.response).toBe("assertion-failed");
      fail = checkAssertion(
        assertion,
        {
          count: 12,
        },
        ctx
      );
      expect(fail.response).toBe("assertion-failed");
    });
    it("non-numeric error", () => {
      const assertion: IPolicyAssertion = {
        property: "count",
        type: "gt",
        value: 12,
      };
      const ctx = {
        isAuthenticated: true,
      } as unknown as IArcGISContext;

      const chk = checkAssertion(
        assertion,
        {
          count: "13",
        },
        ctx
      );
      expect(chk.response).toBe("assertion-requires-numeric-values");
    });
  });
  describe("length checks:", () => {
    it("prop length gt val", () => {
      const assertion: IPolicyAssertion = {
        property: "groups",
        type: "length-gt",
        value: 2,
      };
      const ctx = {
        isAuthenticated: true,
      } as unknown as IArcGISContext;

      const chk = checkAssertion(
        assertion,
        {
          groups: ["group-1", "group-2", "group-3"],
        },
        ctx
      );
      expect(chk.response).toBe("granted");
      let fail = checkAssertion(
        assertion,
        {
          groups: ["group-1"],
        },
        ctx
      );
      expect(fail.response).toBe("assertion-failed");
      fail = checkAssertion(
        assertion,
        {
          groups: ["group-1", "group-2"],
        },
        ctx
      );
      expect(fail.response).toBe("assertion-failed");
    });
    it("prop length lt val", () => {
      const assertion: IPolicyAssertion = {
        property: "title",
        type: "length-lt",
        value: 10,
      };
      const ctx = {
        isAuthenticated: true,
      } as unknown as IArcGISContext;
      const chk = checkAssertion(
        assertion,
        {
          title: "mock assr",
        },
        ctx
      );
      expect(chk.response).toBe("granted");
      let fail = checkAssertion(
        assertion,
        {
          title: "mock title",
        },
        ctx
      );
      expect(fail.response).toBe("assertion-failed");
      fail = checkAssertion(
        assertion,
        {
          title: "some really long mock title",
        },
        ctx
      );
      expect(fail.response).toBe("assertion-failed");
    });
    it("prop values without a length error", () => {
      const assertion: IPolicyAssertion = {
        property: "count",
        type: "length-gt",
        value: 12,
      };
      const ctx = {
        isAuthenticated: true,
      } as unknown as IArcGISContext;

      const chk = checkAssertion(
        assertion,
        {
          count: 10,
        },
        ctx
      );
      expect(chk.response).toBe("property-has-no-length");
    });
    it("non-numeric value error", () => {
      const assertion: IPolicyAssertion = {
        property: "groups",
        type: "length-gt",
        value: "12",
      };
      const ctx = {
        isAuthenticated: true,
      } as unknown as IArcGISContext;

      const chk = checkAssertion(
        assertion,
        {
          groups: ["group-1"],
        },
        ctx
      );
      expect(chk.response).toBe("assertion-requires-numeric-values");
    });
  });
  describe("includes checks:", () => {
    it("entity prop included-in val", () => {
      const assertion: IPolicyAssertion = {
        property: "primaryColor",
        type: "included-in",
        value: "entity:colors",
      };
      const ctx = {
        isAuthenticated: true,
      } as unknown as IArcGISContext;

      const chk = checkAssertion(
        assertion,
        {
          primaryColor: "red",
          colors: ["red", "blue"],
        },
        ctx
      );
      expect(chk.response).toBe("granted");
      const fail = checkAssertion(
        assertion,
        {
          primaryColor: "green",
          colors: ["redish", "blue"],
        },
        ctx
      );
      expect(fail.response).toBe("array-missing-required-value");
    });
    it("non-array error", () => {
      const assertion: IPolicyAssertion = {
        property: "primaryColor",
        type: "included-in",
        value: "entity:colors",
      };
      const ctx = {
        isAuthenticated: true,
      } as unknown as IArcGISContext;

      const chk = checkAssertion(
        assertion,
        {
          primaryColor: "red",
          colors: 12,
        },
        ctx
      );
      expect(chk.response).toBe("property-not-array");
    });
  });
  describe("group checks:", () => {
    const ctx = {
      isAuthenticated: true,
      currentUser: {
        groups: [
          { id: "00c", userMembership: { memberType: "admin" } },
          { id: "00b", userMembership: { memberType: "owner" } },
          { id: "00a", userMembership: { memberType: "member" } },
        ],
      },
    } as unknown as IArcGISContext;
    it("is-group-admin", () => {
      const assertion: IPolicyAssertion = {
        property: "context:currentUser",
        type: "is-group-admin",
        value: "entity:group.id",
      };

      const chk = checkAssertion(
        assertion,
        {
          group: { id: "00c" },
        },
        ctx
      );
      expect(chk.response).toBe("granted");
      const chkOwner = checkAssertion(
        assertion,
        {
          group: { id: "00b" },
        },
        ctx
      );
      expect(chkOwner.response).toBe("granted");
      const fail = checkAssertion(
        assertion,
        {
          group: { id: "00a" },
        },
        ctx
      );
      expect(fail.response).toBe("user-not-group-manager");
    });
    it("is-group-member", () => {
      const assertion: IPolicyAssertion = {
        property: "context:currentUser",
        type: "is-group-member",
        value: "entity:group.id",
      };

      const chk = checkAssertion(
        assertion,
        {
          group: { id: "00c" },
        },
        ctx
      );
      expect(chk.response).toBe("granted");
      const chkOwner = checkAssertion(
        assertion,
        {
          group: { id: "00b" },
        },
        ctx
      );
      expect(chkOwner.response).toBe("granted");
      const fail = checkAssertion(
        assertion,
        {
          group: { id: "00x" },
        },
        ctx
      );
      expect(fail.response).toBe("user-not-group-member");
    });
    it("is-group-owner", () => {
      const assertion: IPolicyAssertion = {
        property: "context:currentUser",
        type: "is-group-owner",
        value: "entity:group.id",
      };

      const chk = checkAssertion(
        assertion,
        {
          group: { id: "00b" },
        },
        ctx
      );
      expect(chk.response).toBe("granted");

      const fail = checkAssertion(
        assertion,
        {
          group: { id: "00a" },
        },
        ctx
      );
      expect(fail.response).toBe("user-not-group-owner");
    });
    it("is-not-group-admin", () => {
      const assertion: IPolicyAssertion = {
        property: "context:currentUser",
        type: "is-not-group-admin",
        value: "entity:group.id",
      };

      const chk1 = checkAssertion(
        assertion,
        {
          group: { id: "00a" },
        },
        ctx
      );
      expect(chk1.response).toBe("granted");
      const chk2 = checkAssertion(
        assertion,
        {
          group: { id: "00b" },
        },
        ctx
      );
      expect(chk2.response).toBe("user-is-group-manager");
      const chk3 = checkAssertion(
        assertion,
        {
          group: { id: "00c" },
        },
        ctx
      );
      expect(chk3.response).toBe("user-is-group-manager");
    });
    it("is-not-group-owner", () => {
      const assertion: IPolicyAssertion = {
        property: "context:currentUser",
        type: "is-not-group-owner",
        value: "entity:group.id",
      };

      const chk1 = checkAssertion(assertion, { group: { id: "00c" } }, ctx);
      const chk2 = checkAssertion(assertion, { group: { id: "00a" } }, ctx);
      expect(chk1.response).toBe("granted");
      expect(chk2.response).toBe("granted");

      const fail = checkAssertion(assertion, { group: { id: "00b" } }, ctx);
      expect(fail.response).toBe("user-is-group-owner");
    });
    it("is-not-group-member", () => {
      const assertion: IPolicyAssertion = {
        property: "context:currentUser",
        type: "is-not-group-member",
        value: "entity:group.id",
      };

      const chk = checkAssertion(assertion, { group: { id: "00d" } }, ctx);
      expect(chk.response).toBe("granted");

      const fail1 = checkAssertion(assertion, { group: { id: "00a" } }, ctx);
      const fail2 = checkAssertion(assertion, { group: { id: "00b" } }, ctx);
      const fail3 = checkAssertion(assertion, { group: { id: "00c" } }, ctx);
      expect(fail1.response).toBe("user-is-group-member");
      expect(fail2.response).toBe("user-is-group-member");
      expect(fail3.response).toBe("user-is-group-member");
    });
    it("user has no groups", () => {
      const cloneCtx = cloneObject(ctx);
      delete cloneCtx.currentUser.groups;
      const assertion: IPolicyAssertion = {
        property: "context:currentUser",
        type: "is-group-member",
        value: "entity:group.id",
      };

      const chk = checkAssertion(
        assertion,
        {
          group: { id: "00c" },
        },
        cloneCtx
      );
      expect(chk.response).toBe("user-not-group-member");
    });
  });
});
