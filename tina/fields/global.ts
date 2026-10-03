import type { TinaField } from "tinacms";

export function globalFields(): TinaField[] {
  return [
    {
      type: "string",
      name: "siteName",
      label: "Site Name",
    },
    {
      type: "object",
      name: "header",
      label: "Header",
      fields: [
        {
          type: "object",
          name: "logo",
          label: "Logo",
          fields: [
            {
              type: "image",
              name: "image",
              label: "Logo Image",
            },
            {
              type: "string",
              name: "text",
              label: "Logo Text",
            },
          ],
        },
        {
          type: "object",
          name: "menuItems",
          label: "Menu Items",
          list: true,
          fields: [
            {
              type: "string",
              name: "label",
              label: "Label",
              required: true,
            },
            {
              type: "string",
              name: "href",
              label: "URL",
              required: true,
            },
          ],
        },
      ],
    },
    {
      type: "object",
      name: "footer",
      label: "Footer",
      fields: [
        {
          type: "string",
          name: "copyright",
          label: "Copyright",
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
          type: "object",
          name: "socialLinks",
          label: "Social Links",
          list: true,
          fields: [
            {
              type: "string",
              name: "icon",
              label: "Icon",
            },
            {
              type: "string",
              name: "href",
              label: "URL",
              required: true,
            },
            {
              type: "string",
              name: "label",
              label: "Label",
            },
          ],
        },
        {
            type: "object",
            name: "footerLinks",
            label: "Footer Links",
            list: true,
            fields: [
              {
                type: "string",
                name: "label",
                label: "Label",
                required: true,
              },
              {
                type: "string",
                name: "href",
                label: "URL",
                required: true,
              },
            ],
          },
      ],
    },
  ];
}