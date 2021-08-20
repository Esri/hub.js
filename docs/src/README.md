# How to Author Guides

Generally, make a `.md` file in the `/docs/src/guides` folder. Add Markdown. Done.

## Adding to Table of Contents

To link your guide into the generated website, it must have a header block that tells the doc processing system how to connect it

```md
---
title: Composing Workflows
navTitle: Composing Workflows
description: Constructing Pipelines with createOperationPipeline.
group: 2-concepts
order: 80
---
```

- `title`: what's show in the document's title
- `navTitle`: the link text
- `description`: header meta into for SEO
- `group`: what "section" of the Guides TOC should this be added to?
- `order`: relative position in the list. Typically incremented by 10, so we can "interleave" other content over time w/o needing to re-number all the pages

## Developing Docs

To preview the doc site locally, from the root of the repo, run

```sh
$> npm run docs:serve
```

This will run an Acetate development server, and open the doc site on `http://localhost:3000`. This development server is not particularly stable, so it's not unusual for it to blow up as you edit files, particularly if you edit the table of content section listed above. Just re-start the server.
