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
 * ENGAGEMENT: Evento genérico de navegación
 */
export function trackPageView(page: { category?: string; name?: string }) {
  const s = sdk();
  if (!s) return;
  try {
    s.sendEvent({
      interaction: {
        name: "Page View: " + (page.name || "Home"),
        eventType: "Chevignon_Engagement",
        attributes: {
          category: "Engagement",
          prodCategory: page.category || "General"
        }
      }
    });
  } catch (e) { console.warn(e); }
}

/**
 * ENGAGEMENT: Vista de producto (PDP)
 */
export function trackProductView(p: Product) {
  const s = sdk();
  if (!s) return;
  try {
    s.sendEvent({
      interaction: {
        name: "View Product",
        eventType: "Chevignon_Engagement",
        attributes: {
          category: "Engagement",
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

/**
 * ENGAGEMENT: Agregar al carrito
 */
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
          sku: p.sku,
          productName: p.name,
          prodCategory: p.category,
          price: p.price * quantity,
          currency: p.currency,
          size: size || ""
        }
      }
    });
  } catch (e) { console.warn(e); }
}

/**
 * ENGAGEMENT: Compra finalizada
 */
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
          sku: orderId,
          price: totalValue,
          currency: "COP"
        }
      }
    });
  } catch (e) { console.warn(e); }
}

/**
 * PROFILE: Identidad del usuario (Login)
 */
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

/**
 * NECESARIO PARA EL BUILD: Función para campañas (HeroBanner)
 */
export async function fetchCampaign(campaignName: string): Promise<any | null> {
  const s = sdk();
  if (!s) return null;
  try {
    return await new Promise((resolve) => {
      s.getCampaign?.({ campaignName }, (payload: any) => resolve(payload));
      // Timeout de seguridad
      setTimeout(() => resolve(null), 1500);
    });
  } catch {
    return null;
  }
}
