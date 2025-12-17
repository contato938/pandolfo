import { opportunities } from "@/lib/data";
import { Opportunity } from "@/types";

const DELAY = 700;

export const oportunidadesService = {
  list: async (filters?: { 
    branchId?: string, 
    sellerId?: string, 
    status?: string, 
    period?: [string, string]
  }): Promise<Opportunity[]> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        let data = opportunities;
        if (filters?.branchId && filters.branchId !== 'all') data = data.filter(o => o.branchId === filters.branchId);
        if (filters?.sellerId && filters.sellerId !== 'all') data = data.filter(o => o.sellerId === filters.sellerId);
        if (filters?.status) data = data.filter(o => o.funnelStatus === filters.status);
        
        // Simulating period filter (simple check on createdAt)
        if (filters?.period) {
          const [start, end] = filters.period;
          data = data.filter(o => o.createdAt >= start && o.createdAt <= end);
        }
        
        resolve(data);
      }, DELAY);
    });
  },

  getById: async (id: string): Promise<Opportunity | undefined> => {
    return new Promise((resolve) => 
      setTimeout(() => resolve(opportunities.find(o => o.id === id)), DELAY)
    );
  },

  create: async (payload: Omit<Opportunity, "id" | "createdAt">): Promise<Opportunity> => {
    const newItem = { 
      ...payload, 
      id: Math.random().toString(), 
      createdAt: new Date().toISOString() 
    };
    opportunities.unshift(newItem);
    return new Promise((resolve) => setTimeout(() => resolve(newItem), DELAY));
  },

  update: async (id: string, payload: Partial<Opportunity>): Promise<Opportunity | null> => {
    const index = opportunities.findIndex(o => o.id === id);
    if (index === -1) return null;
    
    opportunities[index] = { ...opportunities[index], ...payload };
    return new Promise((resolve) => setTimeout(() => resolve(opportunities[index]), DELAY));
  }
};
