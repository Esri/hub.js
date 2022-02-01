/**
 *   Dasherize a string
 *
 *  ```javascript
 *  import { dasherize } from '@esri/hub-common';
 *  dasherize('innerHTML');                // 'inner-html'
 *  dasherize('action_name');              // 'action-name'
 *  dasherize('css-class-name');           // 'css-class-name'
 *  dasherize('my favorite items');        // 'my-favorite-items'
 *  dasherize('privateDocs/ownerInvoice';  // 'private-docs/owner-invoice'
 *  ```
 *
 *  Extracted and modified from Ember.js source code - MIT license
 *  @param value
 *  @returns
 */
export function dasherize(value: string): string {
  const DECAMELIZE_REGEXP = /([a-z\d])([A-Z])/g;
  const DASHERIZE_REGEXP = /[ _]/g;
  return value
    .replace(DECAMELIZE_REGEXP, "$1_$2")
    .toLowerCase()
    .replace(DASHERIZE_REGEXP, "-");
}
