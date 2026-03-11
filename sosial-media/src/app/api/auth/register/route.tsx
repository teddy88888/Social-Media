import { NextResponse } from "next/server";

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
    },
  });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Alamat backend Railway Anda yang asli (pastikan URL ini benar)
    const BACKEND_URL =
      "https://be-social-media-api-production.up.railway.app/api/auth/login";

    const res = await fetch(BACKEND_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    const data = await res.json();

    return NextResponse.json(data, {
      status: res.status,
      headers: { "Access-Control-Allow-Origin": "*" },
    });
  } catch (error) {
    return NextResponse.json(
      { message: "Gagal menyambung ke backend Railway" },
      { status: 500 },
    );
  }
}
