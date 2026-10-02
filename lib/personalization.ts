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

/**
 * VISTA DE PRODUCTO
 */
export function trackProductView(p: Product) {
  const s = sdk();
  if (!s) return;
  
  console.log("Enviando Producto a Data Cloud:", p.sku);

  try {
    s.sendEvent({
      interaction: {
        name: "View Product",
        eventType: "Chevignon_Engagement"
      },
      attributes: {
        category: "Engagement",
        interactionName: "View Product",
        sku: p.sku,
        productName: p.name,
        prodCategory: p.category,
        price: p.price,
        currency: p.currency
      }
    });
  } catch (e) { console.warn(e); }
}

/**
 * AGREGAR AL CARRITO
 */
export function trackAddToCart(p: Product, quantity: number, size?: string) {
  const s = sdk();
  if (!s) return;
  try {
    s.sendEvent({
      interaction: {
        name: "Add To Cart",
        eventType: "Chevignon_Engagement"
      },
      attributes: {
        category: "Engagement",
        interactionName: "Add To Cart",
        sku: p.sku,
        productName: p.name,
        prodCategory: p.category,
        price: p.price * quantity,
        currency: p.currency
      }
    });
  } catch (e) { console.warn(e); }
}

/**
 * COMPRA FINALIZADA
 */
export function trackOrder(orderId: string, lines: CartLine[], totalValue: number) {
  const s = sdk();
  if (!s) return;
  try {
    s.sendEvent({
      interaction: {
        name: "Order Completed",
        eventType: "Chevignon_Engagement"
      },
      attributes: {
        category: "Engagement",
        interactionName: "Order Completed",
        sku: orderId,
        price: totalValue,
        currency: "COP"
      }
    });
  } catch (e) { console.warn(e); }
}

/**
 * LOGIN / IDENTIDAD
 */
export function identify(user: { customerId: string; email: string; firstName?: string }) {
  const s = sdk();
  if (!s) return;
  try {
    s.sendEvent({
      interaction: { name: "Identity Login" },
      user: {
        identities: { emailAddress: user.email }
      },
      attributes: {
        eventType: "Chevignon_Profile",
        category: "Profile",
        email: user.email,
        customerId: user.customerId,
        firstName: user.firstName
      }
    });
  } catch (e) { console.warn(e); }
}

export function trackPageView(page: { category?: string; name?: string }) {
  const s = sdk();
  if (!s) return;
  s.sendEvent({
    interaction: {
      name: "Page View: " + (page.name || "Home"),
      eventType: "Chevignon_Engagement"
    },
    attributes: {
      category: "Engagement",
      prodCategory: page.category || "General"
    }
  });
}

/**
 * FIX PARA VERCEL BUILD:
 * Retorna un objeto vacío para que el spread (...payload) no falle.
 */
export async function fetchCampaign(campaignName: string): Promise<any> {
  const s = sdk();
  if (!s) return {};
  try {
    return await new Promise((resolve) => {
      s.getCampaign?.({ campaignName }, (payload: any) => {
        resolve(payload || {});
      });
      setTimeout(() => resolve({}), 1000);
    });
  } catch {
    return {};
  }
}
