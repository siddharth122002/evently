import { createOrder } from "@/lib/actions/order.actions";
import { NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
const endpointSecret = process.env.STRIPE_SIGNING_SECRET!;

export async function POST(request: Request) {
  const body = await request.text();
  let event;
  const signature = request.headers.get("stripe-signature") as string;
  try {
    event = stripe.webhooks.constructEvent(body, signature, endpointSecret);
  } catch (err) {
    return NextResponse.json({ message: "Webhook error", error: err });
  }
  if (event.type === "checkout.session.completed") {
    const { id, amount_total, metadata } = event.data.object;
    const order = {
      stripeId: id,
      eventId: metadata?.eventId || "",
      buyerId: metadata?.buyerId || "",
      totalAmount: amount_total ? (amount_total / 100).toString() : "0",
      createdAt: new Date(),
    };

    const newOrder = await createOrder(order);
    return NextResponse.json({ message: "OK", order: newOrder });
  }
  return NextResponse.json({ message: "OK" });
}
