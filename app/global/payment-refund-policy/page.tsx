import type { Metadata } from "next";
import Link from "next/link";
import { ContactList, LegalPage, Note, Sec, Ul, legalMeta } from "@/components/legal/legal-page";
import { GLOBAL, GLOBAL_PRICE_CENTS, LEGAL_GLOBAL, formatMoney } from "@/lib/site";

export const metadata: Metadata = {
  ...legalMeta(
    "Payment & Refund Policy",
    "How payment by PayPal works for Ads MCP Simple, how we handle payment problems, and our refund policy for this digital product.",
    "global",
  ),
  alternates: { canonical: `${GLOBAL.path}/payment-refund-policy` },
};

const link = "text-iris underline underline-offset-4";

export default function GlobalPaymentPolicyPage() {
  return (
    <LegalPage title="Payment & Refund Policy" current={`${GLOBAL.path}/payment-refund-policy`} locale="global">
      <Sec n={1} title="General">
        <p>
          Ads MCP Simple is a digital product: access to a private GitHub repository with software, guides and videos, plus email setup help. The current price is <b>{formatMoney(GLOBAL_PRICE_CENTS, "USD")}</b> (US dollars), shown at checkout before you pay. It is a one-time price with no monthly software fee. Prices can change from time to time; the price you see at checkout when you pay is the price you are charged.
        </p>
        <p>
          We do not currently add VAT, GST or sales tax at checkout. Your bank or PayPal may charge currency-conversion or cross-border fees; those are not ours and are not refundable by us.
        </p>
        <p>
          Please read the product page, including the setup requirements, what is not included and the support scope, before you buy. By paying you confirm that you have read them and that the Product suits your needs.
        </p>
      </Sec>

      <Sec n={2} title="How payment works">
        <Ul>
          <li>You pay on our website through <b>PayPal</b>, using your PayPal balance or a debit or credit card (where PayPal offers it). Payments are processed by PayPal under its own terms and privacy statement. We never see or store your card details.</li>
          <li>After you click the PayPal button, we create an order and PayPal asks you to approve the payment. <b>You are charged only when you approve the payment in PayPal and it completes.</b> If you close the window or cancel, you are not charged.</li>
          <li>When PayPal confirms the payment, your order is marked “paid”, the checkout panel shows a confirmation, and PayPal emails you a receipt.</li>
          <li>Only pay through the checkout on our official website. We are not responsible for payments made to other accounts or links sent by unofficial sources.</li>
        </Ul>
      </Sec>

      <Sec n={3} title="Confirmation and delivery">
        <Ul>
          <li>If you entered a GitHub username, we send the repository invitation right away (automatically, or by hand during working hours: {LEGAL_GLOBAL.workHours}). You must accept it on GitHub; invitations expire after 7 days.</li>
          <li>If you did not enter a username, or something goes wrong with the invitation, we will email you to sort it out. We aim to write to you within {LEGAL_GLOBAL.firstResponse}.</li>
          <li>Times shown are estimates. PayPal, your bank, GitHub, email delivery or maintenance can cause delays.</li>
          <li>Access begins only after the payment is confirmed and we have granted access on GitHub.</li>
        </Ul>
      </Sec>

      <Sec n={4} title="Declined, pending and duplicate payments">
        <Ul>
          <li><b>Declined:</b> if PayPal declines your payment method, no order is paid. You can try another method.</li>
          <li><b>Pending:</b> PayPal sometimes holds a payment for review. We do not grant access until PayPal confirms it as completed. Once it is confirmed we grant access and email you; if it is not, no money is taken. You do not need to pay again.</li>
          <li><b>If something went wrong on screen after you paid:</b> if the page shows an error but PayPal shows you were charged, please don’t pay again. Email us with your order code or PayPal transaction ID and we will confirm your order.</li>
          <li><b>Duplicate or mistaken payments:</b> if you pay twice for the same order, or pay by mistake, email us. After we check, we will refund the extra payment to your original PayPal payment method. This is a payment correction, not a right to cancel the Product.</li>
        </Ul>
      </Sec>

      <Sec n={5} title="Refunds">
        <p>
          Because you can view and download the full source code as soon as you are added to the repository, <b>all sales are final once access has been granted</b>. To the extent the law allows, we do not refund, exchange, convert to credit or transfer a completed purchase after access is granted, including when:
        </p>
        <Ul>
          <li>you change your mind, bought by mistake, no longer need it, have no time to install it, or do not get the business result you hoped for;</li>
          <li>you did not read the description, requirements, support scope or limitations;</li>
          <li>you gave wrong contact details or a wrong GitHub username, or lost control of your email or GitHub account;</li>
          <li>your server, domain, network, ad accounts or AI accounts do not meet the requirements or are restricted by their providers;</li>
          <li>you did not install or use the Product, or the support period has ended;</li>
          <li>a third-party platform changes its API, prices or rules, or stops its service;</li>
          <li>your access or support was ended because you broke the <Link className={link} href={`${GLOBAL.path}/terms`}>Terms of Service</Link>.</li>
        </Ul>
        <p><b>When we will refund you.</b> We will refund you in full if:</p>
        <Ul>
          <li>we are unable to give you access to the repository for reasons on our side; or</li>
          <li>the Product is materially different from what we described and we cannot fix it within a reasonable time after you tell us; or</li>
          <li>we charged you in error (see section 4).</li>
        </Ul>
        <Note>
          <b>Your statutory rights.</b> Nothing in this policy limits mandatory consumer rights you have under the law of the country where you live. If you live in the European Union or the United Kingdom, you normally have 14 days to withdraw from a distance purchase. For digital content that is delivered immediately, you lose that right once delivery has started with your prior express consent and your acknowledgement that you lose it. That is why checkout asks you to confirm both before you pay. Other countries have their own rules, which continue to apply where they cannot be waived.
        </Note>
      </Sec>

      <Sec n={6} title="How to report a problem or request a refund">
        <p>Email us at the address below with your order code (or PayPal transaction ID), the email you used, and what went wrong. We aim to reply within {LEGAL_GLOBAL.firstResponse}. If we agree to a refund, we return it to your original PayPal payment method; how long it takes to show up depends on PayPal and your bank. If we refund you, repository access ends.</p>
        <ContactList locale="global" />
      </Sec>

      <Sec n={7} title="PayPal disputes and chargebacks">
        <p>
          Please contact us first so we can fix the problem quickly; most issues can be solved by email. If you open a dispute or chargeback with PayPal or your bank, we will answer it with the facts of your order (such as the payment record, the repository invitation and our emails). We may pause your access while a dispute is open, and end it if the dispute is decided in your favour and you have been refunded. Disputes opened after you received access for a reason covered by section 5 may be contested.
        </p>
      </Sec>

      <Sec n={8} title="Cancelling an unpaid order">
        <p>If you do not complete payment in PayPal, nothing is charged and the order is simply not paid. There is nothing to refund. A paid order cannot be cancelled this way; see section 5.</p>
      </Sec>

      <Sec n={9} title="Invoices and business customers">
        <p>PayPal sends you a payment receipt automatically. If you need an invoice with your company details, a contract or special terms, you must contact us and agree it <b>before you pay</b>. Adding or changing invoice details after payment may not be possible.</p>
      </Sec>

      <Sec n={10} title="Fraud and checks">
        <p>We may delay access while we check a payment that looks fake, duplicated, wrongly priced or unlawful. Giving false evidence, making dishonest refund claims or disputing a payment in bad faith after getting access can lead to loss of access and action under the law.</p>
      </Sec>

      <Sec n={11} title="Contact about payments">
        <p>Send payment questions to the address below with your order code. We only deal with the buyer or someone they have properly authorised.</p>
        <ContactList locale="global" />
      </Sec>
    </LegalPage>
  );
}
