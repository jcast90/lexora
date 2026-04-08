import { NextRequest, NextResponse } from "next/server";

const TABLE_PREFIX = process.env.NEXT_PUBLIC_TABLE_PREFIX || "";

export async function POST(request: NextRequest) {
  const body = await request.text();
  const signature = request.headers.get("stripe-signature");

  if (!signature || !process.env.STRIPE_WEBHOOK_SECRET) {
    return NextResponse.json({ error: "Missing signature" }, { status: 400 });
  }

  // Verify Stripe signature — 400 on invalid
  let event;
  try {
    const Stripe = (await import("stripe")).default;
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
      apiVersion: "2026-02-25.clover",
    });
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Signature verification failed";
    console.error("[stripe-webhook] Signature verification failed:", msg);
    return NextResponse.json({ error: msg }, { status: 400 });
  }

  // Process event — 500 on DB failures so Stripe retries
  try {
    const { createClient } = await import("@supabase/supabase-js");
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object;
        const email = session.customer_email;
        const customerId = session.customer as string;

        if (email) {
          const { error: updateError } = await supabase
            .from(`${TABLE_PREFIX}profiles`)
            .update({ plan: "pro", stripe_customer_id: customerId })
            .eq("email", email);

          if (updateError) {
            console.error(`[stripe-webhook] Failed to upgrade plan for ${email}:`, updateError.message);
            return NextResponse.json({ error: "Failed to update user plan" }, { status: 500 });
          }
        }
        break;
      }

      case "customer.subscription.deleted": {
        const subscription = event.data.object;
        const customerId = subscription.customer as string;

        const { error } = await supabase
          .from(`${TABLE_PREFIX}profiles`)
          .update({ plan: "free" })
          .eq("stripe_customer_id", customerId);

        if (error) {
          console.error(`[stripe-webhook] Failed to downgrade plan for customer ${customerId}:`, error.message);
          return NextResponse.json({ error: "Failed to update subscription" }, { status: 500 });
        }
        break;
      }

      case "customer.subscription.updated": {
        const subscription = event.data.object;
        const customerId = subscription.customer as string;
        const status = subscription.status;
        const newPlan = status === "active" ? "pro" : (status === "canceled" || status === "unpaid") ? "free" : null;

        if (newPlan) {
          const { error } = await supabase
            .from(`${TABLE_PREFIX}profiles`)
            .update({ plan: newPlan })
            .eq("stripe_customer_id", customerId);

          if (error) {
            console.error(`[stripe-webhook] Failed to update plan to ${newPlan} for customer ${customerId}:`, error.message);
            return NextResponse.json({ error: "Failed to update subscription" }, { status: 500 });
          }
        }
        break;
      }
    }

    return NextResponse.json({ received: true });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Webhook processing failed";
    console.error("[stripe-webhook] Unhandled error:", msg);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
