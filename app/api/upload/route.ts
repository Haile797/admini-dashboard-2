// app/api/upload/route.ts
import { put } from "@vercel/blob";
import { NextResponse } from "next/server";

// Tắt body parser tự động của Next.js (bắt buộc cho upload file)
export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 30;

// Bắt buộc phải có dòng này để Next.js KHÔNG parse body → mới nhận được file
export const POST = async (req: Request) => {
  const form = await req.formData();
  const file = form.get("file") as File;
  
  if (!file) {
    return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
  }

  const { url } = await put(`products/${Date.now()}-${file.name}`, file, {
    access: "public",
  });

  return NextResponse.json({ url });
};