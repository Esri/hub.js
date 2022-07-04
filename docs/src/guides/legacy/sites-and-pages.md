---
title: Working with Sites and Pages.
navTitle: Sites and Pages
description: Learn how to work with Sites, Pages and Domains using @esri/hub.js.
order: 20
group: 5-legacy
---

## Sites and Pages

The `sites` package in Hub.js exposes functions used to load, create, update, and remove `Hub Site Application` items and `Hub Page` items, as well as functions to manipulate site domain records, streamline the linking/unlinking of Pages to Sites.

Additionally, the package contains functions that can convert Site and Page items into json templates, and go from a json template back into operatational items. for inclusion in Solution items.

**Note:** ArcGIS Enterprise uses `Site Application` and `Page` item types

## Lookup a Site by it's domain entry

For ArcGIS Hub, a site's domain is exactly that - the full domain on which the site is hosted.

A Hub domain can take two forms:

- a "default" domain constructed as `{sitename}-{orgkey}.hub.arcgis.com`
- a "custom" domain, registered by the site owner using a DNS registrar, that has a CNAME entry pointing to `hub.arcgis.com`

Site domain records are stored in the Hub API. We can lookup the site item and owning orgId along with other related properties using the [lookupDomain](https://esri.github.io/hub.js/api/sites/lookupDomain/) function:

```js
import { lookupDomain } from '@esri/hub-sites';
...
// See the Authentication Guide for details on how to create hubRequestOptions
...
return lookupDomain('data-myorg.hub.arcgis.com', hubRequestOptions)
.then((domainInfo) => {
  console.log(`Domain ${domainInfo.hostname} belongs to org ${domainInfo.orgId} and is backed by item ${domainInfo.itemId})
})
```

For ArcGIS Enterprise, domains operate differently. At this time, Sites in ArcGIS Enterprise are hosted at `https://{your-portal-url}/{portal-instance}/apps/sites/#{site-domain}`.

We can use the `lookupDomain` function to locate the site item - but it should be noted that instead of returning an [IDomainEntry](https://esri.github.io/hub.js/api/sites/IDomainEntry/), for ArcGIS Enterprise `lookupDomain` will simply return a hash containing the `hostname` and the `siteId`.

## Update a Site's domain

In this example we will get the domain records for a specific site, and update the domain of a site.

```js
import { getDomainsForSite, updateDomain } from "@esri/hub-sites";
import { findBy } from "@esri/hub-common";

// See the Authentication Guide for details on how to create hubRequestOptions
const siteId = "3ef";
const currentDomain = "beta-myorg.hub.arcgis.com";
const newDomain = "data-myorg.hub.arcgis.com";

// get domain records for the site
return getDomainsForSite(siteId, hubRequestOptions)
  .then((domains) => {
    // since sites can have multiple domains, let's find the one we want to change
    const domainToChange = domains.findBy(domains, "domain", currentDomain);
    // update the domain property to the new domain
    domainToChange.hostname = newDomain;
    // save the change
    return updateDomain(domainToChange, hubRequestOptions);
  })
  .then((result) => {
    //> result will be the updated domainEntry object returned from the Hub API
  });
```

## Remove a Site

To cleanly remove a Site, the following actions need to occur:

- Unprotect and delete the related Initiative item (if Hub Premium)
- Locate and remove all related Team groups
- remove all Domain entries from the Hub Domain service
- locate any pages connected to the site, and remove the site references from them
- Unprotect the Site item
- Site item is deleted

If all of these steps are not done, you will have orphan groups and items in your organization. Thus, we strongly recommend using the `removeSite` function, which handles all these things in one call.

```js
import { removeSite } from "@esri/hub-sites";
// See the Authentication Guide for details on how to create hubRequestOptions
return removeSite("3ef", hubRequestOptions).then((result) => {
  //> result = {success: true}
});
```
