import OpenAI from "openai";
import { LeadData } from "./eagent";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

export interface DraftReplyParams {
  lead: LeadData;
  inboundText: string; // the raw text body of the lead's most recent email
}

/**
 * Generates a reply email to the lead based on their latest message plus an overall AI summary of the conversation.
 * Returns only the email body text (no subject line, no labels).
 */
export async function draftReplyEmail({ lead, inboundText }: DraftReplyParams): Promise<string> {
  const systemPrompt = `
You are Ava, the AI leasing assistant. Craft a concise, friendly email *to* the lead on behalf of the property manager.
Respond ONLY with the email text (no subject line, no commentary).

Instructions:
1. If lead.name is provided, start with "Hi [Lead Name],". Otherwise start with "Hello,".
2. Briefly acknowledge or address the content of *inboundText*.
3. Use lead.aiSummary (if present) to guide context and next steps.
4. Clearly state the next recommended action (tour scheduling, application, answering questions, etc.).
5. End with a signature placeholder on its own line:
   — [Manager Name]
`;

  const userPrompt = `
Lead JSON:
\u200B\u200B${JSON.stringify(lead, null, 2)}

Latest email *from the lead*:
"""
${inboundText}
"""

Draft the reply now.
`;

  const response = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages: [
      { role: "system", content: systemPrompt.trim() },
      { role: "user", content: userPrompt.trim() },
    ],
    temperature: 0.7,
    max_tokens: 350,
  });

  return response.choices[0].message!.content.trim();
} 