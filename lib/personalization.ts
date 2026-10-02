// lib/personalization.ts
"use client";

import type { CartLine } from "./cart";
import type { Product } from "@/data/products";

declare global { interface Window { SalesforceInteractions?: any; } }

function sdk() {
  if (typeof window === "undefined") return null;
  return window.SalesforceInteractions || null;
}

export function trackProductView(p: Product) {
  const s = sdk();
  if (!s) return;
  console.log("🚀 Enviando Producto:", p.sku); // Mira esto en la consola F12
  
  s.sendEvent({
    interaction: {
      name: "View Product",
      eventType: "Chevignon_Engagement"
    },
    attributes: {
      category: "Engagement",
      interactionName: "View Product",
      sku: String(p.sku),
      productName: String(p.name),
      prodCategory: String(p.category),
      price: Number(p.price), // Forzamos que sea número
      currency: "COP"
    }
  });
}

export function identify(user: { customerId: string; email: string; firstName?: string }) {
  const s = sdk();
  if (!s) return;
  s.sendEvent({
    interaction: { name: "Identity Login" },
    user: { identities: { emailAddress: user.email } },
    attributes: {
      eventType: "Chevignon_Profile",
      category: "Profile",
      email: user.email,
      customerId: user.customerId,
      firstName: user.firstName
    }
  });
}

// Estos se quedan igual para que el Build no falle
export function trackPageView(p: any) {}
export function trackAddToCart(p: any, q: any) { trackProductView(p); }
export function trackOrder(id: any, l: any, v: any) {
    const s = sdk();
    if(s) s.sendEvent({
        interaction: { name: "Order Completed", eventType: "Chevignon_Engagement" },
        attributes: { category: "Engagement", sku: id, price: Number(v), currency: "COP" }
    });
}
export async function fetchCampaign(n: string) { return {}; }
