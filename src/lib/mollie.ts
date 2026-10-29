/**
 * Minimale Mollie-koppeling (Payments API v2) zonder extra pakket.
 * Sleutel: MOLLIE_API_KEY (test_… of live_…). Zonder sleutel is Mollie uitgeschakeld.
 */
const API = "https://api.mollie.com/v2";

export const mollieEnabled = () => Boolean(process.env.MOLLIE_API_KEY);

async function call<T>(path: string, init: RequestInit = {}): Promise<T> {
  const res = await fetch(API + path, {
    ...init,
    headers: { Authorization: `Bearer ${process.env.MOLLIE_API_KEY}`, "Content-Type": "application/json", ...(init.headers || {}) },
  });
  const json = (await res.json()) as T & { detail?: string; title?: string };
  if (!res.ok) throw new Error(`Mollie ${res.status}: ${json.title ?? ""} ${json.detail ?? ""}`.trim());
  return json;
}

export interface MolliePayment {
  id: string;
  status: "open" | "canceled" | "pending" | "authorized" | "expired" | "failed" | "paid";
  amount: { currency: string; value: string };
  description: string;
  metadata: Record<string, string> | null;
  paidAt?: string;
  _links: { checkout?: { href: string } };
}

export async function createPayment(input: {
  amount: string; // "697.50"
  description: string;
  redirectUrl: string;
  webhookUrl: string;
  metadata: Record<string, string>;
}) {
  const payment = await call<MolliePayment>("/payments", {
    method: "POST",
    body: JSON.stringify({
      amount: { currency: "EUR", value: input.amount },
      description: input.description,
      redirectUrl: input.redirectUrl,
      webhookUrl: input.webhookUrl,
      metadata: input.metadata,
      locale: "nl_NL",
    }),
  });
  // Zet het betaal-id in de terugkeer-URL, zodat de bedankt-pagina de status kan tonen
  const redirectWithId = `${input.redirectUrl}${input.redirectUrl.includes("?") ? "&" : "?"}id=${payment.id}`;
  await call(`/payments/${payment.id}`, { method: "PATCH", body: JSON.stringify({ redirectUrl: redirectWithId }) });
  return payment;
}

export const getPayment = (id: string) => call<MolliePayment>(`/payments/${encodeURIComponent(id)}`);

/** Zet "697.50" om in "€ 697,50" */
export const euro = (value: string) => "€ " + Number(value).toLocaleString("nl-NL", { minimumFractionDigits: 2 });
