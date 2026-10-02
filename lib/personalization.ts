// lib/personalization.ts
"use client";

import type { CartLine } from "./cart";
import type { Product } from "@/data/products";

declare global {
  interface Window {
    SalesforceInteractions?: any;
  }
}

function sdk(): any | null {
  if (typeof window === "undefined") return null;
  return window.SalesforceInteractions || null;
}

export function trackProductView(p: Product) {
  const s = sdk();
  if (!s) return;
  try {
    s.sendEvent({
      interaction: {
        name: "View Product",
        eventType: "Chevignon_Engagement",
        attributes: {
          // Estos nombres deben coincidir EXACTO con el Developer Name del Schema
          category: "Engagement",
          interactionName: "View Product",
          sku: p.sku,
          productName: p.name,
          prodCategory: p.category,
          price: p.price,
          currency: p.currency
        }
      }
    });
  } catch (e) { console.warn(e); }
}

export function trackAddToCart(p: Product, quantity: number, size?: string) {
  const s = sdk();
  if (!s) return;
  try {
    s.sendEvent({
      interaction: {
        name: "Add To Cart",
        eventType: "Chevignon_Engagement",
        attributes: {
          category: "Engagement",
          interactionName: "Add To Cart",
          sku: p.sku,
          productName: p.name,
          prodCategory: p.category,
          price: p.price * quantity,
          currency: p.currency
        }
      }
    });
  } catch (e) { console.warn(e); }
}

export function trackOrder(orderId: string, lines: CartLine[], totalValue: number) {
  const s = sdk();
  if (!s) return;
  try {
    s.sendEvent({
      interaction: {
        name: "Order Completed",
        eventType: "Chevignon_Engagement",
        attributes: {
          category: "Engagement",
          interactionName: "Order Completed",
          sku: orderId,
          price: totalValue,
          currency: "COP"
        }
      }
    });
  } catch (e) { console.warn(e); }
}

export function identify(user: { customerId: string; email: string; firstName?: string }) {
  const s = sdk();
  if (!s) return;
  try {
    s.sendEvent({
      interaction: { name: "Identity Login" },
      user: {
        identities: { emailAddress: user.email },
        attributes: {
          eventType: "Chevignon_Profile",
          category: "Profile",
          email: user.email,
          customerId: user.customerId,
          firstName: user.firstName
        }
      }
    });
  } catch (e) { console.warn(e); }
}

// Necesario para que HeroBanner no falle en Vercel
export async function fetchCampaign(name: string) { return null; }
