import type { TinaField } from "tinacms";
export function heroFields(): TinaField[] {
  return [
    {
      type: "object",
      name: "hero",
      label: "Hero",
      fields: [
        {
          type: "string",
          name: "title",
          label: "Title",
          required: true,
        },
        {
          type: "string",
          name: "subtitle",
          label: "Subtitle",
          ui: {
            component: "textarea",
          },
        },
        {
          type: "string",
          name: "ctaText",
          label: "CTA Button Text",
        },
        {
          type: "image",
          name: "bgImage",
          label: "Background Image",
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