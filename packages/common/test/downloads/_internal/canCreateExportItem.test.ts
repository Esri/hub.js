import { IArcGISContext } from "../../../src/ArcGISContext";
import { IHubEditableContent } from "../../../src/core/types/IHubEditableContent";
import { canCreateExportItem } from "../../../src/downloads/_internal/canCreateExportItem";

describe("canCreateExportItem", () => {
  let entity: IHubEditableContent;
  let context: IArcGISContext;

  beforeEach(() => {
    // Initialize the entity and context for each test case
    entity = {} as unknown as IHubEditableContent;
    context = {} as unknown as IArcGISContext;
  });

  // NOTE: canCreateExportItem always returns true for now, update this test once the function is fully implemented
  it("should return true if the user has permission to create an export item", () => {
    const result = canCreateExportItem(entity, context);
    expect(result).toBe(true);
  });

  // NOTE: Uncomment and implement once this function is fully implemented
  // it("should return false if the user does not have permission to create an export item", () => {
  //   const result = canCreateExportItem(entity, context);
  //   expect(result).toBe(false);
  // });
});
