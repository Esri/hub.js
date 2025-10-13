import { ArcGISRequestError } from "@esri/arcgis-rest-request";

export default class ExceptionFactory {
  public static createItemMissingError(
    props: Record<string, unknown> = {}
  ): unknown {
    const response = Object.assign({}, rawItemNotFoundResponse.error, props);
    return new ArcGISRequestError(response.message, response.code, response);
  }
  public static createInvalidTokenError(
    props: Record<string, unknown> = {}
  ): unknown {
    const response = Object.assign({}, rawInvalidTokenResponse.error, props);
    return new ArcGISRequestError(response.message, response.code, response);
  }
}

const rawItemNotFoundResponse = {
  error: {
    code: 400,
    messageCode: "CONT_0001",
    message: "Item does not exist or is inaccessible.",
    details: [] as unknown[],
  },
};

const rawInvalidTokenResponse = {
  error: {
    code: 498,
    message: "Invalid token.",
    details: [] as string[],
  },
};
