import type { TinaField } from "tinacms";
export function contentBlockFields(): TinaField[] {
  return [
    {
      type: "string",
      name: "id",
      label: "ID (for navigation anchor)",
    },
    {
      type: "string",
      name: "preheading",
      label: "Pre-heading",
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
      type: "image",
      name: "image",
      label: "Image",
    },
    {
      type: "string",
      name: "imageAlt",
      label: "Image Alt Text",
    },
    {
      type: "boolean",
      name: "isSplit",
      label: "Enable Split Layout",
    },
  ];
}
