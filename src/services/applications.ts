import { sampleApplication } from "@/demo/sampleData";
import type { ApplicationData } from "@/features/apply/schema/application";
import { normalizeApplication } from "@/features/apply/schema/defaults";

/**
 * The seam between the website and wherever applications are stored.
 * Right now: this browser's localStorage (demo). Later: Firebase. Swap the
 * implementation at the bottom; nothing else in the app needs to change.
 */
export type ApplicationStatus = "new" | "in_review" | "contacted" | "hired" | "not_a_fit";

export const STATUS_LABELS: Record<ApplicationStatus, string> = {
  new: "New",
  in_review: "In review",
  contacted: "Contacted",
  hired: "Hired",
  not_a_fit: "Not a fit",
};

export interface StoredApplication {
  id: string;
  submittedAt: string;
  status: ApplicationStatus;
  data: ApplicationData;
}

export interface ApplicationService {
  submit(data: ApplicationData): Promise<StoredApplication>;
  list(): Promise<StoredApplication[]>;
  get(id: string): Promise<StoredApplication | undefined>;
  setStatus(id: string, status: ApplicationStatus): Promise<void>;
}

const KEY = "propel.demo.applications.v2";
const daysAgo = (days: number) => new Date(Date.now() - days * 86_400_000).toISOString();

function seedApplications(): StoredApplication[] {
  const accidentDate = daysAgo(500).slice(0, 10);
  return [
    { id: "PT-5A1C09D2", submittedAt: daysAgo(1), status: "new", data: sampleApplication() },
    {
      id: "PT-7B42E6F1",
      submittedAt: daysAgo(3),
      status: "in_review",
      data: sampleApplication({
        firstName: "Marcus",
        middleInitial: "A",
        lastName: "Delgado",
        position: "Company driver",
        email: "marcus.delgado@example.com",
        phone: "(479) 555-0188",
        city: "Dardanelle",
        zip: "72834",
        ssn: "987-65-4321",
        cdlYears: "14",
        printedName: "Marcus A Delgado",
        hasAccidents: "yes",
        accidents: [{ date: accidentDate, details: "Rear-ended at a stoplight. Not at fault. Minor property damage.", fatalities: "no", injuries: "no" }],
      }),
    },
    {
      id: "PT-C3D8A7B5",
      submittedAt: daysAgo(6),
      status: "contacted",
      data: sampleApplication({
        firstName: "Tasha",
        middleInitial: "",
        lastName: "Nguyen",
        position: "Company driver (open to other roles)",
        email: "tasha.nguyen@example.com",
        phone: "(479) 555-0123",
        city: "Atkins",
        zip: "72823",
        ssn: "555-12-3456",
        cdlYears: "5",
        printedName: "Tasha Nguyen",
      }),
    },
  ];
}

function read(): StoredApplication[] {
  const raw = localStorage.getItem(KEY);
  if (raw) return JSON.parse(raw) as StoredApplication[];
  const seeded = seedApplications();
  localStorage.setItem(KEY, JSON.stringify(seeded));
  return seeded;
}

const write = (list: StoredApplication[]) => localStorage.setItem(KEY, JSON.stringify(list));

const localApplications: ApplicationService = {
  async submit(data) {
    const record: StoredApplication = {
      id: `PT-${crypto.randomUUID().slice(0, 8).toUpperCase()}`,
      submittedAt: new Date().toISOString(),
      status: "new",
      data: normalizeApplication(data),
    };
    write([record, ...read()]);
    return record;
  },
  async list() {
    return read().sort((a, b) => b.submittedAt.localeCompare(a.submittedAt));
  },
  async get(id) {
    return read().find((a) => a.id === id);
  },
  async setStatus(id, status) {
    write(read().map((a) => (a.id === id ? { ...a, status } : a)));
  },
};

export const applicationService: ApplicationService = localApplications;
