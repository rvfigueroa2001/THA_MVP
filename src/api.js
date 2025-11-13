const API_URL = import.meta.env.VITE_API_URL;

export async function findHousing({ household_income, household_size }) {
  const res = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ household_income, household_size }),
  });

  // Optional: surface non-2xx as errors with more context
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`API ${res.status}: ${text || "Request failed"}`);
  }

  // HTTP API returns Lambda body directly as JSON
  return res.json();
}
