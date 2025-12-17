import { leads } from "@/lib/data";
import { Lead } from "@/types";

const DELAY = 600;

export const leadsService = {
  list: async (filters?: { search?: string, branchId?: string, sellerId?: string }): Promise<Lead[]> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        let data = leads;
        if (filters?.branchId) data = data.filter(l => l.branchId === filters.branchId);
        if (filters?.sellerId) data = data.filter(l => l.sellerId === filters.sellerId);
        if (filters?.search) {
          const lower = filters.search.toLowerCase();
          data = data.filter(l => l.name.toLowerCase().includes(lower) || l.phone.includes(lower));
        }
        resolve(data);
      }, DELAY);
    });
  },

  getById: async (id: string): Promise<Lead | undefined> => {
    return new Promise((resolve) => 
      setTimeout(() => resolve(leads.find(l => l.id === id)), DELAY)
    );
  },

  create: async (payload: Omit<Lead, "id" | "createdAt">): Promise<Lead> => {
    const newLead = { 
      ...payload, 
      id: Math.random().toString(), 
      createdAt: new Date().toISOString() 
    };
    leads.unshift(newLead);
    return new Promise((resolve) => setTimeout(() => resolve(newLead), DELAY));
  }
};
