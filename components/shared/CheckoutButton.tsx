"use client";

import { useEffect } from "react";
import { loadStripe } from "@stripe/stripe-js";
import React from "react";
import { checkoutOrder } from "@/lib/actions/order.actions";

loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

function CheckoutButton({
  purchased,
  event,
  userId,
}: {
  purchased: boolean;
  event: any;
  userId: string;
}) {
  useEffect(() => {
    const query = new URLSearchParams(window.location.search);
    if (query.get("success")) {
      console.log("Order placed! You will receive an email confirmation.");
    }

    if (query.get("canceled")) {
      console.log(
        "Order canceled -- continue to shop around and checkout when you’re ready."
      );
    }
  }, []);

  const handleCheckout = async () => {
    if (purchased) {
      alert("order already purchased");
    } else {
      const order = {
        event: event,
        userId: userId,
      };

      await checkoutOrder(order);
    }
  };
  return (
    <form action={handleCheckout}>
      <section>
        <button
          type="submit"
          className="bg-green-200 p-2 rounded-full hover:bg-green-400 text-green-900"
        >
          {event.isFree ? "Get Ticket" : "Buy Ticket"}
        </button>
      </section>
    </form>
  );
}

export default CheckoutButton;
