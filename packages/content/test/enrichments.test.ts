import * as arcgisRestPortal from "@esri/arcgis-rest-portal";
import * as metadataModule from "../src/metadata";
import { IHubContent } from "@esri/hub-common";
import {
  fetchEnrichments,
  _enrichDates,
  parseISODateString,
  enrichContent,
  IFetchEnrichmentOptions
} from "../src/enrichments";
import { getContentFromPortal } from "../src/portal";

describe("fetchEnrichments", () => {
  it("fetches orgId for hub created web maps", async () => {
    const orgId = "ownerOrgId";
    const getUserSpy = spyOn(arcgisRestPortal, "getUser").and.returnValue(
      Promise.resolve({ orgId })
    );
    const content = {
      id: "3ae",
      // signature for a Hub created web map
      type: "Web Map",
      typeKeywords: ["ArcGIS Hub"],
      // don't try to fetch the other enrichments:
      groupIds: [],
      data: {},
      metadata: null
    } as IHubContent;
    const props = await fetchEnrichments(content);
    expect(getUserSpy.calls.count()).toBe(1);
    expect(props).toEqual({ orgId, errors: [] });
  });
});

describe("enrichContent", () => {
  it("doesn't fetch any enrichments when empty array is passed", async () => {
    const getUserSpy = spyOn(arcgisRestPortal, "getUser");
    const getItemDataSpy = spyOn(arcgisRestPortal, "getItemData");
    const getItemGroupsSpy = spyOn(arcgisRestPortal, "getItemGroups");
    const getContentMetadataSpy = spyOn(metadataModule, "getContentMetadata");
    const content = {
      errors: [],
      id: "3ae",
      // signature for a Hub created web map would trigger getUser
      type: "Web Map",
      typeKeywords: ["ArcGIS Hub"]
      // missing groupIds, data, and metadata would trigger other fetches
    } as IHubContent;
    const requestOptions: IFetchEnrichmentOptions = {
      isPortal: false,
      enrichments: [],
      hubApiUrl: "https://some.url.com/",
      authentication: null
    };
    const enriched = await enrichContent(content, requestOptions);
    expect(getUserSpy).not.toHaveBeenCalled();
    expect(getItemDataSpy).not.toHaveBeenCalled();
    expect(getItemGroupsSpy).not.toHaveBeenCalled();
    expect(getContentMetadataSpy).not.toHaveBeenCalled();
    expect(enriched.errors).toEqual([]);
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
      expect(result.metadataUpdatedDatePrecision).toEqual("day");
      expect(result.metadataUpdatedDateSource).toEqual("updated-date-source");
    });
    it("should return the correct value when metadataUpdatedDate metadata present", () => {
      const metadataUpdatedDate = "1970";
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
        new Date(+metadataUpdatedDate, 0, 1)
      );
      expect(result.metadataUpdatedDatePrecision).toEqual("year");
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
      expect(result.updatedDatePrecision).toEqual("day");
      expect(result.updatedDateSource).toEqual("updated-date-source");
    });
    it("should return the correct values when layerLastEditDate but no metadata", () => {
      // if it doesn't find metadata values it should just not mess with what is already there
      const lastEditDate = new Date(3222000000);
      const result = _enrichDates(({
        updatedDate: new Date(),
        updatedDateSource: "updated-date-source",
        // layer.editingInfo.lastEditDate
        layer: { editingInfo: { lastEditDate: lastEditDate.valueOf() } }
      } as unknown) as IHubContent);
      expect(result.updatedDate).toEqual(lastEditDate);
      expect(result.updatedDatePrecision).toEqual("day");
      expect(result.updatedDateSource).toEqual(
        "layer.editingInfo.lastEditDate"
      );
    });
    it("should return the correct values when serverLastEditDate but no metadata", () => {
      // if it doesn't find metadata values it should just not mess with what is already there
      const lastEditDate = new Date(3222000000);
      const result = _enrichDates(({
        updatedDate: new Date(),
        updatedDateSource: "updated-date-source",
        // server.editingInfo.lastEditDate
        server: { editingInfo: { lastEditDate: lastEditDate.valueOf() } }
      } as unknown) as IHubContent);
      expect(result.updatedDate).toEqual(lastEditDate);
      expect(result.updatedDatePrecision).toEqual("day");
      expect(result.updatedDateSource).toEqual(
        "server.editingInfo.lastEditDate"
      );
    });
    it("should return the correct value when reviseDate metadata present", () => {
      const reviseDate = "1970-02";
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
      const dateParts = reviseDate.split("-").map(part => +part);
      expect(result.updatedDate).toEqual(
        new Date(dateParts[0], dateParts[1] - 1, 1)
      );
      expect(result.updatedDatePrecision).toEqual("month");
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
      expect(result.publishedDatePrecision).toEqual("day");
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
      const dateParts = pubDate.split("-").map(part => +part);
      expect(result.publishedDate).toEqual(
        new Date(dateParts[0], dateParts[1] - 1, dateParts[2])
      );
      expect(result.publishedDatePrecision).toEqual("day");
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
      const dateParts = createDate.split("-").map(part => +part);
      expect(result.publishedDate).toEqual(
        new Date(dateParts[0], dateParts[1] - 1, dateParts[2])
      );
      expect(result.publishedDatePrecision).toEqual("day");
      expect(result.publishedDateSource).toEqual(
        "metadata.metadata.dataIdInfo.idCitation.date.createDate"
      );
    });
    it("should return the correct value when createDate & pubDate metadata present", () => {
      const pubDate = "02/07/1970";
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
      expect(result.publishedDate).toEqual(new Date(1970, 1, 7));
      expect(result.publishedDatePrecision).toEqual("day");
      expect(result.publishedDateSource).toEqual(
        "metadata.metadata.dataIdInfo.idCitation.date.pubDate"
      );
    });
  });

  describe("parseISODateString", () => {
    it("should parse various date strings properly", () => {
      const expectations = [
        {
          dateString: "2018",
          result: { date: new Date(2018, 0, 1), precision: "year" }
        },
        {
          dateString: "2018-02",
          result: { date: new Date(2018, 1, 1), precision: "month" }
        },
        {
          dateString: "2018-02-07",
          result: { date: new Date(2018, 1, 7), precision: "day" }
        },
        {
          dateString: "2018-02-07T16:30",
          result: { date: new Date("2018-02-07T16:30"), precision: "time" }
        },
        {
          dateString: "02/07/1970",
          result: { date: new Date("02/07/1970"), precision: "day" }
        }
      ];
      expectations.forEach(expectation => {
        const result = parseISODateString(expectation.dateString);
        expect(result.date).toEqual(expectation.result.date);
        expect(result.precision).toEqual(expectation.result.precision);
      });
    });

    it("should return undefined when provided an unsupported date format", () => {
      const result = parseISODateString("2018-02-07T16");
      expect(result).toBe(undefined);
    });
  });
});
