import { clients } from "@/lib/data";
import { Client } from "@/types";

const DELAY = 600;

export const clientesService = {
  list: async (filters?: { search?: string, branchId?: string, sellerId?: string }): Promise<Client[]> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        let data = clients;
        if (filters?.branchId) data = data.filter(c => c.branchId === filters.branchId);
        if (filters?.sellerId) data = data.filter(c => c.sellerId === filters.sellerId);
        if (filters?.search) {
          const lower = filters.search.toLowerCase();
          data = data.filter(c => c.name.toLowerCase().includes(lower) || c.phone.includes(lower));
        }
        resolve(data);
      }, DELAY);
    });
  },

  getById: async (id: string): Promise<Client | undefined> => {
    return new Promise((resolve) => 
      setTimeout(() => resolve(clients.find(c => c.id === id)), DELAY)
    );
  },

  create: async (client: Omit<Client, "id">): Promise<Client> => {
    const newClient = { ...client, id: Math.random().toString() };
    clients.unshift(newClient); // Mutate mock
    return new Promise((resolve) => setTimeout(() => resolve(newClient), DELAY));
  }
};
