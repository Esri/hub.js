import { ArcGISContext } from "../../src/ArcGISContext";
import { acceptAssociation } from "../../src/associations/acceptAssociation";
import { MOCK_PARENT_ENTITY } from "./fixtures";
import * as AssociationsModule from "../../src/associations";

describe("acceptAssociation", () => {
  let requestAssociation: jasmine.Spy;
  beforeEach(() => {
    requestAssociation = spyOn(
      AssociationsModule,
      "requestAssociation"
    ).and.returnValue(Promise.resolve());
  });

  it("delegates to requestAssociation", async () => {
    await acceptAssociation(
      MOCK_PARENT_ENTITY,
      "project",
      "child-00a",
      {} as ArcGISContext
    );

    expect(requestAssociation).toHaveBeenCalledTimes(1);
    expect(requestAssociation).toHaveBeenCalledWith(
      MOCK_PARENT_ENTITY,
      "project",
      "child-00a",
      {}
    );
  });
});
