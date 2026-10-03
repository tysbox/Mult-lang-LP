import type { TinaField } from "tinacms";

export function faqFields(): TinaField[] {
  return [
    {
      type: "object",
      name: "faq",
      label: "FAQ Section",
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
          type: "object",
          name: "items",
          label: "FAQ Items",
          list: true,
          fields: [
            {
              type: "string",
              name: "question",
              label: "Question",
              required: true,
            },
            {
              type: "string",
              name: "answer",
              label: "Answer",
              required: true,
              ui: {
                component: "textarea",
              },
            },
          ],
        },
      ],
    },
  ];
}