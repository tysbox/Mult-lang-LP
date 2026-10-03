import type { SiteData } from '../types';

export const SITE_DATA: SiteData = {
  nav: [
    { label: "Tradition", href: "#tradition" },
    { label: "Craftsmanship", href: "#craftsmanship" },
    { label: "Aesthetics", href: "#aesthetics" },
    { label: "FAQ", href: "#faq" },
  ],
  hero: {
    title: "Where Stillness Meets Motion",
    subtitle: "A modern reinterpretation of traditional Japanese aesthetics, celebrating the beauty of space, form, and spirit.",
    ctaText: "Begin the Journey",
    bgImage: "https://lh3.googleusercontent.com/aida-public/AB6AXuCKHs_VNUJk7rVSnu-wnXm4Lu0Ze8PlXIuUZLmg9u1xAyGGP2O5XX3kBPEd-HxrZVrtFJzriPRZ03GlMJfAE8GC1k8xq3Mmc6NdgzWCoQwFP3t0jRVJnNZ1jEZS21YUILPrLmdsAp_xnb2AhCbsCMxVlUqVjpK0U60_-YIwMoUkALf40Y39AAeMN0AI2BK9EX2w8fHju6KHNaaHcZ06gegUzgn_W2HfLw9Sc173JrFAAdWUZFWRdps8i3UwAwTuvWv634sLuAXfhNo",
    alt: "Serene Japanese temple garden with morning mist",
  },
  founder: {
    id: "founder",
    preheading: "Our Visionary",
    title: "A word from the Founder",
    description: '"Our journey began with a profound respect for the quiet elegance of Japanese culture. We seek to capture its essence—the mindful craftsmanship, the beauty in simplicity, and the deep connection to nature. This is not just about aesthetics; it\'s about a way of being. We believe that in the rush of modern life, there is a deep, resonant need for moments of pause, for the appreciation of the space between things. It is in this \'Ma\' that we find clarity and connection."',
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBvqIUnVq_mLakP0yvtI0u9FCfdYbeGHfhAMcr0aPBcZnRI_tMxQU6kltEMsSnDAM8P-2gqHZc8XRj0Q4ZVv7gosIKc9f7vAmE4wAZ-f6Axtpg_A_Rk4Gpq9lL3Hu6YGW3Bt8GN5t51Xobww0Hb1Yo1HkfS3jmHV2mofuisbiBeHQJXcI2K_Y6Z7HxTu4CldEzvt8eo4MjBooFr55VX3zlKjOAbzVvriw-x8rVIGs1HobvadLFpDlC4b3nAAX6-BmXxVOsxV89atM8",
    imageAlt: "Serene portrait of the founder",
  },
  journeys: {
    id: "journeys",
    title: "The Concept of Journeys",
    description: "Each path we take is a story, a collection of moments woven together. Our philosophy is rooted in this belief—that the journey itself holds the beauty, not just the destination. We explore the quiet narratives found in craftsmanship, the silent dialogues between light and shadow.",
  },
  intro: {
    id: "intro",
    preheading: "An Immersive Journey",
    title: "The Soul of 'Ma' (間)",
    description: "Discover the poetic essence of reinterpreted Japanese tradition, where the beauty of space defines the form and invites a moment of contemplation. We bridge ancient wisdom with contemporary design to create experiences of serene harmony.",
  },
  galleries: [
    {
      id: "tradition",
      title: "Reinterpreted Tradition",
      description: "Exploring how ancient forms of Japanese beauty find new life in modern contexts.",
      dividerPattern: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'%3E%3Cg fill='none' stroke='%23D4AF37' stroke-opacity='0.2' stroke-width='4'%3E%3Cpath d='M0 50 L50 0 L100 50 L50 100 Z'/%3E%3Cpath d='M0 0 L100 100'/%3E%3Cpath d='M0 100 L100 0'/%3E%3C/g%3E%3C/svg%3E")`,
      items: [
        {
          title: "Echoes of Form",
          description: "Where ancient contours find resonance in contemporary silhouettes, creating a timeless dialogue.",
          image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDfKykyJTfRFshPCuOZkz9GDJnjlQoKBrbluR9mTV9jlnKvL0iXkGAYAMIWmKFFhNvRvrr-SSsSkF1lhdBSaGEc_nV2lIUGnaEsWAVf6_q07abrT5P5Mf57ugVjJ9b0SxR8TEfYIg8_-2MoBibHSN8vBpRkZxhTrpMZEI5mqTG67NT07FfzjkxovP4T2ojxYgPJUmNtv6ycwkWtMo2bim8ZiVtLmICaHntcb6hlWcTLEd5kFdW-5teyglHWan3PDfHyrGBE18tm4KQ",
          alt: "Minimalist ceramic tea bowl",
        },
        {
          title: "Dialogue of Light",
          description: "Inspired by shoji, modern design plays with transparency, filtering light to sculpt serene spaces.",
          image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCC2mHzlQayuGLe2A0odEZZC-Jn1GtJOtKmULViPO2cw6xzvVc1HtMlUd_2PCJZvDNeXskI6j-h9xvYUYexTQNUzOnYo6bHKPVh5CO9iltL3_8SMS9Ip60kufcx2aXKFaHC_LIfjmv9glwbF87QPI4by2Tfr3ar8u-n03FfS1SuIH1uWfcxrQ40BfOKnsZmLPP8ELUzmqGq1wzM-nMisj5Y8FTQ6PeEWGcaXdUvuhIr8Sh47q2kQVXfN57-QWDODIfKeHrseYRchvc",
          alt: "Modern interior with shoji screen",
        },
        {
          title: "Golden Scars",
          description: "The art of Kintsugi teaches us to embrace imperfection, finding beauty in repaired history.",
          image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBYKbg_7FOwCIQllbwY94QDidHpG4NqtJL0Hb0S4fvAKifQGN4PY8jAMVLNr9Jdqz6yks_ulAwSuLMdInNpK6AjrJpeUyV3zWhCD8vrctxmnfvZLc8t75lXpUz4lCq4p0-IdUDYemroYQvSW2gX50DPzsqedWvPxaYnTkbDUs3Zup7yNZKYNqKEsq4-C41IKLSFWY7j9ahvJ7TztA2qxBN293SIuTSJMZU_rYw4AvUls--UxBsmMP4dwEYuWv7smPk2B-BnCrGI1wE",
          alt: "Kintsugi repaired pottery",
        },
      ]
    },
    {
      id: "craftsmanship",
      title: "Artisan Craftsmanship",
      description: "A dedication to material and process, where the maker's spirit is imbued in the object.",
      dividerPattern: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'%3E%3Cpath d='M0 50 Q 25 25, 50 50 T 100 50' stroke='%23D4AF37' stroke-opacity='0.2' stroke-width='4' fill='none'/%3E%3Cpath d='M0 75 Q 25 50, 50 75 T 100 75' stroke='%23D4AF37' stroke-opacity='0.2' stroke-width='4' fill='none'/%3E%3Cpath d='M0 25 Q 25 0, 50 25 T 100 25' stroke='%23D4AF37' stroke-opacity='0.2' stroke-width='4' fill='none'/%3E%3C/svg%3E")`,
      items: [
        {
          title: "Hands of Creation",
          description: "The potter's touch shapes not just clay, but stories of dedication passed through generations.",
          image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCVKWuZTMthaDzibeS9mOE_YkGk6s7z6p5fmnlSzD0CJsF1qeJvTsRl8IPXn3ut8xhQgyc6j1oDiJxzIjEZUIKqKMym6DSO48DmB-3_e3PSeQ9xl9uY6kjgWQHgvoQbDW2GI0dnvAFHIoVcp_NYspgA2lW-UqdUTSwPJ0HFFzhVhxnNv5dI04lnSvYGmDQ2UXu2BbLbH7kslZBL8FJQoInXsbFqdjW_jcVH5FAAOPUdPbHZInL0Wm41yEjhDM2P49LQw0m08PrAUis",
          alt: "Potter's hands",
        },
        {
          title: "Woven Spirit",
          description: "Each thread is a testament to patience, weaving together tradition and contemporary artistry.",
          image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBFmIsfXvR7CRFRWyRZLO1ex9YI2WZ9isuMcVWcZqdLDTyb39Hd90cTsR7MNryvtjmt2vxQFMG0TkH75ka4XKH4NMtv95pjd0DTPwyT-qP0MpjPlYnTs3-uyDLR7vqXZEgZiAYoVGveRAdVfDQc-xE22BE3oTZQBGLEn02aukOvzm9XJjl_H_Q9w7LVabNhwMlt5u_3DAFNmD6fqj8sy4YoOIVv0patTlDTMm_ohPweGBAzODDRoDgObLM2r_AuF4cI9Ql3GOkPJG0",
          alt: "Hand-woven textile",
        },
        {
          title: "The Ink's Soul",
          description: "A single brushstroke holds a universe of expression, capturing the essence of a moment.",
          image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCnXh8vIcC-DCrVErAnD7kSFvEUCFGcDBx-BGmYm0PwOg3cZu_TXX3_P9skkksJ3p11WcOe9fcDvMdBujvzCn-lOJMCNHHz28WraCNK6tYGyHxrXgQzWV1W5sNQEa8YBtkrWI2MTW8RNqlbV1nVndKy71Fx7Llug8r96k9h9i59BpbShp4Gk_TMMKiqC-jwozL7nJZ6jdoVyHKigPChqkkWKqBboRPzZK5w9knc6oqwRWUL14w-dtDrwz4R6I2cW8qKLphbaXAGRCY",
          alt: "Sumi ink calligraphy",
        },
      ]
    },
    {
      id: "aesthetics",
      title: "Everyday Aesthetics",
      description: "Finding moments of beauty and mindfulness in the rituals of daily life.",
      dividerPattern: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'%3E%3Cg fill='none' stroke='%23D4AF37' stroke-opacity='0.2' stroke-width='4'%3E%3Ccircle cx='25' cy='25' r='23'/%3E%3Ccircle cx='75' cy='25' r='23'/%3E%3Ccircle cx='25' cy='75' r='23'/%3E%3Ccircle cx='75' cy='75' r='23'/%3E%3C/g%3E%3C/svg%3E")`,
      items: [
        {
          title: "Minimalist Haven",
          description: "Ikebana arrangements bring nature indoors, celebrating form, line, and the art of simplicity.",
          image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBvqIUnVq_mLakP0yvtI0u9FCfdYbeGHfhAMcr0aPBcZnRI_tMxQU6kltEMsSnDAM8P-2gqHZc8XRj0Q4ZVv7gosIKc9f7vAmE4wAZ-f6Axtpg_A_Rk4Gpq9lL3Hu6YGW3Bt8GN5t51Xobww0Hb1Yo1HkfS3jmHV2mofuisbiBeHQJXcI2K_Y6Z7HxTu4CldEzvt8eo4MjBooFr55VX3zlKjOAbzVvriw-x8rVIGs1HobvadLFpDlC4b3nAAX6-BmXxVOsxV89atM8",
          alt: "Ikebana arrangement",
        },
        {
          title: "Mindful Ritual",
          description: "The tea ceremony is a meditation in motion, a practice of presence in every gesture.",
          image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCKyHQmWHk9TIbGkCHzyyyfqHKQQ1lL5IQHQrmA9nZ8GXnyvzG0z48zwz9oiPe3YsO3qpiG1ih9jioYQ_EKXB3fWbtzLJ3Q97cAFJhmFMiuOZtxcadE9pyksK6v-pRSveHmh-UnH9KqkrSN2bwZdzB7LgpHf-YvfFenyTnO1mhTTfAWiQwOTrtJbFFLaHs3VS_dNpnwUCT5I_sc5YJiAmj93Q7RxyPd_l1kDaFqEo48hkowl22H3w4MVldua-jSrKaKIyjB9G61P0w",
          alt: "Tea ceremony set",
        },
        {
          title: "Sunbeam Silence",
          description: "The quiet beauty of light and shadow dancing across a room, reminding us of time's gentle passage.",
          image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBuKUbjNlze0fVaG-cbE6BmV8o-WKRuoRvgkVKmx7jV14SBTGZCi4dyDA6bbiWrOvTP_283WZFPo72HqY_td1c0XqNlSYCbOnLBUpGoAyESSvy8QktGeu8RpmD9_rW5FrgGr9vly9oReWubhNMgCyOttTSE6Fn2M-pIrbdKTfvI_dqy7GDoQELpKHpFUCgQlSZY9NfgPAHnjS0Q9ZmzcZClLOZw22Lgt9bz9NucWtctj0Wj1pOr0hDWJkMQe4tKujihR_8Bg26x_AQ",
          alt: "Sunlight on wooden floor",
        },
      ]
    }
  ],
  faq: {
    title: "Frequently Asked Questions",
    description: "Answers to common inquiries about our philosophy and offerings.",
    items: [
      {
        question: "What is 'Ma' (間)?",
        answer: "'Ma' is a Japanese concept referring to the artistic interpretation of empty space. It celebrates the void between elements, suggesting that this negative space is as important as the objects themselves in creating meaning and beauty."
      },
      {
        question: "How do you select your artisans?",
        answer: "We partner with artisans who embody a deep respect for traditional techniques while possessing a contemporary vision. Each maker is chosen for their dedication to craftsmanship, quality of materials, and the unique spirit they bring to their work."
      },
      {
        question: "Are your products sustainable?",
        answer: "Sustainability is a core value. We prioritize natural, locally-sourced materials and support practices that are mindful of the environment. Our goal is to create objects of lasting value that encourage conscious consumption."
      },
      {
        question: "What is the philosophy behind Japan Rediscover?",
        answer: "Our philosophy is to bridge the timeless wisdom of Japanese aesthetics with modern sensibilities. We aim to create experiences and objects that encourage mindfulness, appreciate subtlety, and find profound beauty in the everyday."
      },
      {
        question: "Can I commission a custom piece?",
        answer: "We work closely with our network of artisans and may be able to facilitate custom commissions. Please reach out through our contact form with details of your request, and we will explore the possibilities with you."
      }
    ]
  },
  contact: {
    title: "Get in Touch",
    description: "Our service is currently under construction, and your insights are invaluable in shaping its future. We welcome your thoughts, requests, and questions as they are a vital source for planning and enhancing the quality of your upcoming experience."
  }
};