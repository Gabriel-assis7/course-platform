"use client";

import {
  EmbeddedCheckout,
  EmbeddedCheckoutProvider,
} from "@stripe/react-stripe-js";
import { stripeClientPromise } from "../stripeClient";
import { getClientSessionSecret } from "../actions/stripe";

export default function StripeCheckoutForm({
  product,
  user,
}: {
  product: {
    id: string;
    name: string;
    description: string;
    imageUrl: string;
    priceInDollars: number;
  };
  user: {
    id: string;
    email: string;
  };
}) {
  return (
    <EmbeddedCheckoutProvider
      stripe={stripeClientPromise}
      options={{
        fetchClientSecret: getClientSessionSecret.bind(null, product, user),
      }}
    >
      <EmbeddedCheckout />
    </EmbeddedCheckoutProvider>
  );
}
