import type { Metadata } from "next";
import { ContactList, LegalPage, Note, Sec, Ul, legalMeta } from "@/components/legal/legal-page";
import { GLOBAL, LEGAL, LEGAL_GLOBAL } from "@/lib/site";

export const metadata: Metadata = {
  ...legalMeta(
    "Support Policy",
    "How long, how and for what we provide setup help for Ads MCP Simple.",
    "global",
  ),
  alternates: { canonical: `${GLOBAL.path}/support-policy` },
};

export default function GlobalSupportPolicyPage() {
  const months = LEGAL.supportMonths;
  return (
    <LegalPage title="Support Policy" current={`${GLOBAL.path}/support-policy`} locale="global">
      <Sec n={1} title="Support period">
        <p>
          Setup help and technical support for the Product are provided for <b>{months} months</b> from the moment your order is first confirmed as paid.
        </p>
        <p>
          Buying and then waiting, not installing yet, being busy, or having access paused because of something you did does not pause, extend or restart the support period. After {months} months you keep using the Product and receive updates under your licence, but we no longer have to help with setup, configuration, connections or new questions, unless we agree a separate support arrangement with you.
        </p>
      </Sec>

      <Sec n={2} title="Channels and response time">
        <ContactList locale="global" />
        <p>
          Support is by email. We only accept requests from the buyer’s email address or from someone they have properly authorised. We aim to give a first reply within <b>{LEGAL_GLOBAL.firstResponse}</b>; how long it takes to resolve something depends on its complexity and on your cooperation. Our hours are {LEGAL_GLOBAL.workHours}.
        </p>
      </Sec>

      <Sec n={3} title="What support covers">
        <Ul>
          <li>Granting repository access on GitHub and checking the status of a paid order.</li>
          <li>Guidance on installing Ads MCP Simple on your server with the quick-install script, and setting up the subdomain.</li>
          <li>Guidance on connecting your ad accounts (Meta, TikTok, Google, OpenAI Ads), your AI app (Claude, ChatGPT, Gemini), Telegram and Apify, as described in the Product’s guides.</li>
          <li>Finding and fixing faults in the Ads MCP Simple software or its guides.</li>
          <li>Answering and clarifying the Product’s documentation.</li>
        </Ul>
        <Note>Support means guidance and fixing faults within the Product. It does not include running ads for you, strategy, or any guarantee of business results.</Note>
      </Sec>

      <Sec n={4} title="What to send when you ask for help">
        <Ul>
          <li>Your name, the email you used to order, and your order code.</li>
          <li>Your goal, the steps you tried, what you expected and what happened.</li>
          <li>Clear screenshots or a short video of the problem, any error text, when it started, your server’s operating system and how your domain points to it (direct IP or Cloudflare Tunnel).</li>
        </Ul>
        <p><b>Never send passwords, one-time codes, private keys or full tokens</b> by email or chat. We may decline or pause work if information is missing or untrue, if we can’t reproduce the issue, or if you don’t cooperate.</p>
      </Sec>

      <Sec n={5} title="Remote help and access safety">
        <Ul>
          <li>We only connect remotely (screen sharing, server access) if you agree and only within the scope you allow.</li>
          <li>Give temporary access or a separate account for the session, and afterwards change passwords and revoke any SSH keys or tokens you shared.</li>
          <li>We do not keep your login details for anything other than the support session.</li>
          <li>Take a backup or snapshot of your server first. We are not responsible for restoring data you did not back up.</li>
        </Ul>
      </Sec>

      <Sec n={6} title="What support does not cover">
        <p>Unless we agree otherwise, we do not help for free with:</p>
        <Ul>
          <li>running or managing ads, building strategy, writing content or managing ad accounts for you;</li>
          <li>faults in your own infrastructure: server, hosting, domain, network, devices, firewall or third-party accounts;</li>
          <li>problems caused by editing the code or configuration yourself, using incompatible versions, cracked tools, or breaking a third-party platform’s rules;</li>
          <li>accounts that are locked, restricted, out of quota or changed by their provider (ads, AI, Apify and others);</li>
          <li>recovering data that you did not back up, or business, legal or tax advice;</li>
          <li>requests after the support period ends, or for an order that is not paid or confirmed.</li>
        </Ul>
        <p>We may offer work outside this scope as a paid service with its own quote, and may accept or decline it.</p>
      </Sec>

      <Sec n={7} title="Third-party dependencies">
        <p>We help you work out causes within the Product’s guides, but we are not responsible for fixing or keeping up services run by Meta, TikTok, Google, OpenAI, Anthropic, Apify, Telegram, GitHub, Cloudflare, your server or domain provider, PayPal or any other provider. When a provider changes its API, prices, interface or rules, or stops a service, that does not give a right to a refund.</p>
      </Sec>

      <Sec n={8} title="Pausing or ending support">
        <p>We may refuse, pause or end support if you:</p>
        <Ul>
          <li>commit fraud, give false information, or insult or harass our staff;</li>
          <li>share the repository, guides or other materials without permission, or interfere with our systems;</li>
          <li>ask us to do something unlawful, against a platform’s rules or that harms others;</li>
          <li>keep sending the same request through several channels, ignore reasonable diagnostic steps or hide important information.</li>
        </Ul>
        <p>Ending support because of a breach does not create a right to a refund.</p>
      </Sec>

      <Sec n={9} title="Complaints">
        <p>Send complaints by email with your name, order code, what happened, any evidence and what outcome you would like. We will confirm we have received it and tell you how we plan to handle it within a reasonable time for the issue.</p>
        <ContactList locale="global" />
      </Sec>
    </LegalPage>
  );
}
