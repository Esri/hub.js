# Enrichment Streamlining

Single entry fn

```
enrichContent(
  type:string,
  content:Partial<IHubContent>,
  requestOptions: IHubRequestOptions
  ):Promise<IHubContent> {...}
```

For composition, we should have a single input and return type for all the enrichment functions

```
export interface IEnrichmentOpts {
  content: Partial<IHubContent>,
  requestOptions?: IHubRequestOptions
}
```

Each enrichment should handle merging in any errors so we have no processing "at the end"

If there is more complex logic re: when an enrichment should be run, do that inside the enrichment vs outside... then all the logic is in one place

Each enrichment fn has this signature:

```
// All enrichments use promises, so we can treat them the same for composition
const enrichDates(enrichmentOpts: IEnrichmentArgs):Promise<IEnrichmentOpts> {..}
```

Declarative Composition:

Things to capture:

- what should always be done
- what should be done for specific types
- what should be done for "summary" vs "complete"
  - basically don't super-enrich things we'll show in a list

```
const enrichmentMap = {
  common: {
    simple: [
      // if these are strings, we have to map into a set of functions
      // but we could also import all the fns and just list them, so
      enrichDates,
    ],
    complete: [
      enrichDates,
      ownerUser
    ]
  }
  types: {
    hubSiteApplication: {
      simple: [...],
      complete: [ domainEntries ]
    },
  }
}
```

Then we look up based on the type, merge common w/ any type specific stuff, and return a composition

```
// async pipe fn
const pipe = (...functions) => input => functions.reduce((chain, func) => chain.then(func), Promise.resolve(input));

getEnrichments(type, content) {
  const base = getWithDefault(enrichmentMap, `common.${type}`, []);
  const typeName = camelize(content.type);
  const extentions = getWithDefault(enrichmentMap, `types.${typeName}.${type}`, []);
  return [...base, ...extensions];
}

enrichContent(type: string, content:Partial<IHubContent>, ro):Promise<IHubContent> {
  const enrichments = getEnrichments(type, content);
  const opts = {content, requestOptions} as IEnrichmentOptions;
  return pipe(enrichments)(opts).then((result) => {
    return result.content;
  });

}

```
