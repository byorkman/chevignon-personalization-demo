// lib/personalization.ts
"use client";

import type { CartLine } from "./cart";
import type { Product } from "@/data/products";

declare global { interface Window { SalesforceInteractions?: any; } }

function sdk() {
  if (typeof window === "undefined") return null;
  return window.SalesforceInteractions || null;
}

/**
 * VISTA DE PRODUCTO
 */
export function trackProductView(p: Product) {
  const s = sdk();
  if (!s) return;
  console.log("🚀 Enviando Producto:", p.sku);
  
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
      price: Number(p.price),
      currency: "COP"
    }
  });
}

/**
 * AGREGAR AL CARRITO (Corregida para aceptar los 3 argumentos del componente)
 */
export function trackAddToCart(p: Product, quantity: number, size?: string) {
  const s = sdk();
  if (!s) return;
  console.log("🚀 Agregando al carrito:", p.sku, size);

  s.sendEvent({
    interaction: {
      name: "Add To Cart",
      eventType: "Chevignon_Engagement"
    },
    attributes: {
      category: "Engagement",
      interactionName: "Add To Cart",
      sku: String(p.sku),
      productName: String(p.name),
      price: Number(p.price * quantity),
      currency: "COP",
      size: size || ""
    }
  });
}

/**
 * ORDEN / COMPRA
 */
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
      interactionName: "Order Completed",
      sku: orderId,
      price: Number(totalValue),
      currency: "COP"
    }
  });
}

/**
 * IDENTIDAD (LOGIN)
 */
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

/**
 * NAVEGACION
 */
export function trackPageView(page: { category?: string; name?: string; url?: string }) {
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
 * CAMPAÑAS (DUMMY PARA BUILD)
 */
export async function fetchCampaign(campaignName: string): Promise<any> {
  const s = sdk();
  if (!s) return {};
  try {
    return await new Promise((resolve) => {
      s.getCampaign?.({ campaignName }, (payload: any) => resolve(payload || {}));
      setTimeout(() => resolve({}), 1000);
    });
  } catch {
    return {};
  }
}
