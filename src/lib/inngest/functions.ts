import { inngest, ventureEvent } from "./index";
import config from "@/lib/config";

const productName = config.name;
const domain = config.domain;

function hexToRgb(hex: string): string {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? `${parseInt(result[1], 16)},${parseInt(result[2], 16)},${parseInt(result[3], 16)}`
    : "59,130,246";
}

function emailWrapper(content: string): string {
  const primary = config.brand?.primary || "#3b82f6";
  const accent = config.brand?.accent || "#8b5cf6";
  const surface = config.brand?.surface || "#0A0A0F";
  const surfaceLight = config.brand?.surfaceLight || "#111118";

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <style>
    body { margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: ${surface}; color: #e4e4e7; }
    .container { max-width: 580px; margin: 0 auto; padding: 40px 20px; }
    .header { text-align: center; padding: 24px 0 32px; }
    .logo { display: inline-flex; align-items: center; justify-content: center; width: 40px; height: 40px; border-radius: 10px; background: linear-gradient(135deg, ${primary}, ${accent}); }
    .logo-text { font-size: 18px; font-weight: 700; color: #ffffff; margin-left: 12px; display: inline-block; vertical-align: middle; }
    .card { background: ${surfaceLight}; border-radius: 16px; padding: 40px 32px; border: 1px solid rgba(255,255,255,0.06); }
    h1 { font-size: 24px; font-weight: 700; color: #ffffff; margin: 0 0 16px 0; line-height: 1.3; }
    h2 { font-size: 20px; font-weight: 600; color: #ffffff; margin: 24px 0 12px 0; }
    p { font-size: 16px; line-height: 1.7; color: #a1a1aa; margin: 0 0 16px 0; }
    .highlight { background: rgba(${hexToRgb(primary)}, 0.08); border-left: 4px solid ${primary}; padding: 16px 20px; border-radius: 0 12px 12px 0; margin: 24px 0; }
    .highlight p { margin: 0; color: ${primary}; }
    .cta { display: inline-block; background: linear-gradient(to right, ${primary}, ${accent}); color: #ffffff !important; text-decoration: none; padding: 14px 32px; border-radius: 10px; font-weight: 600; font-size: 16px; margin: 24px 0; }
    .footer { text-align: center; padding: 24px 0; font-size: 13px; color: #52525b; }
    .footer a { color: #52525b; }
    .divider { height: 1px; background: rgba(255,255,255,0.06); margin: 32px 0; }
    ul { padding-left: 20px; }
    li { font-size: 16px; line-height: 1.7; color: #a1a1aa; margin-bottom: 8px; }
    li strong { color: #e4e4e7; }
    a { color: ${primary}; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="logo" style="display:inline-flex;align-items:center;justify-content:center;width:40px;height:40px;border-radius:10px;background:linear-gradient(135deg,${primary},${accent});">
        <span style="color:#fff;font-weight:700;font-size:18px;">${productName.charAt(0)}</span>
      </div>
      <span class="logo-text">${productName}</span>
    </div>
    <div class="card">
      ${content}
    </div>
    <div class="footer">
      <div class="divider"></div>
      <p>${productName} &mdash; <a href="https://${domain || 'example.com'}">${domain || 'our website'}</a></p>
      <p style="font-size:11px;color:#3f3f46;">You received this because you signed up for ${productName}. <a href="https://${domain || 'example.com'}/unsubscribe" style="color:#3f3f46;">Unsubscribe</a></p>
    </div>
  </div>
</body>
</html>`;
}

const slug = productName.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
const sendingDomain = process.env.SENDING_DOMAIN || "venture-os.co";
const fromAddress = `${productName} <${slug}@${sendingDomain}>`;

// Drip campaign: 4 emails over 7 days after waitlist signup
export const signupDrip = inngest.createFunction(
  {
    id: `${slug}-signup-drip`,
    name: "Signup Drip Campaign",
    triggers: [{ event: ventureEvent("user.signup") }],
  },
  async ({ event, step }) => {
    const email = event.data.email as string;

    // Day 0: Welcome email
    await step.run("send-welcome-email", async () => {
      const { Resend } = await import("resend");
      const resend = new Resend(process.env.RESEND_API_KEY);

      await resend.emails.send({
        from: fromAddress,
        to: email,
        subject: `You're on the list — welcome to ${productName}!`,
        html: emailWrapper(`
          <h1>You're officially on the list.</h1>
          <p>Thank you for your interest in ${productName}. We're building something we think you're going to love, and we're thrilled to have you along for the ride.</p>
          <div class="highlight">
            <p>You've secured your spot. We'll keep you updated on our progress and let you know the moment early access opens up.</p>
          </div>
          <p>Over the next few days, we'll share more about what ${productName} can do for you and why we built it.</p>
          <p>In the meantime, if you have any questions, just reply to this email. We read every message.</p>
          <p style="margin-top: 32px;">Welcome aboard,<br/><strong>The ${productName} Team</strong></p>
        `),
      });
    });

    // Wait 2 days
    await step.sleep("wait-for-value-email", "2 days");

    // Day 2: Value proposition email
    await step.run("send-value-email", async () => {
      const { Resend } = await import("resend");
      const resend = new Resend(process.env.RESEND_API_KEY);

      await resend.emails.send({
        from: fromAddress,
        to: email,
        subject: `Here's what ${productName} can do for you`,
        html: emailWrapper(`
          <h1>Built for the way you actually work.</h1>
          <p>We didn't build ${productName} to be another tool that collects dust. We built it to solve real problems that slow you down every day.</p>
          <h2>What makes ${productName} different:</h2>
          <ul>
            <li><strong>Save hours every week</strong> — Automate the repetitive tasks that drain your time and energy.</li>
            <li><strong>Stay focused on what matters</strong> — A clean, intentional interface that keeps you in flow.</li>
            <li><strong>Get results faster</strong> — Purpose-built workflows designed around outcomes, not features.</li>
            <li><strong>Scale with confidence</strong> — Infrastructure that grows with you, not against you.</li>
          </ul>
          <div class="highlight">
            <p>We're putting the finishing touches on early access. You'll be among the first to experience it.</p>
          </div>
          <p>More details coming soon. Stay tuned.</p>
          <p style="margin-top: 32px;">Best,<br/><strong>The ${productName} Team</strong></p>
        `),
      });
    });

    // Wait 3 more days (Day 5 total)
    await step.sleep("wait-for-social-proof-email", "3 days");

    // Day 5: Social proof email
    await step.run("send-social-proof-email", async () => {
      const { Resend } = await import("resend");
      const resend = new Resend(process.env.RESEND_API_KEY);

      await resend.emails.send({
        from: fromAddress,
        to: email,
        subject: `You're in great company`,
        html: emailWrapper(`
          <h1>People are paying attention.</h1>
          <p>Since you signed up, our waitlist has been growing fast. Teams and professionals across industries are excited about what ${productName} can unlock for them.</p>
          <h2>Why people are joining:</h2>
          <ul>
            <li><strong>Founders</strong> are looking for tools that help them move faster without hiring a bigger team.</li>
            <li><strong>Teams</strong> want a single platform that eliminates the tool sprawl they've been dealing with.</li>
            <li><strong>Professionals</strong> want to reclaim their time and focus on high-impact work.</li>
          </ul>
          <div class="highlight">
            <p>The demand has been incredible. We're finalizing early access — and as an early sign-up, you'll get priority.</p>
          </div>
          <p>We can't wait to show you what we've been building.</p>
          <p style="margin-top: 32px;">Cheers,<br/><strong>The ${productName} Team</strong></p>
        `),
      });
    });

    // Wait 2 more days (Day 7 total)
    await step.sleep("wait-for-urgency-email", "2 days");

    // Day 7: Urgency email
    await step.run("send-urgency-email", async () => {
      const { Resend } = await import("resend");
      const resend = new Resend(process.env.RESEND_API_KEY);

      await resend.emails.send({
        from: fromAddress,
        to: email,
        subject: `Early access spots are limited — don't miss out`,
        html: emailWrapper(`
          <h1>We're almost ready to open the doors.</h1>
          <p>Early access to ${productName} is right around the corner, and we want to make sure you don't miss your window.</p>
          <div class="highlight">
            <p>We're offering a limited number of early access spots with exclusive benefits — including discounted pricing that won't be available after launch.</p>
          </div>
          <h2>Early access members get:</h2>
          <ul>
            <li><strong>Founding member pricing</strong> — locked in for life, significantly below our planned retail price.</li>
            <li><strong>Direct access to the team</strong> — share feedback and shape the product roadmap.</li>
            <li><strong>First look at every new feature</strong> — before anyone else sees it.</li>
          </ul>
          <p>Spots are limited because we want to onboard members thoughtfully and ensure a great experience for everyone.</p>
          <p>Keep an eye on your inbox — your invitation is coming soon.</p>
          <p style="margin-top: 32px;">Talk soon,<br/><strong>The ${productName} Team</strong></p>
        `),
      });
    });

    return { success: true, email };
  }
);

export const coldOutreach = inngest.createFunction(
  {
    id: `${slug}-cold-outreach`,
    name: "Cold Outreach Sequence",
    concurrency: { limit: 5 },
    triggers: [{ event: ventureEvent("outreach.new-lead") }],
  },
  async ({ event, step }) => {
    const { email, name, company, sequence } = event.data as {
      email: string;
      name: string;
      company: string;
      sequence: Array<{ subject: string; body_html: string; delay_days: number }>;
    };

    for (let i = 0; i < sequence.length; i++) {
      const emailData = sequence[i];

      if (i > 0) {
        await step.sleep(`wait-${emailData.delay_days}d-for-email-${i + 1}`, `${emailData.delay_days} days`);
      }

      await step.run(`send-email-${i + 1}`, async () => {
        const { Resend } = await import("resend");
        const resend = new Resend(process.env.RESEND_API_KEY);

        const personalizedSubject = emailData.subject
          .replace(/\{\{name\}\}/g, name)
          .replace(/\{\{company\}\}/g, company);
        const personalizedBody = emailData.body_html
          .replace(/\{\{name\}\}/g, name)
          .replace(/\{\{company\}\}/g, company);

        await resend.emails.send({
          from: fromAddress,
          to: email,
          subject: personalizedSubject,
          html: personalizedBody,
        });
      });
    }

    return { success: true, email, emailsSent: sequence.length };
  }
);

export const functions = [signupDrip, coldOutreach];
