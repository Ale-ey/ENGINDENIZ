import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const response = await fetch("https://formsubmit.co/ajax/lawfirm@engin-deniz.com", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
        Origin: "https://engin-deniz.com",
        Referer: "https://engin-deniz.com/contact",
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();

    if (response.ok || data.success === "true" || data.message?.includes("Activation")) {
      return NextResponse.json({ success: true, message: data.message });
    } else {
      console.error("FormSubmit Error:", data);
      return NextResponse.json({ success: false, error: "Failed to send to FormSubmit" }, { status: 400 });
    }
  } catch (error) {
    console.error("API Route Error:", error);
    return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 });
  }
}
