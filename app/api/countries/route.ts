// /app/api/countries/route.ts

import { NextResponse } from "next/server";

export async function GET() {
  try {
    console.log("[v0] Fetching countries from REST Countries API");

    // --- PERBAIKAN DI SINI ---
    // Tambahkan 'latlng' ke dalam daftar fields
    const fields =
      "name,flags,region,capital,population,cca3,latlng,lang,currency";
    // ----------------------------

    const response = await fetch(
      `https://restcountries.com/v3.1/all?fields=${fields}`,
      {
        method: "GET",
        headers: {
          Accept: "application/json",
        },
        next: { revalidate: 3600 },
      }
    );

    if (!response.ok) {
      console.log("[v0] REST Countries API returned status:", response.status);
      const errorBody = await response.json();
      throw new Error(`API returned ${response.status}: ${errorBody.message}`);
    }

    const data = await response.json();
    console.log("[v0] Successfully fetched", data.length, "countries");

    return NextResponse.json(data);
  } catch (error) {
    console.error("[v0] Error fetching countries:", error);
    return NextResponse.json(
      { error: "Failed to fetch countries data" },
      { status: 500 }
    );
  }
}
