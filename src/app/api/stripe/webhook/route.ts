import crypto from "crypto";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

import { getSupabaseAdminClient } from "@/lib/supabaseAdmin";

type StripeEvent = {
  id: string;
  type: string;
  data: {
    object: {
      metadata?: Record<string, string>;
      [key: string]: any;
    };
  };
};

type ParsedSignature = {
  timestamp: string | null;
  signatures: string[];
};

const parseStripeSignature = (signatureHeader: string): ParsedSignature => {
  return signatureHeader.split(",").reduce<ParsedSignature>(
    (acc, part) => {
      const [key, value] = part.split("=");

      if (key === "t") {
        acc.timestamp = value ?? null;
      }

      if (key === "v1" && value) {
        acc.signatures.push(value);
      }

      return acc;
    },
    { timestamp: null, signatures: [] }
  );
};

const safeCompare = (a: string, b: string) => {
  const aBuffer = Buffer.from(a);
  const bBuffer = Buffer.from(b);

  if (aBuffer.length !== bBuffer.length) {
    return false;
  }

  return crypto.timingSafeEqual(aBuffer, bBuffer);
};

const verifyStripeSignature = (payload: string, signatureHeader: string, secret: string) => {
  const { timestamp, signatures } = parseStripeSignature(signatureHeader);

  if (!timestamp || signatures.length === 0) {
    return false;
  }

  const signedPayload = `${timestamp}.${payload}`;
  const expectedSignature = crypto
    .createHmac("sha256", secret)
    .update(signedPayload, "utf8")
    .digest("hex");

  return signatures.some((signature) => safeCompare(signature, expectedSignature));
};

export async function POST(req: Request) {
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!webhookSecret) {
    console.error("Missing STRIPE_WEBHOOK_SECRET environment variable");
    return NextResponse.json({ error: "Webhook is not configured." }, { status: 500 });
  }

  const body = await req.text();
  const headerList = await headers();
  const signatureHeader = headerList.get("stripe-signature");

  if (!signatureHeader) {
    return NextResponse.json({ error: "Missing Stripe signature." }, { status: 400 });
  }

  const isValid = verifyStripeSignature(body, signatureHeader, webhookSecret);

  if (!isValid) {
    console.error("Invalid Stripe signature", signatureHeader);
    return NextResponse.json({ error: "Invalid signature." }, { status: 400 });
  }

  let event: StripeEvent;

  try {
    event = JSON.parse(body);
  } catch (error) {
    console.error("Failed to parse Stripe event", error);
    return NextResponse.json({ error: "Invalid payload." }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const userId = event.data.object.metadata?.user_id;

    if (userId) {
      try {
        const supabaseAdmin = getSupabaseAdminClient();
        const { error } = await supabaseAdmin
          .from("profiles")
          .update({ user_type: "premium" })
          .eq("id", userId);

        if (error) {
          console.error("Failed to update user after Stripe payment", error);
        }
      } catch (error) {
        console.error("Supabase admin error", error);
      }
    }
  }

  return NextResponse.json({ received: true });
}
