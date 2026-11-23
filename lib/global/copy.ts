import { GLOBAL, GLOBAL_PRICE_CENTS, LEGAL, LEGAL_GLOBAL, SITE, formatMoney } from "@/lib/site";

/**
 * Nội dung trang quốc tế (/global) — chỉ tiếng Anh. Bố cục và nội dung theo index.html, màu sắc/kiểu dáng theo trang mặc định.
 * Chuỗi "rich" hỗ trợ **đậm**, `mã`, [chữ](link) (xem components/landing/rich.tsx).
 * Mọi số liệu trong các khung minh hoạ (chat, thẻ, bảng) chỉ là ví dụ.
 */

export const PRICE = formatMoney(GLOBAL_PRICE_CENTS, "USD");
const MONTHS = LEGAL.supportMonths;
const P = GLOBAL.path;

export const G = {
  meta: {
    title: "Ads MCP: ask Claude or ChatGPT how yesterday’s ads did | Nextgency",
    description: `Ask Claude or ChatGPT how yesterday’s ads did. Ads MCP connects Meta, TikTok, Google and OpenAI Ads to the AI you already use, with setup help from Nextgency. One payment of ${PRICE}.`,
  },

  nav: {
    label: "Sections",
    home: "Nextgency — back to top",
    menu: "Menu",
    openMenu: "Open menu",
    cta: "Get Ads MCP",
    items: [
      { href: "#benefits", label: "Benefits" },
      { href: "#ads-ai", label: "Ads AI" },
      { href: "#setup", label: "Setup" },
      { href: "#faq", label: "FAQ" },
    ],
    demo: { href: "#demo", label: "Demo" },
  },

  hero: {
    badge: "You already ask AI about everything. Now ask it about your ads.",
    title: "Ask your AI how",
    accent: "yesterday’s ads did.",
    lead: "**Ads MCP** connects Meta, TikTok, Google and OpenAI Ads to Claude or ChatGPT. One question at 8 a.m. tells you what you spent, what came back and which ad to pause.",
    buy: "Get Ads MCP",
    demo: "Watch the demo",
    learn: "See what you get",
    trust: ["Secure PayPal checkout", "Setup help included", "Pay once, free updates"],
  },

  chat: {
    ariaLabel: "Example conversation",
    chooser: "Choose your AI",
    apps: [
      { id: "claude", label: "Claude", dot: "#CC785C" },
      { id: "chatgpt", label: "ChatGPT", dot: "#10A37F" },
    ],
    time: "8:02 AM",
    question: "How did my ads do yesterday?",
    toolLabel: "Ads MCP read",
    platforms: ["Meta", "TikTok", "Google"],
    answerTitle: "Yesterday",
    answerMeta: "3 accounts · 24 ads",
    kpis: [
      { label: "Spend", value: "$612" },
      { label: "Leads", value: "88" },
      { label: "Cost / lead", value: "$6.95", delta: "▼ 8% vs. the day before" },
    ],
    hours: [12, 6, 18, 40, 63, 52, 77, 100],
    hourLabels: ["0h", "6h", "12h", "18h", "23h"],
    best: { tag: "Best", name: "Video B", value: "$4.10 / lead" },
    pause: { tag: "Pause?", name: "Carousel 2", value: "$14.30 / lead" },
    approve: "Approve: pause Carousel 2",
    approved: "Paused",
    decline: "Not now",
    note: "Preview. Nothing runs until you approve.",
    noteApproved: "Approved. Carousel 2 paused · logged at 8:03 AM.",
    noteDeclined: "Okay. Nothing was changed.",
    timeline: [
      { time: "8:02", text: "You ask one question" },
      { time: "8:02", text: "It reads 3 ad accounts" },
      { time: "8:03", text: "You approve one change" },
    ],
    disclaimer: "Illustrative data",
  },

  video: {
    eyebrow: "Demo",
    title: "Watch one morning with Ads MCP",
    cta: "Get Ads MCP",
    meta: ["Account names and figures are illustrative."],
    src: "/global/ads-mcp-demo.mp4",
    poster: "/global/ads-mcp-demo.jpg",
    fileHint: "public/global/ads-mcp-demo.mp4",
  },

  problem: {
    eyebrow: "The problem",
    title: "Most owners learn what yesterday cost",
    accent: "a week later.",
    lead: "Three ad managers, three logins, numbers that never quite match. So the weak ad keeps spending until someone writes the report.",
    fails: [
      { title: "Another dashboard", body: "One more tool to learn and forget to open." },
      { title: "The weekly agency report", body: "Arrives late, and you can’t check the numbers behind it." },
      { title: "Doing it yourself in Ads Manager", body: "Fine, if you have an hour a day and know where to click." },
    ],
    cost: {
      label: "One weak ad, one week",
      big: "$161",
      text: "paid on top of what your average ad would have cost for the same leads.",
      rows: [
        ["Carousel 2, 7 days at $45/day", "$315"],
        ["Leads it brought", "22"],
        ["Its cost per lead", "$14.30"],
        ["Same 22 leads at your $6.99 average", "$154"],
      ],
      note: "Example figures. Ask every morning and you can catch ads like this the next day, not at the end of the month.",
    },
  },

  different: {
    eyebrow: "What’s different",
    title: "Not another dashboard.",
    accent: "Your AI, with your ad data.",
    items: [
      { title: "It lives in the chat you already open", body: "Claude or ChatGPT. No new app, no new login to remember." },
      { title: "Four ad platforms, one conversation", body: "Meta, TikTok, Google and OpenAI Ads, answered together in plain English." },
      { title: "You stay in control", body: "Turn on two-step confirmation and nothing is paused, launched or re-budgeted until you say yes." },
    ],
  },

  benefits: {
    eyebrow: "Ads MCP",
    title: "What you get every morning",
    cta: "Get Ads MCP",
    ctaNote: "One payment. Setup help included.",
    cards: {
      numbers: {
        title: "Know your numbers in seconds",
        body: "Spend, leads and cost per lead across every platform in one answer. Break it down by account, campaign or ad.",
        kpis: [
          { label: "Spend · 7 days", value: "$4,280" },
          { label: "Leads", value: "612" },
          { label: "Cost / lead", value: "$6.99", delta: "▼ 12%" },
        ],
      },
      waste: {
        title: "Stop paying for ads that don’t work",
        body: "Spot ads running at twice your average cost, so you can pause them before they eat the week’s budget.",
        rows: [
          { label: "Video B", value: "$4.10", pct: 29 },
          { label: "Video A", value: "$6.30", pct: 44 },
          { label: "Carousel 2 · 2× average", value: "$14.30", pct: 100, bad: true },
        ],
      },
      scale: {
        title: "Put more money behind what works",
        body: "See which video brings customers for less, then raise its budget with one reply.",
        label: "Video B · daily budget",
        from: "$30",
        to: "$36",
      },
      comments: {
        title: "Never miss a buyer in your comments",
        body: "Comments sorted by what people want, and who is still waiting for an answer.",
        rows: [
          { label: "Asking the price", value: "31", pct: 100 },
          { label: "Shipping", value: "5", pct: 16 },
          { label: "Still waiting for a reply", value: "12", bad: true },
        ],
      },
      launch: {
        title: "Launch in minutes, not hours",
        body: "Ask your AI to build ads from what already works. Where the platform allows it, new ads start paused.",
        big: "9",
        label: "ad drafts created",
        hint: "Waiting for your approval",
      },
      log: {
        title: "A record of every change",
        body: "Every command the AI runs is logged, so nothing happens behind your back.",
        chip: "Approved by you",
        lines: ["14:02 · Video B budget $30 → $36", "13:47 · Carousel 2 paused"],
      },
    },
  },

  adsAi: {
    eyebrow: "Ads AI",
    title: "See what your",
    accent: "competitors are running",
    equation: { ai: "Ads AI", mcp: "Ads MCP", plus: "Market research", label: "Ads AI equals Ads MCP plus market research" },
    lead: "Want it done for you? Ads AI is everything in Ads MCP, run by the Nextgency team: the ads your competitors run and for how long, what their customers complain about, and a regular report. You still see every number.",
    cta: "Talk to us about Ads AI",
    ctaSubject: "Ads AI",
    competitors: {
      title: "Competitor ads, with how long they’ve run",
      hint: "From the Meta Ad Library · last 90 days",
      rows: [
        { initial: "A", color: "#D98F7A", name: "Brand A", detail: "UGC video · 3 versions", days: "63 days" },
        { initial: "B", color: "#7E9BC9", name: "Brand B", detail: "Carousel · “Free shipping”", days: "18 days" },
        { initial: "C", color: "#93A96F", name: "Brand C", detail: "Founder story video", days: "41 days" },
      ],
      complaints: "What their customers complain about",
      complaintsDetail: "Google Maps reviews: “slow delivery” (23) · “sizes run small” (11)",
    },
    report: {
      title: "Your report, before your coffee",
      body: "The numbers land in your team’s Telegram group every morning.",
      group: "Marketing team",
      time: "08:00",
      from: "Message from AI · MCP Reports",
      heading: "Morning report",
      lines: ["Spend yesterday: $612", "Leads: 88 · $6.95 each"],
      best: "Best: Video B",
      pause: "Pause: Carousel 2",
      sources: "Research sources include the Meta Ad Library, TikTok Shop, YouTube, Google Maps and marketplaces such as Shopee and Lazada.",
    },
  },

  who: {
    eyebrow: "Who it’s for",
    title: "Run ads yourself, or",
    accent: "check the people who do",
    owners: {
      eyebrow: "Business owners",
      title: "Check your agency’s numbers yourself",
      head: ["", "Agency report", "Real numbers"],
      rows: [
        { label: "Leads", a: "640", b: "594", off: true },
        { label: "Cost per lead", a: "$6.69", b: "$7.20", off: true },
        { label: "Spend", a: "$4,280", b: "$4,280" },
      ],
    },
    agencies: {
      eyebrow: "Agencies & marketers",
      title: "Every client account, one chat",
      accounts: [
        { badge: "M", color: "#1877F2", name: "Bloom Studio", status: "On budget" },
        { badge: "G", color: "#4285F4", name: "Northside Dental", status: "On budget" },
        { badge: "M", color: "#1877F2", name: "Urban Grill", status: "Over budget", over: true },
        { badge: "T", color: "#161616", name: "Peak Fitness", status: "On budget" },
      ],
      prompt: "Which client is over budget today?",
    },
  },

  setup: {
    eyebrow: "Setup",
    title: "Three steps.",
    accent: "We walk you through it.",
    lead: "No coding. You run one command on a small server, add one link to your AI and sign in to your ad accounts. The guide, the video and the Nextgency team help with every screen.",
    steps: [
      { title: "Install on your server", body: "Run the quick-install script on a small VPS you own. No server yet? We’ll show you how to get one.", mock: ["Your server · Ubuntu 24.04", "Ready"] },
      { title: "Add it to Claude or ChatGPT", body: "Paste your connector link as a custom connector in your AI’s settings.", mock: ["Settings › Connectors", "+ Add"] },
      { title: "Sign in and pick accounts", body: "Choose which Meta, TikTok, Google and OpenAI Ads accounts it can see.", mock: ["3 accounts selected", "Connected"] },
    ],
    ready: {
      title: "Have these ready",
      items: [
        "A small VPS (Ubuntu 24.04 or Debian 12, 1 vCPU, 2 GB RAM) and a subdomain",
        "An account with Claude, ChatGPT, Gemini or Claude Code that allows custom connectors",
        "Access to the ad accounts you want to connect",
        "A free GitHub account (optional when you order)",
      ],
      note: "Your server, domain and AI subscription are billed by those providers, separately from your purchase.",
    },
    support: {
      badge: "Included",
      title: "Not technical? We do the technical part with you",
      body: `Nextgency helps by email for ${MONTHS} months after your purchase, ${LEGAL_GLOBAL.workHours}. We aim to reply within ${LEGAL_GLOBAL.firstResponse}.`,
      items: [
        "Installing on your server and setting up the subdomain",
        "Connecting your Meta, TikTok, Google and OpenAI Ads accounts",
        "Connecting Claude, ChatGPT or Gemini, and Telegram",
        "How to ask your AI and delegate work to it",
      ],
    },
  },

  buy: {
    eyebrow: "Get Ads MCP",
    title: "Get it today. Ask your first question",
    accent: "tomorrow morning.",
    lead: `One payment of ${PRICE}. No monthly software fee.`,
    gets: [
      "Access to the private GitHub repo: Docker Compose installer, quick-install script and guides",
      "Installation video walkthrough",
      `Setup help from Nextgency by email for ${MONTHS} months`,
      "Free updates, automatic backups and rollback if something fails",
    ],
    safe: {
      title: "Safe by design",
      body: "Ads MCP runs on your own server, so your data stays with you. Turn on two-step confirmation, budget caps and action limits, and every command the AI runs is logged. Remove access anytime from your AI’s connector settings.",
    },
    card: {
      label: "Ads MCP Simple",
      sub: "one-time payment",
      included: "Setup help included",
    },
    notes: [
      "**Good to know.** Your server (VPS), domain and AI subscription are separate costs. See “Setup” for what to have ready.",
      `**Digital product.** You get access to the source code as soon as you’re added to the repository, so purchases are final once access is granted. See the [Payment & Refund Policy](${P}/payment-refund-policy).`,
    ],
  },

  faq: {
    eyebrow: "FAQ",
    title: "Questions owners ask first",
    items: [
      {
        q: "What is MCP?",
        a: "Model Context Protocol is an open standard that lets AI assistants such as Claude and ChatGPT connect to other tools. Ads MCP is the connector that lets your AI read your ad accounts and, within the permissions you grant, make changes.",
      },
      {
        q: "Do I need to be technical?",
        a: "Day to day, no: you type questions into your AI. Installing needs a small server (VPS) and a few steps, and the guide, the video and the Nextgency team walk you through them. If you’d rather not touch any of it, ask us about Ads AI.",
      },
      {
        q: "Which platforms does it work with?",
        a: "Ads: Meta (Facebook and Instagram), TikTok, Google Ads and OpenAI Ads. AI apps: Claude, ChatGPT, Gemini (CLI and Enterprise) and Claude Code; personal Gemini on the web isn’t supported in the current guide. Alerts: Telegram. Market research uses Apify (your own Apify account, billed by Apify) for sources such as the Meta Ad Library, TikTok Shop, YouTube and Google Maps.",
      },
      {
        q: "Can it change my campaigns without me?",
        a: "Only as far as you allow. With two-step confirmation on (Advanced mode), every change shows a preview and waits for your OK, and you can set budget caps, bid caps and action limits. You can also tell the AI to analyze only. Every command is logged, and where the platform supports it, new items are created paused.",
      },
      {
        q: "I work with an agency. Is this for me?",
        a: "Yes. Owners use it to see the real numbers behind their agency’s reports and to get answers without waiting for the next call. Agencies use Admin and Staff roles so teammates can work without holding the master token.",
      },
      {
        q: "What do I need to prepare?",
        a: "To buy, only your name, email and country. To run it: a small VPS (Ubuntu 24.04 or Debian 12), a subdomain, an account with an AI app that allows custom connectors, and access to your ad accounts. A GitHub account helps, and we can help you create one. These costs are separate from the purchase.",
      },
      {
        q: "How does payment work, and how fast do I get access?",
        a: "Pay with PayPal or a card on this page. Once PayPal confirms the payment, we send the repository invite right away if you entered a GitHub username, then email you to help with setup. Without a username, we’ll email you to set it up together. Accept the invite from your GitHub notifications and follow the guide.",
      },
      {
        q: "How much does it cost?",
        a: `${PRICE}, once. There is no monthly software fee. You pay your own server, AI subscription and Apify usage separately.`,
      },
      {
        q: "Can I get a refund?",
        a: `Because you can view and download the source code as soon as you are added to the repository, purchases are final once access is granted, unless the law where you live says otherwise or we fail to deliver. If something is wrong, email us first and we’ll make it right. See the [Payment & Refund Policy](${P}/payment-refund-policy).`,
      },
      {
        q: "How is my data handled?",
        a: `Ads MCP runs on your own server, so your ad data stays with you. We collect only what we need to process your order and help you. Our [Privacy Policy](${P}/privacy) explains what we collect and how to ask us to access or delete it.`,
      },
    ],
  },

  final: {
    title: "Tomorrow at 8 a.m.,",
    accent: "ask instead of guessing.",
    sub: `One payment of ${PRICE}. Setup help included.`,
    cta: "Get Ads MCP",
  },

  productName: SITE.productName,
};

export type GlobalCopy = typeof G;
