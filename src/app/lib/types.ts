export interface Client {
  id: number;
  company_name: string;
  legal_info?: string;
  email: string;
  password: string;
  status: 'active' | 'inactive' | 'pending_payment';
  created_at: Date;
  updated_at: Date;
}

export interface AccountType {
  id: number;
  name: string;
  price: number;
  duration_days: number;
  max_domains: number;
  features?: Record<string, any>;
  created_at: Date;
  updated_at: Date;
}

export interface Subscription {
  id: number;
  client_id: number;
  account_type_id: number;
  start_date: Date;
  end_date: Date | null;
  status: 'active' | 'expired' | 'cancelled' | 'pending_payment';
  payment_method?: string;
  payment_reference?: string;
  created_at: Date;
  updated_at: Date;
}

export interface Domain {
  id: number;
  description: string;
  client_id: number;
  name: string;
  created_at: Date;
  updated_at: Date;
}

export interface Participant {
  id: number;
  domain_id: number;
  name: string;
  email: string;
  poste?: string;
  created_at: Date;
  updated_at: Date;
}

export interface Template {
  id: number;
  domain_id: number;
  name: string;
  content?: Record<string, any>;
  preview_image?: string;
  created_at: Date;
  updated_at: Date;
}

export interface TemplateFile {
  id: number;
  template_id: number;
  name: string;
  url: string;
  file_type?: string;
  size_bytes?: number;
  created_at: Date;
  updated_at: Date;
}

export interface AppVersion {
  id: number;
  os: string;
  version: string;
  size: string;            // ex: '156 MB' ou '1.2 GB'
  cpu_requirement: string; // ex: 'Intel Core i3 ou AMD équivalent'
  ram_requirement: string; // ex: '4 GB RAM minimum, 8 GB recommandé'
  storage_requirement: string; // ex: '500 MB d'espace libre'
  download_link: string;
  created_at?: Date;
  updated_at?: Date;
}

export function formatSize(bytes: number): string {
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + " KB";
  if (bytes < 1024 * 1024 * 1024) return (bytes / (1024 * 1024)).toFixed(2) + " MB";
  return (bytes / (1024 * 1024 * 1024)).toFixed(2) + " GB";
}
