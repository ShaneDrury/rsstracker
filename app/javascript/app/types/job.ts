export interface ApiJob {
  id: number;
  priority: number;
  attempts: number;
  last_error: string | null;
  run_at: string;
  created_at: string;
  updated_at: string;
}

export interface RemoteJob extends ApiJob {
  key: string;
}
