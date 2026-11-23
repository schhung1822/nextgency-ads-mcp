import type { Metadata } from "next";
import Link from "next/link";
import { ContactList, LegalPage, Note, Sec, Ul, legalMeta } from "@/components/legal/legal-page";
import { GLOBAL, GLOBAL_PRICE_CENTS, LEGAL, LEGAL_GLOBAL, SITE, formatMoney } from "@/lib/site";

export const metadata: Metadata = {
  ...legalMeta(
    "Terms of Service",
    "The terms that apply when you buy and use Ads MCP Simple, including repository access and setup help from Nextgency.",
    "global",
  ),
  alternates: { canonical: `${GLOBAL.path}/terms` },
};

const link = "text-iris underline underline-offset-4";

export default function GlobalTermsPage() {
  return (
    <LegalPage title="Terms of Service" current={`${GLOBAL.path}/terms`} locale="global">
      <Sec n={1} title="Scope and acceptance">
        <p>
          These Terms govern your use of our website at {SITE.url.replace(/^https?:\/\//, "")}{GLOBAL.path}, and your purchase, payment, access to and use of Ads MCP Simple: the software, the private GitHub repository, installer and scripts, guides, videos and the setup help we provide (together, the “Product”).
        </p>
        <p>By placing an order, paying or using the Product, you confirm that:</p>
        <Ul>
          <li>you have read and agree to these Terms, our <Link className={link} href={`${GLOBAL.path}/privacy`}>Privacy Policy</Link>, our <Link className={link} href={`${GLOBAL.path}/payment-refund-policy`}>Payment &amp; Refund Policy</Link> and our <Link className={link} href={`${GLOBAL.path}/support-policy`}>Support Policy</Link>;</li>
          <li>you are at least 18 years old and able to enter into a binding contract (or you act with the consent of a parent or guardian);</li>
          <li>the information you give us is accurate and you are entitled to use it.</li>
        </Ul>
        <p>If you do not agree, please do not order or use the Product.</p>
      </Sec>

      <Sec n={2} title="Who we are">
        <Ul>
          <li>Operator: <b>{LEGAL.operator}</b>, a household business (hộ kinh doanh) registered in Vietnam.</li>
          {LEGAL.address && <li>Address: {LEGAL.address}</li>}
          {LEGAL.taxId && <li>Tax ID: {LEGAL.taxId}</li>}
        </Ul>
        <ContactList locale="global" />
        <p>In these Terms, “we”, “us” and “{LEGAL.operator}” mean the operator named above. Ads MCP Simple is software developed by Noti (noti.vn) and offered by us.</p>
      </Sec>

      <Sec n={3} title="The Product">
        <p>A purchase includes, as described on the product page when you order:</p>
        <Ul>
          <li>read-only access to a private GitHub repository containing the Docker Compose installer, quick-install script and self-hosting guides for Ads MCP Simple;</li>
          <li>an installation video walkthrough;</li>
          <li>email setup help under our <Link className={link} href={`${GLOBAL.path}/support-policy`}>Support Policy</Link>, for {LEGAL.supportMonths} months from your confirmed payment.</li>
        </Ul>
        <p>
          Ads MCP Simple is <b>self-hosted</b>: you provide and pay for your own server (VPS), domain, AI subscription and any third-party accounts (for example Apify), and you are responsible for those costs. The current price is {formatMoney(GLOBAL_PRICE_CENTS, "USD")}, shown at checkout before you pay.
        </p>
      </Sec>

      <Sec n={4} title="Orders, accounts and information you provide">
        <Ul>
          <li>You must give us your real name, a working email address and your country. A GitHub username is optional when you order; if you give one, repository access is granted to that account. If you don’t, we will help you create an account and grant access when we email you. Wrong details can delay or prevent access.</li>
          <li>You need to accept the repository invitation on GitHub to receive access. Invitations expire after 7 days.</li>
          <li>You are responsible for the security of your GitHub account, access tokens, server, ad accounts and all your logins. Never send us passwords, one-time codes or full tokens.</li>
          <li>We recommend a separate GitHub account for the server, to limit risk to your other repositories.</li>
          <li>An order is complete only when PayPal confirms your payment and we have granted access. See the <Link className={link} href={`${GLOBAL.path}/payment-refund-policy`}>Payment &amp; Refund Policy</Link>.</li>
        </Ul>
      </Sec>

      <Sec n={5} title="Licence">
        <p>
          Once your payment is confirmed, we grant you a limited, non-exclusive, non-transferable, revocable licence to use the Product for your own business or the business you work for, within the scope described on the product page.
        </p>
        <p>
          You are buying a licence, not ownership of the Product or its intellectual property. Words such as “free updates” describe the updates we release for the Product during its reasonable lifetime and depend on your compliance with these Terms and on the third-party platforms the Product connects to remaining available.
        </p>
      </Sec>

      <Sec n={6} title="Intellectual property and prohibited conduct">
        <p>The source code, scripts, documents, videos, prompts, designs, trademarks and other content of the Product are protected by intellectual property laws. Unless we agree in writing, you must not:</p>
        <Ul>
          <li>share, publish, resell, rent, sublicense or give the repository, scripts, videos or documents to anyone else, or share your GitHub account or tokens that have access;</li>
          <li>copy, extract, translate, modify or build derivative products in order to sell them or offer them as a service to others;</li>
          <li>use the Product’s content to train models, build a knowledge base or build a competing product;</li>
          <li>remove or alter copyright notices, access controls or identifying marks;</li>
          <li>probe, attack or interfere with our systems, fake payments or access data you are not entitled to;</li>
          <li>use the Product to break the law or the rules of Meta, TikTok, Google, OpenAI or any other platform.</li>
        </Ul>
      </Sec>

      <Sec n={7} title="Enforcement">
        <p>If we reasonably suspect unauthorised sharing, fraud, interference or a breach of these Terms, we may:</p>
        <Ul>
          <li>suspend or limit access while we investigate;</li>
          <li>revoke repository access, licence and support;</li>
          <li>keep evidence, require you to stop, seek compensation and involve the authorities where necessary.</li>
        </Ul>
        <p>To the extent the law allows, access revoked because of your breach will not be restored, transferred or refunded.</p>
      </Sec>

      <Sec n={8} title="Third-party platforms, ad accounts and data">
        <Ul>
          <li>Ads MCP Simple connects to third-party services such as Meta, TikTok, Google, OpenAI, Anthropic, Apify, Telegram, GitHub, your server and domain providers. They can change their APIs, prices, rules or stop their services. That is not by itself our fault and does not entitle you to a refund.</li>
          <li>Costs of third-party services (server, domain, AI, Apify, ad spend) are yours and are not included in the price.</li>
          <li>When your AI acts on an ad account it does so within the permissions and limits you configure. You are responsible for choosing those permissions, setting budget caps and checking changes. We are not liable for ad spend or losses caused by actions of the AI or of people you authorise.</li>
          <li>Market data collected through Apify is third-party public data. It may be incomplete or wrong; check it before you act on it, and only collect data you are allowed to collect under the source platform’s terms.</li>
        </Ul>
      </Sec>

      <Sec n={9} title="Product information and changes">
        <p>Please read the product page, including the setup requirements, the support scope and any stated limitations, before you buy. We may update the Product, documents, requirements or how we deliver them to keep it working and secure. Changes will not remove the core of what you bought, except where required by law, for security, or because a third-party service stops working.</p>
      </Sec>

      <Sec n={10} title="No guarantee of results">
        <p>The Product, its guides and AI answers are tools to support your work. Results depend on your data, accounts, budget, product, market and many other factors. We do not promise sales, profit, ad performance or any business result. Suggestions from an AI do not replace your own judgement.</p>
      </Sec>

      <Sec n={11} title="Limitation of liability">
        <p>
          To the maximum extent permitted by law, we are not liable for indirect or consequential loss, lost profit, lost data, interruptions caused by your server, devices or network, changes by third-party platforms, use that does not follow our instructions, or unauthorised acts of users. Please back up your server and data regularly. Our total liability for any claim relating to the Product is limited to the amount you paid for it.
        </p>
        <Note>
          Nothing in these Terms excludes or limits liability that cannot be excluded by law, or the mandatory consumer rights you have under the laws of the country where you live.
        </Note>
      </Sec>

      <Sec n={12} title="Business customers and invoices">
        <p>
          The online checkout is designed for quick purchases by PayPal. If you need a contract, an invoice in a company name, a purchase for several entities or special terms, please contact us <b>before you pay</b> so we can agree them. Changing the buyer or issuing a company invoice after payment may not be possible.
        </p>
      </Sec>

      <Sec n={13} title="Governing law and disputes">
        <p>
          These Terms are governed by the laws of Vietnam. We will first try to resolve any dispute in good faith. If that fails, the competent courts of Vietnam have jurisdiction, without taking away any right you have under mandatory consumer law to bring a claim in the courts of your country of residence.
        </p>
      </Sec>

      <Sec n={14} title="Changes to these Terms">
        <p>
          We may update these Terms to reflect changes in the law, technology or the Product. The new version is published on this site with its date ({LEGAL_GLOBAL.updated} for the current one). If a change significantly affects rights you already have, we will tell you in a suitable way before it applies, unless it must apply immediately for legal or security reasons. The terms in force when you ordered apply to your purchase unless the law requires otherwise or you agree to the new version.
        </p>
        <Note>If you have questions about these Terms, please contact us using the details in section 2 before you order.</Note>
      </Sec>
    </LegalPage>
  );
}
