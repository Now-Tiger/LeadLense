export interface Lead {
  id: number;
  name: string;
  role: string;
  company: string;
  industry: string;
  location: string;
  linkedin_bio: string;
  intent?: string | null; // High / Medium / Low
  score?: number | null; // 0 - 100
  reasoning?: string | null; // explanation
  createdAt: Date;
}
