import { getTheme, DEFAULT_THEME } from "../src";
import { IPortal } from "@esri/arcgis-rest-portal";

describe("getTheme", () => {
  it("returns default theme if no shared theme", async () => {
    expect(getTheme({} as IPortal)).toEqual(DEFAULT_THEME);
  });

  it("extends default theme ", async () => {
    expect(
      getTheme(({
        portalProperties: {
          sharedTheme: {
            header: {
              background: "custom-background"
            },
            body: {
              text: "foobar"
            }
          }
        }
      } as unknown) as IPortal)
    ).toEqual({
      header: {
        background: "custom-background",
        text: "#4c4c4c"
      },
      body: {
        background: "#fff",
        text: "foobar",
        link: "#0079c1"
      },
      button: {
        background: "#0079c1",
        text: "#fff"
      },
      logo: {
        small: ""
      },
      fonts: {
        base: {
          url: "",
          family: "Avenir Next"
        },
        heading: {
          url: "",
          family: "Avenir Next"
        }
      }
    });
  });
});
