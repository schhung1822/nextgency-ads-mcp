import { LEGAL, SITE, formatVnd } from "@/lib/site";
import type { ChatScenario, GuideTab, Locale } from "./types";
import type { LandingDict } from "./vi";

const price = formatVnd(SITE.price, "en");
const ORDER_VALID_DAYS = LEGAL.orderValidDays;
// Bản tiếng Anh của LEGAL.workHours — sửa cả hai nếu đổi giờ làm việc.
const WORK_HOURS = "9am–6pm Vietnam time (GMT+7), Monday to Friday";

/** English landing page content (served at "/en"). Must mirror the structure of ./vi.ts. */
export const en: LandingDict = {
  locale: "en" as Locale,
  meta: {
    title: `${SITE.productName}: an AI ads team for business owners and media buyers | Nextgency`,
    description: `Ask AI in plain English which videos bring customers, where your ad budget is being wasted and what competitors are running. Ads MCP Simple connects AI to your Facebook, TikTok and Google ads, with setup support from Nextgency. One-time price ${price}.`,
    ogLocale: "en_US",
  },
  price,

  nav: {
    label: "Main navigation",
    home: "Nextgency — back to top",
    buy: "Buy now",
    menu: "Menu",
    openMenu: "Open menu",
    switchTo: { label: "VI", aria: "Xem bản tiếng Việt (Vietnamese)" },
    items: [
      { href: "#hieu-qua", label: "Results" },
      { href: "#doi-ai", label: "AI ads team" },
      { href: "#mcp-la-gi", label: "What is MCP" },
      { href: "#cach-dung", label: "How to use" },
      { href: "#tinh-nang", label: "Features" },
      { href: "#mua", label: "Pricing" },
      { href: "#faq", label: "FAQ" },
    ],
  },

  hero: {
    badge: "MCP is no longer just for tech people",
    title: "In 2027, every business",
    titleAccent: "owner needs to know MCP.",
    lead: "**MCP turns AI into an ads team** that works for you on Facebook, TikTok and Google. Ask in plain language — the AI team reads your numbers, shows which videos bring customers and where money is being wasted, then comes back with advice and makes changes once you approve.",
    sub: `**${SITE.productName}** is the ready-made kit that gives you this AI team, with setup support from Nextgency — no technical skills needed.`,
    buy: "Buy now",
    ctaLearn: "Understand MCP in 30 seconds",
    trust: ["QR payment, confirmed automatically", "Setup support from Nextgency", "Pay once · free updates"],
    chat: {
      team: "AI ads team",
      status: "Online · Facebook, TikTok, Google",
      badge: "Demo",
      greeting: "Hi! What would you like me to look at today?",
      placeholder: "Message your ads team…",
      unit: "customers",
      top: "No. 1",
      stop: "Pause it",
      yes: "Approve",
      later: "Later",
      note: "Simulation with illustrative numbers. Every ad change waits for your approval.",
      asksLabel: "What owners often ask — tap to watch",
      srSummary:
        "Example conversation: you ask “Which video brought in the most customers this week?”, “Is any of this week's ad money being wasted?” or “What are nearby competitors advertising, and what do customers complain about?”; the AI team reads your ad data and market data, then answers in plain language with suggested actions.",
      scenarios: [
        {
          chip: "Which video brings customers?",
          question: "Which video brought in the most customers this week?",
          tools: [
            ["Facebook Ads", "Reading stats for 12 videos"],
            ["TikTok Ads", "Reading this week's videos"],
          ],
          intro: "The video where you present the product yourself performs best:",
          body: {
            kind: "rank",
            rows: [
              { label: "Owner explains", value: 42, tag: "top" },
              { label: "Korea vlog", value: 27 },
              { label: "Spa tour", value: 3, tag: "stop" },
            ],
            hint: "Tip: film vertically, under 20 seconds, owner on camera — make more like video No. 1.",
          },
        },
        {
          chip: "Is money being wasted?",
          question: "Is any of this week's ad money being wasted?",
          tools: [
            ["Facebook Ads", "Adding up spend on 2 accounts"],
            ["Google Ads", "Adding up spend on 1 account"],
          ],
          intro: "This week you spent 4.8M₫:",
          body: {
            kind: "split",
            good: { label: "brought customers", value: "3.9M₫", pct: 81 },
            bad: { label: "no customers yet", value: "0.9M₫" },
            note: "About 25,000₫ per customer",
            ask: "Pause the 2 ads that brought no customers?",
            done: "Paused 2 ads. I'll send you the results on Telegram tomorrow morning.",
          },
        },
        {
          chip: "What are competitors doing?",
          question: "What are nearby competitors advertising, and what do customers complain about?",
          tools: [
            ["Facebook Ads Library", "Competitor ads"],
            ["Google Maps", "Customer reviews"],
          ],
          intro: "Here's a quick summary:",
          body: {
            kind: "bullets",
            items: [
              "Competitors are pushing “buy 1 get 1” deals and free delivery.",
              "Common complaints: slow delivery, staff reply late.",
              "Tip: say “we reply within 5 minutes” right in your ad.",
            ],
          },
        },
      ] as ChatScenario[],
    },
  },

  stats: {
    label: "Key numbers",
    items: [
      { to: 4, suffix: "", text: "", title: "Ad platforms", sub: "Facebook, TikTok, Google, OpenAI" },
      { to: 5, suffix: "+", text: "", title: "AI apps supported", sub: "Claude, ChatGPT, Gemini…" },
      { to: 1, suffix: "", text: "", title: "Place to see it all", sub: "Every account's numbers in one spot" },
      { to: 0, suffix: "", text: "Yours", title: "Private data", sub: "Lives on a server you own" },
    ],
    marqueeLabel: "Supported platforms and data sources",
    marquee: ["Facebook Ads", "TikTok Ads", "Google Ads", "OpenAI Ads", "Telegram", "Claude", "ChatGPT", "Gemini", "Shopee", "TikTok Shop", "Lazada", "Facebook Ads Library", "Google Maps", "YouTube"],
  },

  compare: {
    eyebrow: "Results",
    title: "How does selling change",
    accent: "with Ads MCP?",
    lead: "Tap to compare. The same ad budget, but with an AI team watching it every day.",
    group: "Before and after comparison",
    before: "Before MCP",
    after: "With MCP",
    customersLabel: "Customer messages per week",
    customers: { before: "18 customers", after: "31 customers" },
    moneyLabel: "Where the ad money goes",
    good: "Brings customers",
    waste: "Wasted",
    hoursLabel: "Time the owner spends on ads each week",
    hours: { before: "About 5 hours", after: "15 minutes" },
    changes: [
      { title: "Knowing where money goes", before: "You find out at month end — if the numbers are right", after: "A report on your phone every morning" },
      { title: "Ads losing money", before: "Spotted after a week of spending", after: "Spotted the same day, paused with one message" },
      { title: "What video to make", before: "Filming on gut feeling", after: "You know which formats bring customers" },
      { title: "What competitors do", before: "Hours of scrolling Facebook", after: "AI sums it up for you in minutes" },
      { title: "Whoever runs your ads", before: "You can only trust their reports", after: "You see real numbers and ask informed questions" },
      { title: "Facebook, TikTok, Google", before: "One app each, opened one by one", after: "Ask in one place, read every platform" },
    ],
    note: "Illustrative numbers. Real results depend on your product, content and spend.",
  },

  team: {
    eyebrow: "What the AI team does for you",
    title: "With MCP, you get an ads team",
    accent: "that works for you",
    lead: "You just ask and decide. The AI team runs your ads, tracks every dollar and comes back with advice — like a small marketing department.",
    you: "You",
    youSub: "Spa, restaurant or shop owner",
    ask: "You ask and assign",
    report: "Reports and advice back",
    center: "Your AI ads team",
    spokes: [
      { title: "Run ads", desc: "Create, start and pause with your approval", tags: ["Facebook", "TikTok", "Google"] },
      { title: "Guard the budget", desc: "Cost per customer and where money leaks", tags: [] },
      { title: "Read comments", desc: "What customers ask about or complain about", tags: ["Fanpage"] },
      { title: "Video feedback", desc: "Which videos bring customers, vertical or landscape", tags: ["Reels", "Posts"] },
      { title: "Watch competitors", desc: "What they advertise and at what price", tags: ["Shopee", "TikTok Shop", "Google Maps"] },
      { title: "Morning report", desc: "Sent to your phone on the schedule you set", tags: ["Telegram"] },
    ],
  },

  weekly: {
    eyebrow: "Every week",
    title: "Every week,",
    accent: "this is what you see",
    lead: "No ad jargon needed. The AI team speaks the language of sellers: customers, money, videos.",
    formats: {
      title: "Which Facebook formats and filming styles bring customers",
      sub: "Customer messages in the last 7 days",
      brand: "KAT Skin",
      sponsored: "Sponsored",
      send: "Send message",
      actions: ["Like", "Comment", "Share"],
      reels: { n: "42 customers", badge: "Best performer", tag: "Reels", caption: "Fresh from Korea, just for you…", label: "Vertical Reels, owner on camera" },
      carousel: { n: "13 customers", badge: "Keep", caption: "KAT signs a partnership with a Korean partner", cards: ["Korean partner", "VIP room"], label: "Photo carousel, one idea per photo" },
      landscape: { n: "6 customers", badge: "Pause it", caption: "The KAT team's business trip to Korea", likes: "24 likes", comments: "2 comments", label: "Landscape video over 2 minutes" },
      suggestLabel: "The AI team suggests for your next shoot:",
      suggestions: ["Film vertically on a phone", "A real person on camera", "Under 20 seconds", "Show the result in the first 3 seconds"],
    },
    videos: {
      title: "Which videos bring customers",
      unit: "customers",
      items: [
        { n: 42, name: "Owner explains" },
        { n: 27, name: "Korea vlog" },
        { n: 15, name: "Partnership" },
        { n: 3, name: "Spa tour" },
      ],
      top: "Best performer",
      stop: "Pause it",
      note: "Customer messages from each video. The team suggests pausing the last one and making more like the first.",
    },
    money: {
      title: "Where the ad money goes",
      spentLabel: "Spent this week",
      spent: "4.8M₫",
      good: "3.9M₫",
      waste: "0.9M₫",
      goodLegend: "brought 156 customers",
      wasteLegend: "no customers yet",
      tip: "Team suggestion: pause the 2 ads with no customers and move the budget to the winning video.",
    },
    report: {
      title: "A report on your phone every morning",
      sub: "Via Telegram — a one-minute read before you open.",
      header: "AI ads team · 7:30",
      messages: [
        { text: "Yesterday: **18 customer** messages", hint: false },
        { text: "“Owner explains” is still No. 1", hint: false },
        { text: "**Today's tip:** film one more before–after video", hint: true },
      ],
      footnote: "Reports are sent on demand or on the schedule you set.",
    },
    note: "Images and numbers are illustrative.",
  },

  personas: {
    eyebrow: "Who it's for",
    title: "However you",
    accent: "run your ads today",
    items: [
      { title: "You run them yourself", body: "Someone tells you which posts bring customers and which to pause. No need to learn Facebook's or TikTok's ad tools." },
      { title: "Your staff runs them", body: "Your team works faster. You check the numbers yourself without waiting for a report, and see who turned what on or off." },
      { title: "You hire an agency", body: "Check for yourself whether the agency delivers. Have real numbers in hand when you discuss fees or switching partners." },
    ],
  },

  mcp: {
    eyebrow: "Understand it in 30 seconds",
    title: "What is MCP?",
    accent: "Understand it in 30 seconds.",
    lead: "Without MCP, AI only knows what you paste into the chat. With MCP, AI is allowed to read and act on **exactly the accounts you approve** — like handing over the key to one room, not the whole house.",
    aside: "MCP (Model Context Protocol) is an open connection standard already supported by Claude, ChatGPT and Gemini. Ads MCP Simple is one of these connections, built specifically for advertising and market research.",
    aiLabel: "The AI you already use",
    ais: ["Claude", "ChatGPT", "Gemini", "Claude Code", "Gemini CLI"],
    link: "One MCP link",
    linkSub: "Runs on your own VPS · AES-256 encrypted tokens · per-user permissions",
    groups: [
      { label: "Advertising", items: ["Meta Ads", "TikTok Ads", "Google Ads", "OpenAI Ads"] },
      { label: "Market data via Apify", items: ["Shopee", "TikTok Shop", "Lazada", "FB Ads Library", "Google Maps", "YouTube"] },
      { label: "Alerts", items: ["Telegram"] },
    ],
    cmpHead: ["Regular AI", "AI with Ads MCP"],
    rows: [
      { label: "Reports", plain: "Export Excel from Ads Manager and paste it into the chat", mcp: "AI pulls the latest numbers itself, matched to your question" },
      { label: "Many accounts", plain: "Open tab after tab and add up numbers by hand", mcp: "One question, and AI reads every account and Page you granted" },
      { label: "Competitors", plain: "Scroll the Ads Library and Shopee, read reviews one by one", mcp: "AI scans competitor prices, reviews and ads, and summarizes what customers dislike" },
      { label: "Start, pause, adjust", plain: "Click through Ads Manager yourself", mcp: "AI proposes and does it — you just confirm" },
    ],
  },

  usage: {
    eyebrow: "How to use it",
    title: "How do you use it?",
    accent: "Ask like you'd ask a staff member.",
    lead: "No code, no commands to memorize. These are questions Nextgency's customers ask every day.",
    items: [
      { who: "Spa owner", q: "Which post brought in the most bookings this week? Which should I pause?", a: "AI ranks posts by cost per message, and points out which ones are burning money and why." },
      { who: "Restaurant owner", q: "What are the hotpot places around District 3 advertising, and what do diners complain about?", a: "AI scans the Facebook Ads Library and Google Maps, summarizing competitor offers and bad reviews so you can do better." },
      { who: "Online shop", q: "What do 1-star reviews say about polo shirts at my price point on Shopee?", a: "AI reads hundreds of reviews, groups them into customer pain points and suggests new content angles." },
      { who: "Agency, marketing team", q: "Which client accounts have had an unusual CPM spike since Monday?", a: "AI checks many accounts at once. Staff get tasks without ever holding the master token." },
    ],
  },

  paths: {
    eyebrow: "Two ways to start",
    title: "Do it yourself,",
    accent: "or let Nextgency do it with you.",
    lead: "Business owners usually ask two things: can I run this myself, and will it bring orders? So there are two ways to start.",
    mcp: {
      name: "Ads MCP",
      tag: "You ask, you decide",
      body: "Software that connects AI to your ad accounts, installed on your own VPS. Best if you already run ads or have marketing staff.",
      priceSuffix: "one-time",
      cta: "Buy Ads MCP",
    },
    ai: {
      name: "Ads AI",
      tag: "Run for you by Nextgency",
      body: "No time? The Nextgency team uses this same MCP to run your ads, make creatives, write content and send you a report every week. You still see every number.",
      priceSuffix: "/ month",
      priceOnRequest: "Custom quote",
      ctaZalo: "Chat on Zalo",
      ctaFanpage: "Message us",
    },
  },

  features: {
    eyebrow: "Features",
    title: "What's inside",
    accent: "Ads MCP Simple",
    lead: "AI only works within the accounts and permissions you grant. You always keep the final say.",
    items: [
      { title: "One link for every platform", body: "Meta, TikTok, Google, OpenAI Ads and Apify in a single connection. Multiple ad accounts and Pages, all handled in plain language." },
      { title: "Delegate without sharing tokens", body: "Admin and Staff roles, two-factor authentication, AES-256-GCM encrypted tokens and a log of every command the AI ran." },
      { title: "Guardrails for your budget", body: "Two-step confirmation, budget caps, bid caps and action limits (in Advanced custom mode)." },
      { title: "Market research via Apify", body: "Find products, compare prices and read reviews on Shopee, TikTok Shop and Lazada. You can create an Apify-only MCP. Default cap of US$1 per run." },
      { title: "Telegram alerts", body: "Get notified when ads change, and receive reports on demand or on the schedule you set." },
      { title: "Self-hosted, you stay in control", body: "Your data lives on your VPS. Update from the web dashboard, automatic daily backups and automatic rollback if something fails." },
    ],
    worksWith: "Works with **Claude, ChatGPT, Claude Code, Gemini CLI, Gemini Enterprise** · personal Gemini web isn't supported in the current guide",
  },

  skill: {
    eyebrow: "Only with Ads MCP Simple",
    title: "A Meta Ads analysis skill",
    accent: "built for the Vietnamese market",
    body: "Developed by noti.vn for accounts that close sales via inbox, Zalo and phone — a way of selling that foreign tools often misread because in-platform ROAS is rarely reliable.",
    note: "Works with data from the MCP or with Excel/CSV exports from Ads Manager. Can be combined with your own business skill to bring product criteria and margins into the analysis.",
    cardTitle: "What does the skill help AI do?",
    cardSub: "Diagnose carefully before recommending action",
    steps: [
      "Check whether conversion data can be trusted",
      "Find the root cause at campaign, ad set or ad level",
      "Account for the Breakdown Effect and marginal cost",
      "Recommend scaling, pausing or testing — as testable hypotheses",
    ],
  },

  setup: {
    eyebrow: "Setup & support",
    title: "Set up in a single session,",
    accent: "with Nextgency by your side",
    lead: `A quick-install script and video walkthrough are included (unlocked after activation). Nextgency supports you during working hours: ${WORK_HOURS}.`,
    steps: [
      { title: "Prepare", body: "An Ubuntu 24.04 or Debian 12 VPS, a subdomain and a GitHub account. Don't have them? Nextgency will guide you." },
      { title: "Run the script", body: "Follow the video: paste the command, fill in your details. Nextgency does it with you." },
      { title: "Connect", body: "Your ad accounts, the AI you use, Telegram, and an Apify token if needed." },
      { title: "Start asking", body: "Nextgency shows you how to ask and delegate work to the AI." },
    ],
    support: {
      badge: "Included from Nextgency",
      title: "Not technical? Nextgency handles the technical part with you",
      body: "You don't have to figure it out step by step on your own. The Nextgency team works with you until your AI ads team runs on your own infrastructure.",
      items: [
        "Help installing on your server (VPS) and configuring the domain",
        "Help connecting Facebook, TikTok, Google and OpenAI ad accounts",
        "Help connecting Claude / ChatGPT / Gemini and Telegram",
        "Guidance on how to ask and delegate work to the AI",
      ],
    },
  },

  fit: {
    eyebrow: "Who it's for",
    title: "A good fit if…",
    yes: [
      "You run ads across several accounts and platforms",
      "You close sales via inbox, Zalo or phone and want AI to read results correctly",
      "Your 2–20 person marketing team needs roles, budget caps and an audit log",
      "You research products, competitors and prices before creating content",
    ],
    noTitle: "Not a fit yet if",
    no: [
      "You want AI to run on a schedule without any configuration",
      "You need to publish or edit Page posts (Page access is read-only)",
      "You don't want to read any documentation — then look at the Ads AI plan",
    ],
    limitsTitle: "Scope and limitations to know before buying",
    limits: [
      "Scheduled runs are performed by your AI app or automation tool; you need to configure the schedule, permissions and task content yourself.",
      "TikTok GMV Max: view and analysis supported; read-only by default. Changes require a separate admin permission and always use two-step confirmation. New or duplicated GMV Max campaigns start running immediately rather than paused.",
      "For ad types that support regular creation, new items are created paused. What you can view, edit, create and duplicate depends on the platform; for example, Google Ads Video campaigns are view-only via the API under current documentation.",
      "No publishing or editing of Page posts through the Meta connection, and no ad billing management.",
      "Apify can't collect data behind a login such as private groups, private accounts or messages. Market data comes from third parties and should be checked before you act on it. Apify usage is billed separately on your Apify account.",
      "Personal Gemini web is not supported in the current guide.",
    ],
  },

  pricing: {
    eyebrow: "Get started",
    title: "All-in-one plan",
    accent: "with setup support",
    lead: "Pay once, no monthly software fee. Free lifetime updates.",
    label: "All-in-one",
    included: "Setup support included",
    buy: "Buy now",
    secure: "QR payment · confirmed automatically",
    includes: [
      "Access to a private GitHub repo: Docker Compose installer, quick-install script and guides",
      "Installation video walkthrough",
      "Exclusive Meta Ads analysis skill for Vietnam",
      "Automatic backups and rollback if something fails",
      "Nextgency helps set up your VPS, domain, ad accounts, AI and Telegram",
    ],
    notes: [
      `**Important.** Payment is a bank transfer via VietQR from a Vietnamese bank app — paying from abroad? [Message Nextgency](${SITE.contact.fanpage}) first. You provide your own VPS, domain, AI and Apify accounts, billed separately. Please read “Scope and limitations” to check the product fits your needs.`,
      "**About GitHub projects.** GitHub projects are non-refundable once you have repo access, because you can view and download the source code. A GitHub account is optional when ordering. See the [payment & refund policy](/policies/chinh-sach-thanh-toan) and [terms of use](/terms) (in Vietnamese).",
    ],
  },

  faq: {
    eyebrow: "FAQ",
    title: "Frequently asked questions",
    items: [
      { q: "I'm not technical. Can I still use it?", a: "Day to day, you just type questions into Claude, ChatGPT or Gemini. Installation needs a VPS and a few technical steps — Nextgency does those with you. If you'd rather hand off ad management entirely, choose the Ads AI plan." },
      { q: "Will the AI spend my ad money on its own?", a: "In Advanced custom mode you set two-step confirmation, budget caps, bid caps and action limits. Every command the AI runs is logged. Basic mode doesn't apply these caps; you can also tell the AI to analyze only and change nothing." },
      { q: "What is Apify for? Can I use it on its own?", a: "Apify lets the AI pull product, price, review and competitor-ad data from Shopee, TikTok Shop, Lazada, the Facebook Ads Library, Google Maps and YouTube. Since version 1.1.1 you can create an Apify-only MCP. Runs are billed on your own Apify account; some sources such as Shopee may return incomplete data." },
      { q: "Which platforms are supported?", a: "Ads: Meta, TikTok, Google, OpenAI Ads. AI: Claude, ChatGPT, Gemini (CLI, Enterprise), Claude Code. Alerts: Telegram. Personal Gemini web is not supported in the current guide." },
      { q: "What do I need to prepare?", a: "To buy, you only need your name, phone/Zalo number and email. To run it, you need an Ubuntu 24.04 or Debian 12 VPS, a subdomain, an AI app account, a GitHub account (Nextgency can help you create one) and an Apify account if you want market research. These costs are separate." },
      { q: "How does payment work, and how fast is activation?", a: `Click Buy now, fill in your details (GitHub username optional), scan the QR code with a Vietnamese bank app and keep the transfer note unchanged. The system confirms automatically; if you entered a GitHub username, the repo invite is sent right away, then Nextgency contacts you on Zalo to schedule setup. Order codes are valid for ${ORDER_VALID_DAYS} days.` },
      { q: "Can I get a refund?", a: "No. Once you are added to the repo, you can view and download the source code. Details are in the [payment & refund policy](/policies/chinh-sach-thanh-toan) (in Vietnamese)." },
    ],
  },

  guide: {
    eyebrow: "Guide",
    title: "Ordering and preparing",
    accent: "before setup",
    lead: "Have these ready and your setup session will be quick and smooth. You can buy and prepare in parallel.",
    affiliateBadge: "Referral link",
    newTab: "(opens in a new tab)",
    affiliateNote: "Links labelled “Referral link” are affiliate links: Nextgency may earn a commission if you sign up through them. Any provider that meets the technical requirements works.",
    tabs: [
      {
        id: "order",
        label: "How to order",
        blocks: [
          {
            type: "steps",
            items: [
              "Click **Buy now** and enter your name, phone/Zalo number and email. The **GitHub account** field is **optional**: if you have one, enter your username (not your email) to get a repo invite right away; if not, leave it blank and Nextgency will help.",
              "Tick the box confirming you've read the terms of use and the payment & refund policy, then click **Continue to payment**.",
              "Scan the QR code with your Vietnamese bank app. The amount and transfer note (your order code) are pre-filled — **don't edit the note**.",
              "The system confirms automatically once the money arrives and shows **Payment successful**. Keep your order code.",
              `A Nextgency team member will contact you on Zalo (the number you registered) during working hours (${WORK_HOURS}). If you entered a GitHub username, the repo invite is sent automatically — accept it from the GitHub email or notification. Need more help? Message the [Nextgency fanpage](${SITE.contact.fanpage}).`,
            ],
          },
          { type: "tip", text: `Closed the payment window by accident? Click **Buy now** again to reopen your pending QR code (in the same browser session). Order codes stay valid for ${ORDER_VALID_DAYS} days. Paid too little, too much or with the wrong note? See the [payment policy](/policies/chinh-sach-thanh-toan) (in Vietnamese).` },
        ],
      },
      {
        id: "github",
        label: "GitHub",
        blocks: [
          { type: "tip", text: "You **don't need** a GitHub account to order. If you don't have one, a Nextgency team member will help you create it when they contact you on Zalo." },
          {
            type: "steps",
            items: [
              "Create a GitHub account (free) and verify your email.",
              "We recommend **a separate account just for the server** (for example `company-ads-server`). A classic token needs the `repo` scope — it can read and write every repo of that account, so don't use an account that holds important projects.",
              "Give this account's username when you order (or tell our team when they contact you), then accept the repo invite when it arrives.",
              "Create one token (Tokens classic): tick `repo` and `read:packages`, choose a 1-year expiry, click Generate and **copy it immediately** (GitHub shows it only once).",
            ],
          },
          { type: "tip", tone: "warn", text: "Keep the token in a password manager. Never send it to anyone, even when asking for support, and never paste it into chat or email." },
          { type: "links", groups: [{ title: "Useful links", list: "github" }] },
        ],
      },
      {
        id: "vps",
        label: "VPS",
        blocks: [
          {
            type: "checks",
            items: [
              "Operating system: **Ubuntu 24.04** (recommended) or Debian 12.",
              "Minimum **1 vCPU, 2 GB RAM, 20 GB disk**. Pick a region close to your users for faster access.",
              "Your provider will send you the VPS **IP address, username and password** (or SSH key).",
              "A Windows 10/11 or macOS computer to connect with `ssh root@VPS_IP` (PowerShell / Terminal).",
              "If you point your domain straight to the IP, open ports 80 and 443; with Cloudflare Tunnel no ports need to be opened.",
            ],
          },
          { type: "tip", text: "Never send your root password to anyone over chat. For remote support, follow the “Remote support and access safety” section of the [support policy](/policies/chinh-sach-ho-tro) (in Vietnamese)." },
          { type: "links", groups: [{ title: "International VPS", list: "vpsIntl" }, { title: "Vietnam-based VPS", list: "vpsVn" }] },
        ],
      },
      {
        id: "domain",
        label: "Domain",
        blocks: [
          {
            type: "checks",
            items: [
              "You need **1 domain** (for example `company.com`). The software runs on a subdomain such as `mcp.company.com`.",
              "Start the subdomain with `mcp.`; avoid starting it with `ads.` because some ad blockers and antivirus tools may block the dashboard.",
              "Option 1: create an **A** record pointing the subdomain to your VPS IP (on Cloudflare, keep the cloud **grey — DNS only**).",
              "Option 2: use **Cloudflare Tunnel** — the domain must be managed on Cloudflare, and no ports need to be opened on the VPS.",
            ],
          },
          { type: "links", groups: [{ title: "Domain registrars", list: "domain" }] },
        ],
      },
      {
        id: "ai",
        label: "AI & tools",
        blocks: [
          {
            type: "checks",
            items: [
              "Pick at least **1 AI app**: Claude, ChatGPT or Gemini (Gemini CLI/Enterprise; personal Gemini web isn't supported). Check that your plan allows custom MCP connectors.",
              "Have suitable admin/analyst access on the **ad accounts** you want to connect (Meta, TikTok, Google, OpenAI Ads).",
              "**Optional:** an Apify account for market research (billed separately by Apify) and a Telegram bot for alerts.",
            ],
          },
          { type: "links", groups: [{ title: "AI apps", list: "ai" }, { title: "Extra tools", list: "tools" }] },
        ],
      },
    ] as GuideTab[],
  },

  final: {
    title: "Your competitors will ask AI",
    accent: "before they spend on ads. Will you?",
    sub: `One payment of ${price} — with Nextgency helping you set up.`,
    buy: "Buy now",
    zalo: "Ask on Zalo",
    fanpage: "Message our fanpage",
  },

  footer: {
    tagline: "Nextgency — digital marketing, AI and automation solutions for businesses.",
    contact: "Contact",
    hotline: "Hotline",
    policiesLabel: "Policies",
    policies: [
      { href: "/terms", label: "Terms of use" },
      { href: "/privacy", label: "Privacy policy" },
      { href: "/policies/chinh-sach-thanh-toan", label: "Payment & refund policy" },
      { href: "/policies/chinh-sach-ho-tro", label: "Support policy" },
    ],
    policiesNote: "Policy pages are in Vietnamese.",
    copyright: "© 2026 Nextgency. Ads MCP Simple is software developed by Noti (noti.vn).",
    trademark: "Meta, TikTok, Google, OpenAI, Claude, ChatGPT, Gemini, Apify and Telegram are trademarks of their respective owners; this is not an official site of any of them.",
  },
};
