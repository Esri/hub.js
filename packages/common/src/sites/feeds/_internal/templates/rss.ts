export const RSS_2X_DEFAULT = {
  channel: {
    title: "{{name}}",
    description: "{{searchDescription}}",
    link: "{{siteUrl}}",
    language: "{{culture}}",
    category: "{{categories}}",
    item: {
      title: "{{name}}",
      description: "{{searchDescription}}",
      author: "{{orgContactEmail}}",
      category: "{{categories}}",
      pubDate: "{{created:toUTC}}",
    },
  },
};
