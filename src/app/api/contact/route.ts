import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const contentType = request.headers.get("content-type") || "";
    
    // Check if it's a Fluent Forms submission (x-www-form-urlencoded)
    if (contentType.includes("application/x-www-form-urlencoded")) {
      const bodyText = await request.text();
      
      const response = await fetch("https://silvioh22.sg-host.com/wp-admin/admin-ajax.php", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          "Accept": "application/json",
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
          "Origin": "https://engin-deniz.com",
          "Referer": "https://engin-deniz.com/contact",
        },
        body: bodyText,
      });

      const data = await response.json();

      if (response.ok && (data.success || data.insert_id)) {
        return NextResponse.json({ success: true, ...data });
      } else {
        console.error("Fluent Forms Error:", data);
        return NextResponse.json({ success: false, error: data.errors || "Failed to submit form" }, { status: 400 });
      }
    }

    // Fallback for the old JSON FormSubmit.co method (just in case)
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
