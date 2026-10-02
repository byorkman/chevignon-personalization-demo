// lib/personalization.ts
"use client";

import type { CartLine } from "./cart";
import type { Product } from "@/data/products";

declare global { interface Window { SalesforceInteractions?: any } }

// El beacon se carga de forma asíncrona: esperamos a que el SDK exista
// (hasta 5 s) en vez de descartar el evento en silencio.
function whenReady(retries = 20, delayMs = 250): Promise<any | null> {
  return new Promise((resolve) => {
    const attempt = (n: number) => {
      const s = typeof window !== "undefined" ? window.SalesforceInteractions : null;
      if (s?.sendEvent) return resolve(s);
      if (n <= 0) return resolve(null);
      setTimeout(() => attempt(n - 1), delayMs);
    };
    attempt(retries);
  });
}

async function send(payload: any) {
  const s = await whenReady();
  if (!s) {
    console.warn("[DC] SDK no disponible, evento descartado:", payload?.interaction?.name);
    return;
  }
  try {
    s.sendEvent(payload);
  } catch (e) {
    console.warn("[DC] Error enviando evento", e);
  }
}

// Estructura del SDK:
//   interaction.name / eventType        -> actividad (Engagement)
//   interaction.attributes.{campo}      -> llega al DLO como attributes{Campo} (sku -> attributesSku)
//   user.identities / user.attributes   -> perfil (Profile); user.attributes llega sin prefijo

export function trackProductView(p: Product) {
  return send({
    interaction: {
      name: "View Product",
      eventType: "Chevignon_Engagement",
      attributes: {
        sku: String(p.sku),
        productName: String(p.name),
        prodCategory: String(p.category),
        price: Number(p.price),
        currency: "COP",
      },
    },
  });
}

export function trackAddToCart(p: Product, quantity: number, _size?: string) {
  return send({
    interaction: {
      name: "Add To Cart",
      eventType: "Chevignon_Engagement",
      attributes: {
        sku: String(p.sku),
        productName: String(p.name),
        prodCategory: String(p.category),
        price: Number(p.price),      // precio unitario; el total = price * quantity
        quantity: Number(quantity),
        currency: "COP",
      },
    },
  });
}

export function trackOrder(orderId: string, _lines: CartLine[], totalValue: number) {
  return send({
    interaction: {
      name: "Order Completed",
      eventType: "Chevignon_Engagement",
      attributes: {
        orderId: String(orderId),
        price: Number(totalValue),   // total del pedido
        currency: "COP",
      },
    },
  });
}

export function identify(user: { customerId: string; email: string; firstName?: string }) {
  return send({
    interaction: { name: "Identity Login", eventType: "Chevignon_Engagement" },
    user: {
      identities: { emailAddress: user.email },
      attributes: {
        eventType: "Chevignon_Profile",   // enruta al evento Profile del schema
        category: "Profile",
        email: user.email,
        customerId: user.customerId,
        ...(user.firstName ? { firstName: user.firstName } : {}),
      },
    },
  });
}

export function trackPageView(page: any) {}
export async function fetchCampaign(campaignName: string): Promise<any> {
  return {};
}
