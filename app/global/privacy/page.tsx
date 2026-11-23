import type { Metadata } from "next";
import Link from "next/link";
import { ContactList, LegalPage, Sec, Ul, legalMeta } from "@/components/legal/legal-page";
import { GLOBAL, LEGAL } from "@/lib/site";

export const metadata: Metadata = {
  ...legalMeta(
    "Privacy Policy",
    "How Nextgency collects, uses, shares and protects your personal data when you buy Ads MCP Simple.",
    "global",
  ),
  alternates: { canonical: `${GLOBAL.path}/privacy` },
};

const link = "text-iris underline underline-offset-4";

export default function GlobalPrivacyPage() {
  return (
    <LegalPage title="Privacy Policy" current={`${GLOBAL.path}/privacy`} locale="global">
      <Sec n={1} title="Who is responsible, and scope">
        <p>
          This policy explains how <b>{LEGAL.operator}</b>, a household business registered in Vietnam (“we”, “us”), collects, uses, shares and protects personal data when you visit our website at {GLOBAL.path}, place an order, pay, receive access to Ads MCP Simple or ask us for support. We are the controller of this data.
        </p>
        <ContactList locale="global" />
      </Sec>

      <Sec n={2} title="Data we process">
        <Ul>
          <li><b>Order details:</b> your name, email address, country, GitHub username (if you give one), your notes, and your choices about our terms and email updates.</li>
          <li><b>Payment details:</b> payments are made through PayPal. We receive the order ID, amount, currency, status, PayPal transaction (capture) ID, the email address of your PayPal account and the time of payment. <b>We never receive or store your card number or PayPal password.</b></li>
          <li><b>Technical data:</b> IP address, browser type and server logs, used for security and to limit abuse (for example, to stop repeated order attempts).</li>
          <li><b>Support:</b> what you write to us, screenshots, error messages and other information you choose to send.</li>
          <li><b>On your device:</b> your cookie choice is saved in your browser’s local storage. Our scripts may also keep a short-lived marker in session storage so the same order is not counted twice in our measurement tools.</li>
        </Ul>
        <p>We do not ask for passwords, one-time codes, ad account tokens or API keys when you order. When you ask for setup help, please follow the safe-sharing rules in our <Link className={link} href={`${GLOBAL.path}/support-policy`}>Support Policy</Link>.</p>
      </Sec>

      <Sec n={3} title="Where the data comes from">
        <Ul>
          <li>From you, when you fill in the order form or contact us.</li>
          <li>Automatically from your browser and our servers when you use the site.</li>
          <li>From PayPal, when your payment is processed.</li>
          <li>From GitHub, when we check that the username you entered exists (we receive its public name and avatar).</li>
        </Ul>
      </Sec>

      <Sec n={4} title="Why we use your data, and our legal bases">
        <Ul>
          <li><b>To take and deliver your order</b> (create the order, confirm the payment, grant repository access, send your setup email and give support). Legal basis: performing our contract with you.</li>
          <li><b>To keep the service secure</b> and prevent fraud, spam and abuse, and to protect our intellectual property. Legal basis: our legitimate interests.</li>
          <li><b>To meet legal duties</b> such as accounting, tax and responding to lawful requests. Legal basis: legal obligation.</li>
          <li><b>To measure and improve our advertising</b> (analytics and advertising cookies, and sending purchase events to Meta). Legal basis: your consent, which you can withdraw at any time.</li>
          <li><b>To email you product updates and tips,</b> only if you tick the optional box at checkout. Legal basis: your consent.</li>
        </Ul>
        <p>Where we rely on consent, withdrawing it does not affect what we did before. It does not apply to data we must keep by law or to resolve a dispute.</p>
      </Sec>

      <Sec n={5} title="Cookies and measurement" id="cookies">
        <p>
          On this part of the site we use essential storage to run the page (for example, remembering your cookie choice). <b>We load analytics and advertising tools only if you click “Accept all”</b> on the cookie banner. If you choose “Reject non-essential”, they are not loaded. You can change your choice at any time with “Cookie settings” in the footer. If you reject after accepting, reload the page to stop tools that are already running.
        </p>
        <Ul>
          <li><b>Google Tag Manager / Google Analytics</b> (only with consent): record page views and actions such as starting or completing a purchase. They may set cookies (for example <code>_ga</code>) and receive your IP address and device information.</li>
          <li><b>Meta Pixel</b> (only with consent): records the same actions to measure and optimise our ads and may set cookies (<code>_fbp</code>, <code>_fbc</code>).</li>
          <li><b>Meta Conversions API</b> (only if you accepted cookies before ordering): after you start or complete a purchase, our server sends Meta your email address and name (hashed with SHA-256), your IP address, browser information, the order ID and the order value. We do not send your notes, GitHub username or payment details. If you did not accept cookies, we send nothing.</li>
          <li><b>PayPal:</b> when you reach the checkout form, your browser loads PayPal’s script. PayPal may set its own cookies and collect device and fraud-prevention data under the <a className={link} href="https://www.paypal.com/myaccount/privacy/privacyhub" target="_blank" rel="noopener noreferrer">PayPal Privacy Statement</a>.</li>
          <li><b>GitHub:</b> if you enter a GitHub username, your browser shows that account’s avatar from GitHub’s servers.</li>
        </Ul>
        <p>Some US state laws treat sharing data for advertising as “sharing” or “sale”. Choosing “Reject non-essential” stops it. We do not sell your personal data for money.</p>
      </Sec>

      <Sec n={6} title="Who we share data with">
        <p>We share data only as needed, with service providers acting for us and with other independent parties where described:</p>
        <Ul>
          <li><b>PayPal</b> (an independent controller for payment processing): to take payment, prevent fraud and send you a receipt.</li>
          <li><b>Hosting and infrastructure:</b> Vercel hosts the website, and our database server stores order records.</li>
          <li><b>Lark:</b> our internal team receives order notifications (including your order details) so we can act on them.</li>
          <li><b>Email and automation tools</b> that send your order and setup emails.</li>
          <li><b>GitHub:</b> your username is used to invite you to the repository.</li>
          <li><b>Google and Meta:</b> only the measurement data described in section 5, and only with your consent.</li>
          <li><b>Advisers, auditors and authorities</b> where the law requires or allows.</li>
        </Ul>
      </Sec>

      <Sec n={7} title="International transfers">
        <p>We operate from Vietnam and our providers may process data in other countries, including the United States and the European Union. Your data may therefore leave your country. Where the law requires it, we rely on appropriate safeguards, such as the provider’s standard contractual clauses or equivalent measures.</p>
      </Sec>

      <Sec n={8} title="How long we keep data">
        <Ul>
          <li><b>Paid orders:</b> kept for as long as accounting, tax and legal rules require, and to handle support and disputes.</li>
          <li><b>Unpaid or abandoned checkout records:</b> kept only as long as needed to resolve payment problems, and deleted on request.</li>
          <li><b>Support messages and internal notifications:</b> kept while we need them for the purposes above.</li>
          <li><b>Server logs:</b> kept for the period set by our infrastructure providers.</li>
        </Ul>
        <p>We may keep data longer when needed for security, backups or to deal with a legal claim.</p>
      </Sec>

      <Sec n={9} title="Your rights">
        <p>Depending on where you live (for example under the GDPR, the UK GDPR, US state privacy laws, or Vietnamese data protection law), you may have the right to:</p>
        <Ul>
          <li>know what data we hold about you and get a copy;</li>
          <li>correct data that is wrong;</li>
          <li>ask us to delete data we no longer need;</li>
          <li>restrict or object to some uses, including direct marketing;</li>
          <li>withdraw consent at any time;</li>
          <li>receive your data in a portable format;</li>
          <li>complain to your data protection authority.</li>
        </Ul>
        <p>To use these rights, email us. We may ask you to confirm your identity so we don’t share or delete data wrongly, and some payment records must be kept by law. We will not treat you differently for using your privacy rights.</p>
        <ContactList locale="global" />
      </Sec>

      <Sec n={10} title="Security">
        <p>We use reasonable measures such as encrypted connections (HTTPS), signature checks on payment notifications, access controls, rate limiting and sending order information only to the internal channels that need it. No system is completely secure, so please protect your devices, email, GitHub account and passwords too.</p>
      </Sec>

      <Sec n={11} title="Children">
        <p>Our Product is for adults and businesses. We do not knowingly collect data from children. If you believe a child has given us data, please contact us and we will deal with it.</p>
      </Sec>

      <Sec n={12} title="Changes and contact">
        <p>We may update this policy and will publish the new version with its date. For any privacy request or question, contact us:</p>
        <ContactList locale="global" />
      </Sec>
    </LegalPage>
  );
}
