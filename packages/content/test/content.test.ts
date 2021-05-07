import * as fetchMock from "fetch-mock";
import * as arcgisRestPortal from "@esri/arcgis-rest-portal";
import { IHubRequestOptions, IModel, IHubContent } from "@esri/hub-common";
import { getContent, _enrichDates } from "../src/index";
import * as portalModule from "../src/portal";
import * as hubModule from "../src/hub";
import { mockUserSession } from "./test-helpers/fake-user-session";

function parsePartialDate(dateString: string) {
  const dateParts: [number, number, number] = dateString
    .split("-")
    .map((x, idx) => {
      let part = +x;
      if (idx === 1) {
        part -= 1;
      }
      return part;
    }) as [number, number, number];
  return new Date(...dateParts);
}

describe("get content", () => {
  let requestOpts: IHubRequestOptions;
  beforeEach(() => {
    requestOpts = {
      portalSelf: {
        user: {},
        id: "123",
        isPortal: true,
        name: "some-portal"
      },
      isPortal: true,
      hubApiUrl: "https://some.url.com/",
      authentication: mockUserSession
    };
  });
  afterEach(fetchMock.restore);
  describe("from IModel", () => {
    let getContentFromHubSpy: jasmine.Spy;
    let getContentFromPortalSpy: jasmine.Spy;
    let getDataSpy: jasmine.Spy;
    beforeEach(() => {
      getContentFromHubSpy = spyOn(
        hubModule,
        "getContentFromHub"
      ).and.returnValue(Promise.resolve({}));
      getContentFromPortalSpy = spyOn(
        portalModule,
        "getContentFromPortal"
      ).and.callFake((item: any) => {
        const { id } = item;
        const content = {
          id,
          // important to flag as a type for which data is fetched
          hubType: "solution"
        };
        return Promise.resolve(content);
      });

      getDataSpy = spyOn(arcgisRestPortal, "getItemData").and.returnValue(
        Promise.resolve({ from: "api" })
      );
    });

    it("works with just an item", async () => {
      const modelWithItem = {
        item: {
          id: "3ef"
        }
      } as IModel;

      const ro = {} as IHubRequestOptions;

      const content = await getContent(modelWithItem, ro);

      expect(content.data.from).toBe("api", "fetched data from API");

      // should go straight to getContentFromPortal()
      expect(getContentFromHubSpy).not.toHaveBeenCalled();
      expect(getContentFromPortalSpy).toHaveBeenCalledWith(
        modelWithItem.item,
        ro
      );

      // should still load data
      expect(getDataSpy).toHaveBeenCalledWith(modelWithItem.item.id, ro);
    });
    it("works with item and data", async () => {
      const model = ({
        item: {
          id: "3ef"
        },
        data: { from: "arg" }
      } as unknown) as IModel;

      const ro = {} as IHubRequestOptions;

      const content = await getContent(model, ro);

      expect(content.data.from).toBe(
        "arg",
        "used data from the IModel argument"
      );

      // should go straight to getContentFromPortal()
      expect(getContentFromHubSpy).not.toHaveBeenCalled();
      expect(getContentFromPortalSpy).toHaveBeenCalledWith(model.item, ro);

      // should not load data
      expect(getDataSpy).not.toHaveBeenCalled();
    });
  });
  describe("from hub", () => {
    beforeEach(() => {
      requestOpts.isPortal = false;
      requestOpts.portalSelf.isPortal = false;
    });
    describe("with an id", () => {
      const id = "7a153563b0c74f7eb2b3eae8a66f2fbb";
      it("should call getContentFromHub", done => {
        const contentFromHub = {
          id,
          // emulating a hub created web map w/o orgId
          // will force additional fetch for owner's orgId
          hubType: "map",
          type: "Web Map",
          typeKeywords: ["ArcGIS Hub"]
        };
        const getContentFromHubSpy = spyOn(
          hubModule,
          "getContentFromHub"
        ).and.returnValue(Promise.resolve(contentFromHub));
        const getItemDataSpy = spyOn(arcgisRestPortal, "getItemData");
        const orgId = "ownerOrgId";
        const getUserSpy = spyOn(arcgisRestPortal, "getUser").and.returnValue(
          Promise.resolve({ orgId })
        );
        getContent(id, requestOpts).then(content => {
          expect(getContentFromHubSpy.calls.count()).toBe(1);
          expect(getContentFromHubSpy.calls.argsFor(0)).toEqual([
            id,
            requestOpts
          ]);
          // expect it not to have fetched item data
          expect(getItemDataSpy.calls.count()).toBe(0);
          // expect it to have fetched and set the orgId
          expect(getUserSpy.calls.count()).toBe(1);
          expect(content.orgId).toBe(orgId);
          done();
        });
      });
      it("handles private items", done => {
        const getContentFromHubSpy = spyOn(
          hubModule,
          "getContentFromHub"
        ).and.returnValue(Promise.reject({}));
        const getContentFromPortalSpy = spyOn(
          portalModule,
          "getContentFromPortal"
        ).and.returnValue(Promise.resolve({}));
        getContent(id, requestOpts).then(() => {
          expect(getContentFromHubSpy.calls.count()).toBe(1);
          expect(getContentFromHubSpy.calls.argsFor(0)).toEqual([
            id,
            requestOpts
          ]);
          expect(getContentFromPortalSpy.calls.count()).toBe(1);
          expect(getContentFromPortalSpy.calls.argsFor(0)).toEqual([
            id,
            requestOpts
          ]);
          done();
        });
      });
    });
    describe("with a slug", () => {
      const slug = "foo";
      it("rejects when not in the index", done => {
        const err = new Error("test");
        const getContentFromHubSpy = spyOn(
          hubModule,
          "getContentFromHub"
        ).and.returnValue(Promise.reject(err));
        getContent(slug, requestOpts).catch(e => {
          expect(getContentFromHubSpy.calls.count()).toBe(1);
          expect(getContentFromHubSpy.calls.argsFor(0)).toEqual([
            slug,
            requestOpts
          ]);
          expect(e).toEqual(err);
          done();
        });
      });
    });
  });
  describe("from portal", () => {
    it("should call getContentFromPortal", done => {
      const id = "foo";
      const contentFromPortal = {
        id,
        // emulating template content forces additional fetch for item data
        hubType: "template"
      };
      const itemData = { foo: "bar" };
      const getItemDataSpy = spyOn(
        arcgisRestPortal,
        "getItemData"
      ).and.returnValue(Promise.resolve(itemData));
      const getUserSpy = spyOn(arcgisRestPortal, "getUser");
      const getContentFromPortalSpy = spyOn(
        portalModule,
        "getContentFromPortal"
      ).and.returnValue(Promise.resolve(contentFromPortal));
      getContent(id, requestOpts).then(content => {
        expect(getContentFromPortalSpy.calls.count()).toBe(1);
        expect(getContentFromPortalSpy.calls.argsFor(0)).toEqual([
          "foo",
          requestOpts
        ]);
        // expect it to have fetched and set the item data
        expect(getItemDataSpy.calls.count()).toBe(1);
        expect(content.data).toEqual(itemData);
        // expect it to not have fetched the orgId
        expect(getUserSpy.calls.count()).toBe(0);
        done();
      });
    });
  });
});

describe("enrichDates", () => {
  describe("updateFrequency", () => {
    it("should return undefined when no metadata", () => {
      const result = _enrichDates({} as IHubContent);
      expect(result.updateFrequency).toEqual(undefined);
    });
    it("should return undefined when metadata present but unknown value", () => {
      const content = {
        metadata: {
          metadata: {
            Esri: {
              ArcGISProfile: "ISO19139"
            },
            dataIdInfo: {
              resMaint: {
                maintFreq: {
                  MaintFreqCd: {
                    "@_value": "999"
                  }
                }
              }
            }
          }
        }
      } as IHubContent;
      const result = _enrichDates(content);
      expect(result.updateFrequency).toEqual(undefined);
    });
    it("should return the correct value when metadata present", () => {
      const content = {
        metadata: {
          metadata: {
            Esri: {
              ArcGISProfile: "ISO19139"
            },
            dataIdInfo: {
              resMaint: {
                maintFreq: {
                  MaintFreqCd: {
                    "@_value": "003"
                  }
                }
              }
            }
          }
        }
      } as IHubContent;
      const result = _enrichDates(content);
      expect(result.updateFrequency).toEqual("weekly");
    });
  });

  describe("metadataUpdateFrequency", () => {
    it("should return undefined when no metadata", () => {
      const result = _enrichDates({} as IHubContent);
      expect(result.metadataUpdateFrequency).toEqual(undefined);
    });
    it("should return undefined when metadata present but unknown value", () => {
      const content = {
        metadata: {
          metadata: {
            Esri: {
              ArcGISProfile: "ISO19139"
            },
            mdMaint: {
              maintFreq: {
                MaintFreqCd: {
                  "@_value": "999"
                }
              }
            }
          }
        }
      } as IHubContent;
      const result = _enrichDates(content);
      expect(result.metadataUpdateFrequency).toEqual(undefined);
    });
    it("should return the correct value when metadata present", () => {
      const content = {
        metadata: {
          metadata: {
            Esri: {
              ArcGISProfile: "ISO19139"
            },
            mdMaint: {
              maintFreq: {
                MaintFreqCd: {
                  "@_value": "003"
                }
              }
            }
          }
        }
      } as IHubContent;
      const result = _enrichDates(content);
      expect(result.metadataUpdateFrequency).toEqual("weekly");
    });
  });

  describe("metadataUpdatedDate", () => {
    it("should return the correct values when no metadata", () => {
      // if it doesn't find metadata values it should fall back to the updated date on the content
      const updatedDate = new Date();
      const result = _enrichDates({
        updatedDate,
        updatedDateSource: "updated-date-source"
      } as IHubContent);
      expect(result.metadataUpdatedDate).toEqual(updatedDate);
      expect(result.metadataUpdatedDateSource).toEqual("updated-date-source");
    });
    it("should return the correct value when metadataUpdatedDate metadata present", () => {
      const metadataUpdatedDate = "1970-02-07";
      const content = {
        metadata: {
          metadata: {
            Esri: {
              ArcGISProfile: "ISO19139"
            },
            mdDateSt: metadataUpdatedDate
          }
        }
      } as IHubContent;
      const result = _enrichDates(content);
      expect(result.metadataUpdatedDate).toEqual(
        parsePartialDate(metadataUpdatedDate)
      );
      expect(result.metadataUpdatedDateSource).toEqual(
        "metadata.metadata.mdDateSt"
      );
    });
  });

  describe("updatedDate", () => {
    it("should return the correct values when no metadata and no lastEditDate", () => {
      // if it doesn't find metadata values it should just not mess with what is already there
      const updatedDate = new Date();
      const result = _enrichDates({
        updatedDate,
        updatedDateSource: "updated-date-source"
      } as IHubContent);
      expect(result.updatedDate).toEqual(updatedDate);
      expect(result.updatedDateSource).toEqual("updated-date-source");
    });
    it("should return the correct values when lastEditDate but no metadata", () => {
      // if it doesn't find metadata values it should just not mess with what is already there
      const lastEditDate = new Date(3222000000);
      const result = _enrichDates(({
        updatedDate: new Date(),
        updatedDateSource: "updated-date-source",
        // server.changeTrackingInfo.lastSyncDate
        server: { changeTrackingInfo: { lastSyncDate: lastEditDate.valueOf() } }
      } as unknown) as IHubContent);
      expect(result.updatedDate).toEqual(lastEditDate);
      expect(result.updatedDateSource).toEqual(
        "server.changeTrackingInfo.lastSyncDate"
      );
    });
    it("should return the correct value when reviseDate metadata present", () => {
      const reviseDate = "1970-02-07";
      const content = {
        metadata: {
          metadata: {
            Esri: {
              ArcGISProfile: "ISO19139"
            },
            dataIdInfo: {
              idCitation: {
                date: {
                  reviseDate
                }
              }
            }
          }
        }
      } as IHubContent;
      const result = _enrichDates(content);
      expect(result.updatedDate).toEqual(parsePartialDate(reviseDate));
      expect(result.updatedDateSource).toEqual(
        "metadata.metadata.dataIdInfo.idCitation.date.reviseDate"
      );
    });
  });

  describe("publishedDate", () => {
    it("should return the correct values when no metadata", () => {
      // if it doesn't find metadata values it should just not mess with what is already there
      const publishedDate = new Date();
      const result = _enrichDates({
        publishedDate,
        publishedDateSource: "published-date-source"
      } as IHubContent);
      expect(result.publishedDate).toEqual(publishedDate);
      expect(result.publishedDateSource).toEqual("published-date-source");
    });
    it("should return the correct value when pubDate metadata present", () => {
      const pubDate = "1970-02-07";
      const content = {
        metadata: {
          metadata: {
            Esri: {
              ArcGISProfile: "ISO19139"
            },
            dataIdInfo: {
              idCitation: {
                date: {
                  pubDate
                }
              }
            }
          }
        }
      } as IHubContent;
      const result = _enrichDates(content);
      expect(result.publishedDate).toEqual(parsePartialDate(pubDate));
      expect(result.publishedDateSource).toEqual(
        "metadata.metadata.dataIdInfo.idCitation.date.pubDate"
      );
    });
    it("should return the correct value when createDate metadata present", () => {
      const createDate = "1970-02-07";
      const content = {
        metadata: {
          metadata: {
            Esri: {
              ArcGISProfile: "ISO19139"
            },
            dataIdInfo: {
              idCitation: {
                date: {
                  createDate
                }
              }
            }
          }
        }
      } as IHubContent;
      const result = _enrichDates(content);
      expect(result.publishedDate).toEqual(parsePartialDate(createDate));
      expect(result.publishedDateSource).toEqual(
        "metadata.metadata.dataIdInfo.idCitation.date.createDate"
      );
    });
    it("should return the correct value when createDate & pubDate metadata present", () => {
      const pubDate = "1970-02-07";
      const content = {
        metadata: {
          metadata: {
            Esri: {
              ArcGISProfile: "ISO19139"
            },
            dataIdInfo: {
              idCitation: {
                date: {
                  createDate: "1970-11-17T00:00:00.000Z",
                  pubDate
                }
              }
            }
          }
        }
      } as IHubContent;
      const result = _enrichDates(content);
      expect(result.publishedDate).toEqual(parsePartialDate(pubDate));
      expect(result.publishedDateSource).toEqual(
        "metadata.metadata.dataIdInfo.idCitation.date.pubDate"
      );
    });
  });
});
