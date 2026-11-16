import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase/admin";
import { ConsentRecordSchema } from "@/types/database";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validation = ConsentRecordSchema.omit({ id: true, timestamp: true }).safeParse(body);
    
    if (!validation.success) {
      return NextResponse.json({ error: "Invalid consent payload" }, { status: 400 });
    }

    const record = {
      ...validation.data,
      id: `consent-${Date.now()}`,
      country: request.headers.get("x-vercel-ip-country") || "GLOBAL",
      timestamp: new Date().toISOString(),
    };

    if (adminDb) {
      try {
        await adminDb.collection("consent_records").doc(record.id).set(record);
      } catch (e) {
        console.warn("Firestore consent log error:", e);
      }
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
