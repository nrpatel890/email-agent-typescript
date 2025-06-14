import { NextRequest } from "next/server";
import { findInboundEmail, addDraftEmail } from "../../../../../store";
import { draftReplyEmail } from "../../../../../replyAgent";
import { LeadData } from "../../../../../eagent";

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const inbound = findInboundEmail(params.id);
  if (!inbound) {
    return new Response("Inbound email not found", { status: 404 });
  }

  const lead: LeadData = {
    name: inbound.fromName,
    email: inbound.from,
    aiSummary: undefined, // could be enhanced later with conversation summary
  };

  const body = await draftReplyEmail({ lead, inboundText: inbound.text });

  const draft = addDraftEmail({
    inboundId: inbound.id,
    to: inbound.from,
    subject: `Re: ${inbound.subject}`,
    text: body,
    html: body.replace(/\n/g, "<br/>")
  });

  return new Response(JSON.stringify(draft), {
    status: 201,
    headers: { "Content-Type": "application/json" },
  });
} 