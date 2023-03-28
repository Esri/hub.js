import * as fetchMock from "fetch-mock";
import { IItem } from "@esri/arcgis-rest-portal";
import { cloneObject, IEnrichmentErrorInfo } from "../../src";
import { fetchItemEnrichments } from "../../src/items/_enrichments";
import * as featureServiceItem from "../mocks/items/feature-service-item.json";
import * as datasetWithMetadata from "../mocks/datasets/feature-layer-with-metadata.json";
import * as servicesDirectory from "../../src/items/is-services-directory-disabled";
import { IFeatureServiceDefinition } from "@esri/arcgis-rest-types";

describe("_enrichments", () => {
  describe("fetchItemEnrichments", () => {
    // the error we expect when an API call 404s
    const expectedError = {
      type: "Other",
      message: "HTTP 404: Not Found",
    } as IEnrichmentErrorInfo;
    let item: IItem;
    beforeEach(() => {
      item = cloneObject(featureServiceItem);
    });
    describe("groupIds", () => {
      it("fetches groupIds", async () => {
        const groupIds = ["foo", "bar"];
        fetchMock.once("*", {
          admin: [],
          member: groupIds.map((id) => ({ id })),
          other: [],
        });
        const result = await fetchItemEnrichments(item, ["groupIds"]);
        expect(result.groupIds).toEqual(groupIds);
      });
      it("handles errors", async () => {
        fetchMock.once("*", 404);
        const result = await fetchItemEnrichments(item, ["groupIds"]);
        expect(result.groupIds).toBeUndefined();
        expect(result.errors).toEqual([expectedError]);
      });
    });
    describe("enrichOwnerUser", () => {
      it("fetches ownerUser", async () => {
        const username = item.owner;
        const ownerUser = {
          username,
          orgId: "foo",
        };
        fetchMock.once("*", ownerUser);
        const result = await fetchItemEnrichments(item, ["ownerUser"]);
        expect(result.ownerUser).toEqual(ownerUser);
      });
      it("handles errors", async () => {
        fetchMock.once("*", 404);
        const result = await fetchItemEnrichments(item, ["ownerUser"]);
        expect(result.ownerUser).toBeUndefined();
        expect(result.errors).toEqual([expectedError]);
      });
    });
    describe("enrichOrg", () => {
      it("fetches the org portal", async () => {
        const orgPortalUrl = "https://myorg.maps.arcgis.com"; // target we pass in
        const basePortalUrl = "https://www.arcgis.com"; // target that should be hit

        // Simulate fetching the user...
        const username = item.owner;
        const ownerUser = {
          username,
          orgId: "foo",
        };
        fetchMock.once("*", ownerUser);

        // then fetch the org
        const org = { id: "foo", name: "bar" };
        fetchMock.once("*", org, { overwriteRoutes: false });

        const result = await fetchItemEnrichments(item, ["ownerUser", "org"], {
          portal: orgPortalUrl,
        });
        expect(fetchMock.calls().length).toEqual(2);
        expect(fetchMock.lastUrl()).toMatch(
          `${basePortalUrl}/sharing/rest/portals/${ownerUser.orgId}`
        );
        expect(result.org).toEqual(org);
      });

      it("performs a no-op if orgId isn't available on the item or the ownerUser", async () => {
        const orgPortalUrl = "https://myorg.maps.arcgis.com";

        // Simulate fetching the user...
        const username = item.owner;
        const ownerUser = { username };
        fetchMock.once("*", ownerUser);

        const result = await fetchItemEnrichments(item, ["ownerUser", "org"], {
          portal: orgPortalUrl,
        });
        expect(fetchMock.calls().length).toEqual(1); // only the ownerUser call is made
        expect(result.org).toBeUndefined();
      });

      it("handles errors", async () => {
        // Simulate fetching the user...
        const username = item.owner;
        const ownerUser = {
          username,
          orgId: "foo",
        };
        fetchMock.once("*", ownerUser);
        // Fail when fetching the org
        fetchMock.once("*", 404, { overwriteRoutes: false });
        const result = await fetchItemEnrichments(item, ["ownerUser", "org"], {
          portal: "will-fail",
        });
        expect(result.org).toBeUndefined();
        expect(result.errors).toEqual([expectedError]);
      });
      // TODO: Add test when no portal is passed in
    });
    describe("enrichData", () => {
      it("fetches data", async () => {
        const data = {
          version: "2.0",
        };
        fetchMock.once("*", data);
        const result = await fetchItemEnrichments(item, ["data"]);
        expect(result.data).toEqual(data);
      });
      it("handles errors", async () => {
        fetchMock.once("*", 404);
        const result = await fetchItemEnrichments(item, ["data"]);
        expect(result.data).toBeUndefined();
        expect(result.errors).toEqual([expectedError]);
      });
    });
    describe("enrichServer", () => {
      it("fetches server", async () => {
        spyOn(servicesDirectory, "isServicesDirectoryDisabled").and.returnValue(
          Promise.resolve(false)
        );
        const server = {
          currentVersion: 10.71,
          serviceDescription: "For demo purposes only.",
        };
        fetchMock.once("*", server);
        const result = await fetchItemEnrichments(item, ["server"]);
        expect(result.server).toEqual({
          ...server,
          servicesDirectoryDisabled: false,
        } as Partial<IFeatureServiceDefinition>);
      });
      it("fetches server with servicesDirectoryDisabled true", async () => {
        spyOn(servicesDirectory, "isServicesDirectoryDisabled").and.returnValue(
          Promise.resolve(true)
        );
        const server = {
          currentVersion: 10.71,
          serviceDescription: "For demo purposes only.",
        };
        fetchMock.once("*", server);
        const result = await fetchItemEnrichments(item, ["server"]);
        expect(result.server).toEqual({
          ...server,
          servicesDirectoryDisabled: true,
        } as Partial<IFeatureServiceDefinition>);
      });
      it("removes /:layer from url", async () => {
        spyOn(servicesDirectory, "isServicesDirectoryDisabled").and.returnValue(
          Promise.resolve(false)
        );
        fetchMock.once("*", {});
        const serviceRootUrl =
          "https://servicesqa.arcgis.com/Xj56SBi2udA78cC9/arcgis/rest/services/survey123_a5db32e043f14f6a9edfec7075288df6/FeatureServer";
        await fetchItemEnrichments({ ...item, url: `${serviceRootUrl}/5` }, [
          "server",
        ]);
        expect(fetchMock.calls().length).toEqual(1);
        expect(fetchMock.lastUrl()).toEqual(serviceRootUrl);
      });
      it("handles errors", async () => {
        spyOn(servicesDirectory, "isServicesDirectoryDisabled").and.returnValue(
          Promise.resolve(false)
        );
        fetchMock.once("*", 404);
        const result = await fetchItemEnrichments(item, ["server"]);
        expect(result.server).toBeUndefined();
        expect(result.errors).toEqual([expectedError]);
      });
    });
    describe("enrichLayers", () => {
      it("fetches layers", async () => {
        const layer = { id: 0, name: "layer0 " };
        const table = { id: 1, name: "table1 " };
        const groupLayer = { id: 2, name: "layer1", type: "Group Layer" };
        const allLayersAndTables = {
          layers: [layer, groupLayer],
          tables: [table],
        };
        fetchMock.once("*", allLayersAndTables);
        const result = await fetchItemEnrichments(item, ["layers"]);
        expect(result.layers).toEqual([layer, table]);
      });
      it("handles errors", async () => {
        fetchMock.once("*", 404);
        const result = await fetchItemEnrichments(item, ["layers"]);
        expect(result.layers).toBeUndefined();
        expect(result.errors).toEqual([expectedError]);
      });
    });
    describe("enrichMetadata", () => {
      it("fetches metadata", async () => {
        // mock an item metadata response from:
        // https://www.arcgis.com/sharing/rest/content/items/1ce4060e854747038b153c5c8f8c894d/info/metadata/metadata.xml
        const xml = `
        <?xml version="1.0" encoding="UTF-8" standalone="no"?><metadata xml:lang="en">
            <Esri>
                <CreaDate>20200305</CreaDate>
                <CreaTime>16302900</CreaTime>
                <ArcGISFormat>1.0</ArcGISFormat>
                <SyncOnce>FALSE</SyncOnce>
                <DataProperties>
                    <itemProps>
                        <itemName Sync="TRUE">SDE.ARCDATA_AREAS</itemName>
                        <imsContentType Sync="TRUE">002</imsContentType>
                        <nativeExtBox>
                            <westBL Sync="TRUE">333996.493700</westBL>
                            <eastBL Sync="TRUE">437765.674000</eastBL>
                            <southBL Sync="TRUE">2742761.572800</southBL>
                            <northBL Sync="TRUE">2834452.030000</northBL>
                            <exTypeCode Sync="TRUE">1</exTypeCode>
                        </nativeExtBox>
                    </itemProps>
                    <coordRef>
                        <type Sync="TRUE">Projected</type>
                        <geogcsn Sync="TRUE">GCS_WGS_1984</geogcsn>
                        <csUnits Sync="TRUE">Linear Unit: Meter (1.000000)</csUnits>
                        <projcsn Sync="TRUE">WGS_1984_UTM_Zone_40N</projcsn>
                        <peXml Sync="TRUE">&lt;ProjectedCoordinateSystem xsi:type='typens:ProjectedCoordinateSystem' xmlns:xsi='http://www.w3.org/2001/XMLSchema-instance' xmlns:xs='http://www.w3.org/2001/XMLSchema' xmlns:typens='http://www.esri.com/schemas/ArcGIS/10.5'&gt;&lt;WKT&gt;PROJCS[&amp;quot;WGS_1984_UTM_Zone_40N&amp;quot;,GEOGCS[&amp;quot;GCS_WGS_1984&amp;quot;,DATUM[&amp;quot;D_WGS_1984&amp;quot;,SPHEROID[&amp;quot;WGS_1984&amp;quot;,6378137.0,298.257223563]],PRIMEM[&amp;quot;Greenwich&amp;quot;,0.0],UNIT[&amp;quot;Degree&amp;quot;,0.0174532925199433]],PROJECTION[&amp;quot;Transverse_Mercator&amp;quot;],PARAMETER[&amp;quot;False_Easting&amp;quot;,500000.0],PARAMETER[&amp;quot;False_Northing&amp;quot;,0.0],PARAMETER[&amp;quot;Central_Meridian&amp;quot;,57.0],PARAMETER[&amp;quot;Scale_Factor&amp;quot;,0.9996],PARAMETER[&amp;quot;Latitude_Of_Origin&amp;quot;,0.0],UNIT[&amp;quot;Meter&amp;quot;,1.0],AUTHORITY[&amp;quot;EPSG&amp;quot;,32640]]&lt;/WKT&gt;&lt;XOrigin&gt;-5120900&lt;/XOrigin&gt;&lt;YOrigin&gt;-9998100&lt;/YOrigin&gt;&lt;XYScale&gt;10000&lt;/XYScale&gt;&lt;ZOrigin&gt;0&lt;/ZOrigin&gt;&lt;ZScale&gt;1&lt;/ZScale&gt;&lt;MOrigin&gt;0&lt;/MOrigin&gt;&lt;MScale&gt;1&lt;/MScale&gt;&lt;XYTolerance&gt;0.001&lt;/XYTolerance&gt;&lt;ZTolerance&gt;0.001&lt;/ZTolerance&gt;&lt;MTolerance&gt;0.001&lt;/MTolerance&gt;&lt;HighPrecision&gt;true&lt;/HighPrecision&gt;&lt;WKID&gt;32640&lt;/WKID&gt;&lt;LatestWKID&gt;32640&lt;/LatestWKID&gt;&lt;/ProjectedCoordinateSystem&gt;</peXml>
                    </coordRef>
                </DataProperties>
                <SyncDate>20180711</SyncDate>
                <SyncTime>08475400</SyncTime>
                <ModDate>20180711</ModDate>
                <ModTime>08475400</ModTime>
            </Esri>
            <dataIdInfo>
                <envirDesc Sync="FALSE">Esri ArcGIS 10.5.0.6491</envirDesc>
                <dataLang>
                    <languageCode Sync="TRUE" value="eng"/>
                    <countryCode Sync="TRUE" value="USA"/>
                </dataLang>
                <idCitation>
                    <resTitle Sync="TRUE">SDE.ARCDATA_AREAS</resTitle>
                    <presForm>
                        <PresFormCd Sync="TRUE" value="005"/>
                    </presForm>
                </idCitation>
                <spatRpType>
                    <SpatRepTypCd Sync="TRUE" value="001"/>
                </spatRpType>
                <dataExt>
                    <geoEle>
                        <GeoBndBox>
                            <exTypeCode Sync="TRUE">1</exTypeCode>
                            <westBL Sync="TRUE">55.346704</westBL>
                            <eastBL Sync="TRUE">56.384276</eastBL>
                            <northBL Sync="TRUE">25.626358</northBL>
                            <southBL Sync="TRUE">24.790622</southBL>
                        </GeoBndBox>
                    </geoEle>
                </dataExt>
                <idAbs/>
                <searchKeys>
                    <keyword>Sharjah_selection</keyword>
                </searchKeys>
                <idPurp>Sharjah_selection</idPurp>
                <idCredit/>
                <resConst>
                    <Consts>
                        <useLimit/>
                    </Consts>
                </resConst>
            </dataIdInfo>
            <mdLang>
                <languageCode Sync="TRUE" value="eng"/>
                <countryCode Sync="TRUE" value="USA"/>
            </mdLang>
            <distInfo>
                <distFormat>
                    <formatName Sync="FALSE">Feature Class</formatName>
                </distFormat>
            </distInfo>
            <mdHrLv>
                <ScopeCd Sync="TRUE" value="005"/>
            </mdHrLv>
            <mdHrLvName Sync="TRUE">dataset</mdHrLvName>
            <refSysInfo>
                <RefSystem>
                    <refSysID>
                        <identCode Sync="TRUE" code="32640"/>
                        <idCodeSpace Sync="TRUE">EPSG</idCodeSpace>
                        <idVersion Sync="TRUE">2.1(3.0.1)</idVersion>
                    </refSysID>
                </RefSystem>
            </refSysInfo>
            <spatRepInfo>
                <VectSpatRep>
                    <geometObjs>
                        <geoObjTyp>
                            <GeoObjTypCd Sync="TRUE" value="002"/>
                        </geoObjTyp>
                        <geoObjCnt Sync="TRUE">0</geoObjCnt>
                    </geometObjs>
                    <topLvl>
                        <TopoLevCd Sync="TRUE" value="001"/>
                    </topLvl>
                </VectSpatRep>
            </spatRepInfo>
            <spdoinfo>
                <ptvctinf>
                    <esriterm>
                        <efeatyp Sync="TRUE">Simple</efeatyp>
                        <efeageom Sync="TRUE" code="4"/>
                        <esritopo Sync="TRUE">FALSE</esritopo>
                        <efeacnt Sync="TRUE">0</efeacnt>
                        <spindex Sync="TRUE">TRUE</spindex>
                        <linrefer Sync="TRUE">FALSE</linrefer>
                    </esriterm>
                </ptvctinf>
            </spdoinfo>
            <eainfo>
                <detailed>
                    <enttyp>
                        <enttypl Sync="TRUE">SDE.ARCDATA_AREAS</enttypl>
                        <enttypt Sync="TRUE">Feature Class</enttypt>
                        <enttypc Sync="TRUE">0</enttypc>
                    </enttyp>
                    <attr>
                        <attrlabl Sync="TRUE">REMARKS</attrlabl>
                        <attalias Sync="TRUE">REMARKS</attalias>
                        <attrtype Sync="TRUE">String</attrtype>
                        <attwidth Sync="TRUE">254</attwidth>
                        <atprecis Sync="TRUE">0</atprecis>
                        <attscale Sync="TRUE">0</attscale>
                    </attr>
                    <attr>
                        <attrlabl Sync="TRUE">AREA_CODE</attrlabl>
                        <attalias Sync="TRUE">AREA_CODE</attalias>
                        <attrtype Sync="TRUE">Double</attrtype>
                        <attwidth Sync="TRUE">8</attwidth>
                        <atprecis Sync="TRUE">38</atprecis>
                        <attscale Sync="TRUE">8</attscale>
                    </attr>
                    <attr>
                        <attrlabl Sync="TRUE">SUBURB_COD</attrlabl>
                        <attalias Sync="TRUE">SUBURB_COD</attalias>
                        <attrtype Sync="TRUE">Double</attrtype>
                        <attwidth Sync="TRUE">8</attwidth>
                        <atprecis Sync="TRUE">38</atprecis>
                        <attscale Sync="TRUE">8</attscale>
                    </attr>
                    <attr>
                        <attrlabl Sync="TRUE">AREA_NAME_</attrlabl>
                        <attalias Sync="TRUE">AREA_NAME_</attalias>
                        <attrtype Sync="TRUE">String</attrtype>
                        <attwidth Sync="TRUE">50</attwidth>
                        <atprecis Sync="TRUE">0</atprecis>
                        <attscale Sync="TRUE">0</attscale>
                    </attr>
                    <attr>
                        <attrlabl Sync="TRUE">AREA_NAME1</attrlabl>
                        <attalias Sync="TRUE">AREA_NAME1</attalias>
                        <attrtype Sync="TRUE">String</attrtype>
                        <attwidth Sync="TRUE">50</attwidth>
                        <atprecis Sync="TRUE">0</atprecis>
                        <attscale Sync="TRUE">0</attscale>
                    </attr>
                    <attr>
                        <attrlabl Sync="TRUE">POPULATION</attrlabl>
                        <attalias Sync="TRUE">POPULATION</attalias>
                        <attrtype Sync="TRUE">Double</attrtype>
                        <attwidth Sync="TRUE">8</attwidth>
                        <atprecis Sync="TRUE">38</atprecis>
                        <attscale Sync="TRUE">8</attscale>
                    </attr>
                    <attr>
                        <attrlabl Sync="TRUE">CITY_CODE</attrlabl>
                        <attalias Sync="TRUE">CITY_CODE</attalias>
                        <attrtype Sync="TRUE">Double</attrtype>
                        <attwidth Sync="TRUE">8</attwidth>
                        <atprecis Sync="TRUE">38</atprecis>
                        <attscale Sync="TRUE">8</attscale>
                    </attr>
                    <attr>
                        <attrlabl Sync="TRUE">OBJECTID</attrlabl>
                        <attalias Sync="TRUE">OBJECTID</attalias>
                        <attrtype Sync="TRUE">OID</attrtype>
                        <attwidth Sync="TRUE">4</attwidth>
                        <atprecis Sync="TRUE">10</atprecis>
                        <attscale Sync="TRUE">0</attscale>
                        <attrdef Sync="TRUE">Internal feature number.</attrdef>
                        <attrdefs Sync="TRUE">Esri</attrdefs>
                        <attrdomv>
                            <udom Sync="TRUE">Sequential unique whole numbers that are automatically generated.</udom>
                        </attrdomv>
                    </attr>
                    <attr>
                        <attrlabl Sync="TRUE">SHAPE</attrlabl>
                        <attalias Sync="TRUE">SHAPE</attalias>
                        <attrtype Sync="TRUE">Geometry</attrtype>
                        <attwidth Sync="TRUE">4</attwidth>
                        <atprecis Sync="TRUE">0</atprecis>
                        <attscale Sync="TRUE">0</attscale>
                        <attrdef Sync="TRUE">Feature geometry.</attrdef>
                        <attrdefs Sync="TRUE">ESRI</attrdefs>
                        <attrdomv>
                            <udom Sync="TRUE">Coordinates defining the features.</udom>
                        </attrdomv>
                    </attr>
                    <attr>
                        <attrlabl Sync="TRUE">GLOBALID</attrlabl>
                        <attalias Sync="TRUE">GLOBALID</attalias>
                        <attrtype Sync="TRUE">GlobalID</attrtype>
                        <attwidth Sync="TRUE">38</attwidth>
                        <atprecis Sync="TRUE">0</atprecis>
                        <attscale Sync="TRUE">0</attscale>
                    </attr>
                    <attr>
                        <attrlabl Sync="TRUE">CREATED_USER</attrlabl>
                        <attalias Sync="TRUE">CREATED_USER</attalias>
                        <attrtype Sync="TRUE">String</attrtype>
                        <attwidth Sync="TRUE">255</attwidth>
                        <atprecis Sync="TRUE">0</atprecis>
                        <attscale Sync="TRUE">0</attscale>
                    </attr>
                    <attr>
                        <attrlabl Sync="TRUE">CREATED_DATE</attrlabl>
                        <attalias Sync="TRUE">CREATED_DATE</attalias>
                        <attrtype Sync="TRUE">Date</attrtype>
                        <attwidth Sync="TRUE">8</attwidth>
                        <atprecis Sync="TRUE">0</atprecis>
                        <attscale Sync="TRUE">0</attscale>
                    </attr>
                    <attr>
                        <attrlabl Sync="TRUE">LAST_EDITED_USER</attrlabl>
                        <attalias Sync="TRUE">LAST_EDITED_USER</attalias>
                        <attrtype Sync="TRUE">String</attrtype>
                        <attwidth Sync="TRUE">255</attwidth>
                        <atprecis Sync="TRUE">0</atprecis>
                        <attscale Sync="TRUE">0</attscale>
                    </attr>
                    <attr>
                        <attrlabl Sync="TRUE">LAST_EDITED_DATE</attrlabl>
                        <attalias Sync="TRUE">LAST_EDITED_DATE</attalias>
                        <attrtype Sync="TRUE">Date</attrtype>
                        <attwidth Sync="TRUE">8</attwidth>
                        <atprecis Sync="TRUE">0</atprecis>
                        <attscale Sync="TRUE">0</attscale>
                    </attr>
                    <attr>
                        <attrlabl Sync="TRUE">LOCAL_POPULATION</attrlabl>
                        <attalias Sync="TRUE">Local_Population</attalias>
                        <attrtype Sync="TRUE">Integer</attrtype>
                        <attwidth Sync="TRUE">4</attwidth>
                        <atprecis Sync="TRUE">10</atprecis>
                        <attscale Sync="TRUE">0</attscale>
                    </attr>
                    <attr>
                        <attrlabl Sync="TRUE">FOREIGN_POPULATION</attrlabl>
                        <attalias Sync="TRUE">Foreign_Population</attalias>
                        <attrtype Sync="TRUE">Integer</attrtype>
                        <attwidth Sync="TRUE">4</attwidth>
                        <atprecis Sync="TRUE">10</atprecis>
                        <attscale Sync="TRUE">0</attscale>
                    </attr>
                    <attr>
                        <attrlabl Sync="TRUE">POPULATION2016</attrlabl>
                        <attalias Sync="TRUE">Population2016</attalias>
                        <attrtype Sync="TRUE">Integer</attrtype>
                        <attwidth Sync="TRUE">4</attwidth>
                        <atprecis Sync="TRUE">10</atprecis>
                        <attscale Sync="TRUE">0</attscale>
                    </attr>
                    <attr>
                        <attrlabl Sync="TRUE">AREA_USE</attrlabl>
                        <attalias Sync="TRUE">AREA_USE</attalias>
                        <attrtype Sync="TRUE">String</attrtype>
                        <attwidth Sync="TRUE">1</attwidth>
                        <atprecis Sync="TRUE">0</atprecis>
                        <attscale Sync="TRUE">0</attscale>
                    </attr>
                    <attr>
                        <attrlabl Sync="TRUE">SHAPE.AREA</attrlabl>
                        <attalias Sync="TRUE">SHAPE.AREA</attalias>
                        <attrtype Sync="TRUE">Double</attrtype>
                        <attwidth Sync="TRUE">0</attwidth>
                        <atprecis Sync="TRUE">0</atprecis>
                        <attscale Sync="TRUE">0</attscale>
                    </attr>
                    <attr>
                        <attrlabl Sync="TRUE">SHAPE.LEN</attrlabl>
                        <attalias Sync="TRUE">SHAPE.LEN</attalias>
                        <attrtype Sync="TRUE">Double</attrtype>
                        <attwidth Sync="TRUE">0</attwidth>
                        <atprecis Sync="TRUE">0</atprecis>
                        <attscale Sync="TRUE">0</attscale>
                    </attr>
                </detailed>
            </eainfo>
            <mdDateSt Sync="TRUE">20180711</mdDateSt>
        </metadata>`;
        fetchMock.once("*", xml);
        const result = await fetchItemEnrichments(item, ["metadata"]);
        const metadata = result.metadata;
        const expected: any = datasetWithMetadata.data.attributes.metadata;
        // at the time of processing the mock dataset
        // TheDuke used an older version of fast-xml-parser that:
        // - ignores the xml:lang attribute
        // - did not parse the contents of the peXml attribute
        // so we make a few adjustmens to our expectations
        expected.metadata["@_xml:lang"] = "en";
        expected.metadata.Esri.DataProperties.coordRef.peXml =
          metadata.metadata.Esri.DataProperties.coordRef.peXml;
        expect(metadata).toEqual(expected);
      });
      it("handles errors", async () => {
        fetchMock.once("*", 404);
        const result = await fetchItemEnrichments(item, ["metadata"]);
        // we don't throw an error if the metadata doesn't exist
        expect(result.metadata).toBeNull();
        expect(result.errors).toBeUndefined();
      });
    });
  });
});
