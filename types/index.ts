export type UserRole = 'owner' | 'manager' | 'seller';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  branchId?: string; // If manager or seller
}

export interface Territory {
  id: string;
  name: string;
  description?: string;
  cities: string[];
}

export interface Branch {
  id: string;
  name: string;
  city: string;
  territoryId: string;
  active: boolean;
  sellersCount: number;
}

export interface Seller {
  id: string;
  name: string;
  branchId: string;
  active: boolean;
  avatarUrl?: string;
  monthlyGoal?: number;
}

export type LeadStatus = 'Nuevo' | 'Contactado' | 'Calificado' | 'Convertido' | 'Perdido';
export type OpportunityStatus = 'Nuevo' | 'Calificado' | 'Presupuesto solicitado' | 'En negociación' | 'Ganado' | 'Perdido';
export type OpportunityCategory = 'Residencial' | 'Comercial' | 'Corporativo' | 'Otro';
export type BudgetRange = 'Bajo' | 'Medio' | 'Alto';
export type ClientType = 'Persona Física' | 'Persona Jurídica' | 'Arquitecto/Socio';

export interface Lead {
  id: string;
  name: string;
  phone: string;
  origin: string;
  type: ClientType;
  workLocation?: string;
  deadline?: string;
  category: OpportunityCategory;
  budgetRange: BudgetRange;
  branchId: string;
  sellerId: string;
  createdAt: string;
  convertedAt?: string;
}

export interface Client {
  id: string;
  name: string;
  phone: string;
  email?: string;
  type: ClientType;
  branchId: string;
  sellerId: string;
  createdAt: string;
  opportunitiesCount: number;
  totalWonValue: number;
}

export interface Opportunity {
  id: string;
  title: string;
  clientId?: string;
  leadId?: string;
  branchId: string;
  sellerId: string;
  funnelStatus: OpportunityStatus;
  category: OpportunityCategory;
  budgetRange: BudgetRange;
  estimatedValue?: number;
  finalValue?: number;
  lossReason?: string;
  createdAt: string;
  closedAt?: string;
}

export interface DashboardStats {
  leadsPeriod: number;
  openOpportunities: number;
  conversionRate: number;
  avgTicket: number;
  avgCycleDays: number;
}
