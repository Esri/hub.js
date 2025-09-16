import { Catalog } from "../../search/Catalog";
import { truncateSlug } from "../../items/_internal/slugs";
import { editorToMetric } from "../../metrics";
import {
  upsertResource,
  doesResourceExist,
  removeResource,
} from "../../resources";
import { initCatalogOnEntityCreate } from "../../search/initCatalogOnEntityCreate";
import { IArcGISContext } from "../../types";
import { camelize, cloneObject, createId } from "../../util";
import { setMetricAndDisplay } from "../schemas/internal/metrics/setMetricAndDisplay";
import { IHubItemEntity, IHubItemEntityEditor, IHubLocation } from "../types";
import { getTemplate } from "./getTemplate";

/**
 * Convert editor values back into an IHubItemEntity,
 * performing any pre-save operations/XHRs/transforms.
 * @param editor - the editor object to convert
 * @param context - contextual portal & auth information
 */
export const hubItemEntityFromEditor = async (
  editor: IHubItemEntityEditor<IHubItemEntity>,
  context: IArcGISContext
): Promise<{
  entity: IHubItemEntity;
  _catalog?: Catalog;
  thumbnailCache?: { file?: Blob; filename?: string; clear: boolean };
}> => {
  let catalog;
  let thumbnailCache;

  // 1. extract the ephemeral props we graft onto the
  // editor for later use
  const _thumbnail = editor._thumbnail as { blob?: Blob; fileName?: string };
  const _catalogSetup = editor._catalogSetup;
  const _layoutSetup = editor._layoutSetup;
  const _metric = editor._metric;
  const _slug = editor._slug;
  const _featuredImage = editor.view?.featuredImage as {
    blob?: Blob;
    fileName?: string;
  };

  // 2. remove the ephemeral props we graft onto the editor
  delete editor._groups;
  delete editor._thumbnail;
  delete editor.view?.featuredImage;
  delete editor._layoutSetup;
  delete editor._metric;
  delete editor._catalogSetup;
  delete editor._slug;

  let entity = cloneObject(editor) as IHubItemEntity;

  // 3. ensure orgUrlKey is set and downcased
  entity.orgUrlKey = editor.orgUrlKey
    ? (editor.orgUrlKey as string)
    : (context.portal.urlKey as string) || ("" as string);
  entity.orgUrlKey = (entity.orgUrlKey as string).toLowerCase();

  // 4. copy the configured location extent up one level
  // on the entity.
  entity.extent = (editor.location as IHubLocation)?.extent;

  // 5. Perform pre-save operations using the ephemeral
  // properties that were extracted above.

  // a. ensure the slug is truncated
  if (_slug) {
    // ensure the slug is truncated
    entity.slug = truncateSlug(_slug, entity.orgUrlKey);
  } else {
    // if no slug is passed in, save an empty string as
    // the slug, so that it is not saved as the orgUrlKey
    // truncated with an empty string
    entity.slug = "";
  }

  // b. conditionally set the thumbnailCache to
  // ensure that the configured thumbnail is updated
  // on the next save
  if (_thumbnail) {
    if (_thumbnail.blob) {
      thumbnailCache = {
        file: _thumbnail.blob,
        filename: _thumbnail.fileName,
        clear: false,
      };
    } else {
      thumbnailCache = {
        clear: true,
      };
    }
  }

  // c. conditionally upsert or remove the configured
  // featured image
  if (_featuredImage) {
    let featuredImageUrl: string | null = null;
    if (_featuredImage.blob) {
      featuredImageUrl = await upsertResource(
        entity.id,
        entity.owner,
        _featuredImage.blob,
        "featuredImage.png",
        context.userRequestOptions
      );
    } else if (
      await doesResourceExist(
        entity.id,
        "featuredImage.png",
        context.userRequestOptions
      )
    ) {
      await removeResource(
        entity.id,
        "featuredImage.png",
        entity.owner,
        context.userRequestOptions
      );
    }

    entity.view = {
      ...entity.view,
      featuredImageUrl,
    };
  }

  // d. handle catalog setup
  if (
    _catalogSetup?.type === "newGroup" ||
    (_catalogSetup?.type === "existingGroup" && _catalogSetup.groupId)
  ) {
    entity.catalog = await initCatalogOnEntityCreate(
      entity,
      _catalogSetup,
      context
    );
    catalog = Catalog.fromJson(entity.catalog, context);
  }

  // e. handle metrics
  if (_metric && Object.keys(_metric).length) {
    const metricId =
      (_metric.metricId as string) ||
      createId(camelize(`${_metric.cardTitle as string}_`));
    const { metric, displayConfig } = editorToMetric(_metric, metricId, {
      metricName: _metric.cardTitle as string,
    });

    entity = setMetricAndDisplay(entity, metric, displayConfig);
  }

  // f. handle layout setups in sites and pages
  if (_layoutSetup && _layoutSetup.layout) {
    entity.layout = await getTemplate(_layoutSetup.layout as string);
  } else {
    entity.layout = await getTemplate("blank");
  }

  return {
    entity,
    ...(thumbnailCache && { thumbnailCache }),
    ...(catalog && { _catalog: catalog }),
  };
};
