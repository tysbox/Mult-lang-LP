import { defineConfig } from "tinacms";
import { globalFields } from "./fields/global";
import { heroFields } from "./fields/hero";
import { contentBlockFields } from "./fields/contentBlock";
import { galleryFields } from "./fields/gallery";
import { faqFields } from "./fields/faq";
import { contactFields } from "./fields/contact";

// Your hosting provider likely exposes this as an environment variable
const branch =
  process.env.HEAD || process.env.VERCEL_GIT_COMMIT_REF || "master";

export default defineConfig({
  branch,

  clientId: process.env.TINA_CLIENT_ID, // Get this from tina.io
  token: process.env.TINA_TOKEN, // Get this from tina.io

  build: {
    outputFolder: "admin",
    publicFolder: "public",
  },
  media: {
    tina: {
      mediaRoot: "uploads",
      publicFolder: "public",
    },
  },
  schema: {
    collections: [
      {
        name: "page",
        label: "Page",
        path: "content/pages",
        format: "json",
        ui: {
          router: ({ document }) => {
            // ファイル名の規則: home.json (en) / home.ja.json (ja) / home.zh.json ...
            const filename = document._sys.filename; // 例: "home", "home.ja"
            const [base, lang] = filename.split(".");
            const prefix = lang ? `/${lang}` : "";
            if (base === "home") {
              return `${prefix}/`;
            }
            return `${prefix}/${base}`;
          },
        },
        fields: [
          {
            type: "string",
            name: "title",
            label: "Title",
            isTitle: true,
            required: true,
          },
          {
            type: "object",
            name: "nav",
            label: "Navigation",
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
          ...heroFields(),
          {
            type: "object",
            name: "founder",
            label: "Founder",
            fields: contentBlockFields(),
          },
          {
            type: "object",
            name: "journeys",
            label: "Journeys",
            fields: contentBlockFields(),
          },
          {
            type: "object",
            name: "intro",
            label: "Intro",
            fields: contentBlockFields(),
          },
          {
            type: "object",
            name: "galleries",
            label: "Galleries",
            list: true,
            fields: galleryFields(),
          },
          ...faqFields(),
          ...contactFields(),
        ],
      },
      {
        name: "global",
        label: "Global",
        path: "content/global",
        format: "json",
        ui: {
          global: true,
        },
        fields: globalFields(),
      },
    ],
  },
});
