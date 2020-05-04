import { adlib } from "adlib";

/**
 * Interpolates handlebars-style placeholders on an object graph
 * @param template
 * @param settings
 * @param transforms
 */
export function interpolate(template: any, settings: any, transforms?: any) {
  return adlib(template, settings, transforms);
}
