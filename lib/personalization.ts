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
  
  console.log("🚀 Enviando a Data Cloud:", p.sku);

  s.sendEvent({
    interaction: {
      name: "View Product",
      eventType: "Chevignon_Engagement"
    },
    attributes: {
      category: "Engagement",
      // TRUCO: Envolvemos los campos en el DeveloperName del evento
      Chevignon_Engagement: {
        sku: String(p.sku),
        productName: String(p.name),
        prodCategory: String(p.category),
        price: Number(p.price),
        currency: "COP",
        interactionName: "View Product"
      }
    }
  });
}

export function trackAddToCart(p: Product, quantity: number, size?: string) {
  const s = sdk();
  if (!s) return;
  s.sendEvent({
    interaction: {
      name: "Add To Cart",
      eventType: "Chevignon_Engagement"
    },
    attributes: {
      category: "Engagement",
      Chevignon_Engagement: {
        sku: String(p.sku),
        productName: String(p.name),
        price: Number(p.price * quantity),
        currency: "COP",
        interactionName: "Add To Cart"
      }
    }
  });
}

export function trackOrder(orderId: string, lines: CartLine[], totalValue: number) {
  const s = sdk();
  if (!s) return;
  s.sendEvent({
    interaction: {
      name: "Order Completed",
      eventType: "Chevignon_Engagement"
    },
    attributes: {
      category: "Engagement",
      Chevignon_Engagement: {
        sku: orderId,
        price: Number(totalValue),
        currency: "COP",
        interactionName: "Order Completed"
      }
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
      category: "Profile",
      // Lo mismo para el perfil
      Chevignon_Profile: {
        email: user.email,
        customerId: user.customerId,
        firstName: user.firstName,
        eventType: "Chevignon_Profile",
        category: "Profile"
      }
    }
  });
}

export function trackPageView(page: any) {}
export async function fetchCampaign(campaignName: string): Promise<any> {
  return {};
}
