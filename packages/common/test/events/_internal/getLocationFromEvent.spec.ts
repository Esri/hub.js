import {
  describe,
  it,
  expect,
} from "vitest";
import { IHubLocation } from "../../../src/core/types/IHubLocation";
import { getLocationFromEvent } from "../../../src/events/_internal/getLocationFromEvent";
import {
  EventLocationType,
  IEvent,
} from "../../../src/events/api/orval/api/orval-events";

describe("getLocationFromEvent", () => {
  it('should return a location object of type "none"', () => {
    const event: Partial<IEvent> = { id: "31c" };
    expect(getLocationFromEvent(event)).toEqual({ type: "none" });
  });
  it('should return a location object of type "org"', () => {
    const event: Partial<IEvent> = {
      id: "31c",
      location: {
        id: "cm1faunz900i25y012lygo6b7",
        addNum: null,
        city: null,
        cntryName: null,
        eventId: "cm1fat0fl00hw5y01l95xp05j",
        extent: [
          [-134.7469999999955, 20.66992270076423],
          [-55.69599999999812, 50.3089999999983],
        ],
        geometries: [
          {
            type: "polygon",
            rings: [
              [
                [-134.7469999999955, 20.66992270076423],
                [-134.7469999999955, 50.3089999999983],
                [-55.69599999999812, 50.3089999999983],
                [-55.69599999999812, 20.66992270076423],
                [-134.7469999999955, 20.66992270076423],
              ],
            ],
            spatialReference: {
              wkid: 4326,
            },
          },
        ],
        nbrhd: null,
        placeAddr: null,
        placeName: null,
        postal: null,
        region: null,
        spatialReference: {
          wkid: 4326,
        },
        stDir: null,
        stName: null,
        stType: null,
        subRegion: null,
        type: EventLocationType.org,
      },
    };
    expect(getLocationFromEvent(event)).toEqual({
      type: "org",
      spatialReference: { wkid: 4326 },
      extent: [
        [-134.7469999999955, 20.66992270076423],
        [-55.69599999999812, 50.3089999999983],
      ],
      geometries: [
        {
          type: "polygon",
          rings: [
            [
              [-134.7469999999955, 20.66992270076423],
              [-134.7469999999955, 50.3089999999983],
              [-55.69599999999812, 50.3089999999983],
              [-55.69599999999812, 20.66992270076423],
              [-134.7469999999955, 20.66992270076423],
            ],
          ],
          spatialReference: Object({ wkid: 4326 }),
        },
      ],
      name: null,
    } as unknown as IHubLocation);
  });
  it('should return a location object of type "custom" with a point', () => {
    const event: Partial<IEvent> = {
      id: "31c",
      location: {
        id: "cm1gtkbua00a23w01sbsxi82p",
        addNum: null,
        city: null,
        cntryName: null,
        eventId: "clzk9pssv007a6001c93uijky",
        extent: [
          [-76.86333891686775, 40.33607098418021],
          [-76.85833891686775, 40.34107098418021],
        ],
        geometries: [
          {
            x: -76.86083891686775,
            y: 40.33857098418021,
            type: "point",
            spatialReference: {
              wkid: 4326,
            },
          },
        ],
        nbrhd: null,
        placeAddr: null,
        placeName: null,
        postal: null,
        region: null,
        spatialReference: {
          wkid: 4326,
        },
        stDir: null,
        stName: null,
        stType: null,
        subRegion: null,
        type: EventLocationType.custom,
      },
    };
    expect(getLocationFromEvent(event)).toEqual({
      type: "custom",
      spatialReference: { wkid: 4326 },
      extent: [
        [-76.86333891686775, 40.33607098418021],
        [-76.85833891686775, 40.34107098418021],
      ],
      geometries: [
        {
          x: -76.86083891686775,
          y: 40.33857098418021,
          type: "point",
          spatialReference: Object({ wkid: 4326 }),
        },
      ],
      name: null,
    } as unknown as IHubLocation);
  });
  it('should return a location object of type "custom" with a polyline', () => {
    const event: Partial<IEvent> = {
      id: "31c",
      location: {
        id: "cm1gtrscq00ad3v01rc1smyow",
        addNum: null,
        city: null,
        cntryName: null,
        eventId: "clzk9pssv007a6001c93uijky",
        extent: [
          [-76.86115443265787, 40.33838940207084],
          [-76.860602316696, 40.33878393629663],
        ],
        geometries: [
          {
            type: "polyline",
            paths: [
              [
                [-76.86060797448064, 40.33878393629663],
                [-76.86097834982701, 40.33874384568065],
                [-76.86115443265787, 40.33856219176634],
                [-76.86096489687243, 40.33838940207084],
                [-76.860602316696, 40.33848133940521],
                [-76.8606066543309, 40.33878045432375],
              ],
            ],
            spatialReference: {
              wkid: 4326,
            },
          },
        ],
        nbrhd: null,
        placeAddr: null,
        placeName: null,
        postal: null,
        region: null,
        spatialReference: {
          wkid: 4326,
        },
        stDir: null,
        stName: null,
        stType: null,
        subRegion: null,
        type: EventLocationType.custom,
      },
    };
    expect(getLocationFromEvent(event)).toEqual({
      type: "custom",
      spatialReference: { wkid: 4326 },
      extent: [
        [-76.86115443265787, 40.33838940207084],
        [-76.860602316696, 40.33878393629663],
      ],
      geometries: [
        {
          type: "polyline",
          paths: [
            [
              [-76.86060797448064, 40.33878393629663],
              [-76.86097834982701, 40.33874384568065],
              [-76.86115443265787, 40.33856219176634],
              [-76.86096489687243, 40.33838940207084],
              [-76.860602316696, 40.33848133940521],
              [-76.8606066543309, 40.33878045432375],
            ],
          ],
          spatialReference: { wkid: 4326 },
        },
      ],
      name: null,
    } as unknown as IHubLocation);
  });
  it('should return a location object of type "custom" with a polygon', () => {
    const event: Partial<IEvent> = {
      id: "31c",
      location: {
        id: "cm1gtvv6t00a63w015j0118uf",
        addNum: null,
        city: null,
        cntryName: null,
        eventId: "clzk9pssv007a6001c93uijky",
        extent: [
          [-76.86100727787036, 40.33838789303515],
          [-76.8607543120326, 40.33876690214137],
        ],
        geometries: [
          {
            type: "polygon",
            rings: [
              [
                [-76.8607543120326, 40.33876690214137],
                [-76.86080192124261, 40.33838789303515],
                [-76.86100727787036, 40.33867088425338],
                [-76.8607543120326, 40.33876690214137],
              ],
            ],
            spatialReference: {
              wkid: 4326,
            },
          },
        ],
        nbrhd: null,
        placeAddr: null,
        placeName: null,
        postal: null,
        region: null,
        spatialReference: {
          wkid: 4326,
        },
        stDir: null,
        stName: null,
        stType: null,
        subRegion: null,
        type: EventLocationType.custom,
      },
    };
    expect(getLocationFromEvent(event)).toEqual({
      type: "custom",
      spatialReference: { wkid: 4326 },
      extent: [
        [-76.86100727787036, 40.33838789303515],
        [-76.8607543120326, 40.33876690214137],
      ],
      geometries: [
        {
          type: "polygon",
          rings: [
            [
              [-76.8607543120326, 40.33876690214137],
              [-76.86080192124261, 40.33838789303515],
              [-76.86100727787036, 40.33867088425338],
              [-76.8607543120326, 40.33876690214137],
            ],
          ],
          spatialReference: { wkid: 4326 },
        },
      ],
      name: null,
    } as unknown as IHubLocation);
  });
  it('should return a location object of type "custom" with a extent', () => {
    const event: Partial<IEvent> = {
      id: "31c",
      location: {
        id: "cm1gu0kiv00ah3v01xl529ps4",
        addNum: null,
        city: null,
        cntryName: null,
        eventId: "clzk9pssv007a6001c93uijky",
        extent: [
          [-76.86100126909348, 40.33846250062182],
          [-76.86068364735026, 40.33870983322092],
        ],
        geometries: [
          {
            type: "extent",
            xmax: -76.86068364735026,
            xmin: -76.86100126909348,
            ymax: 40.33870983322092,
            ymin: 40.33846250062182,
            spatialReference: {
              wkid: 4326,
            },
          },
        ],
        nbrhd: null,
        placeAddr: null,
        placeName: null,
        postal: null,
        region: null,
        spatialReference: {
          wkid: 4326,
        },
        stDir: null,
        stName: null,
        stType: null,
        subRegion: null,
        type: EventLocationType.custom,
      },
    };
    expect(getLocationFromEvent(event)).toEqual({
      type: "custom",
      spatialReference: { wkid: 4326 },
      extent: [
        [-76.86100126909348, 40.33846250062182],
        [-76.86068364735026, 40.33870983322092],
      ],
      geometries: [
        {
          type: "extent",
          xmax: -76.86068364735026,
          xmin: -76.86100126909348,
          ymax: 40.33870983322092,
          ymin: 40.33846250062182,
          spatialReference: { wkid: 4326 },
        },
      ],
      name: null,
    } as unknown as IHubLocation);
  });
});
