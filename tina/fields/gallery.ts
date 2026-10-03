import type { TinaField } from "tinacms";

export function galleryFields(): TinaField[] {
  return [
    {
      type: "string",
      name: "id",
      label: "ID (for navigation anchor)",
      required: true,
    },
    {
      type: "string",
      name: "title",
      label: "Title",
    },
    {
      type: "string",
      name: "description",
      label: "Description",
      ui: {
        component: "textarea",
      },
    },
    {
      type: "string",
      name: "dividerPattern",
      label: "Divider Pattern (SVG URL)",
    },
    {
      type: "object",
      name: "items",
      label: "Gallery Items",
      list: true,
      fields: [
        {
          type: "string",
          name: "title",
          label: "Title",
        },
        {
          type: "string",
          name: "description",
          label: "Description",
          ui: {
            component: "textarea",
          },
        },
        {
          type: "image",
          name: "image",
          label: "Image",
        },
        {
          type: "string",
          name: "alt",
          label: "Image Alt Text",
        },
      ],
    },
  ];
}