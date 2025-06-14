import { v4 as uuid } from "uuid";

export interface InboundEmail {
  id: string;
  from: string;
  fromName: string;
  subject: string;
  text: string;
  html?: string;
  receivedAt: Date;
}

export interface DraftEmail {
  id: string;
  inboundId?: string;
  to: string;
  subject: string;
  text: string;
  html?: string;
  status: "draft" | "sent";
  createdAt: Date;
}

// Simple in-memory arrays. Replace with a real DB in production.
const inboundEmails: InboundEmail[] = [];
const drafts: DraftEmail[] = [];

/* Inbound helpers */
export function addInboundEmail(email: Omit<InboundEmail, "id">): InboundEmail {
  const record: InboundEmail = { id: uuid(), ...email };
  inboundEmails.unshift(record); // newest first
  return record;
}

export function listInboundEmails(): InboundEmail[] {
  return inboundEmails;
}

export function findInboundEmail(id: string): InboundEmail | undefined {
  return inboundEmails.find((e) => e.id === id);
}

/* Draft helpers */
export function addDraftEmail(draft: Omit<DraftEmail, "id" | "status" | "createdAt">): DraftEmail {
  const record: DraftEmail = {
    id: uuid(),
    status: "draft",
    createdAt: new Date(),
    ...draft,
  };
  drafts.unshift(record);
  return record;
}

export function listDraftEmails(): DraftEmail[] {
  return drafts;
}

export function updateDraftStatus(id: string, status: DraftEmail["status"]): DraftEmail | undefined {
  const draft = drafts.find((d) => d.id === id);
  if (draft) draft.status = status;
  return draft;
} 