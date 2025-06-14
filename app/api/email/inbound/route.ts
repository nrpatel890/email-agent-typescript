import { NextRequest } from "next/server";
import { simpleParser } from "mailparser";
import { addInboundEmail, listInboundEmails } from "../../../../store";
import { Buffer } from "buffer";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const rawFile = formData.get("email") as File | null; // SendGrid sends field named "email"
    if (!rawFile) {
      return new Response("Missing email field", { status: 400 });
    }

    const buffer = Buffer.from(await rawFile.arrayBuffer());
    const parsed = await simpleParser(buffer);

    const record = addInboundEmail({
      from: parsed.from?.value[0]?.address || "",
      fromName: parsed.from?.value[0]?.name || "",
      subject: parsed.subject || "(no subject)",
      text: parsed.text || "",
      html: parsed.html || undefined,
      receivedAt: parsed.date || new Date(),
    });

    return new Response(JSON.stringify({ id: record.id }), {
      status: 201,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("Inbound email parse error", err);
    return new Response("Server error", { status: 500 });
  }
}

export async function GET() {
  const emails = listInboundEmails();
  return new Response(JSON.stringify(emails), {
    headers: { "Content-Type": "application/json" },
  });
} 