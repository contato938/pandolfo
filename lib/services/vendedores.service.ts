import { MOCK_SELLERS } from "@/lib/data";
import { Seller } from "@/types";

const DELAY = 500;

export const vendedoresService = {
  list: async (filters?: { branchId?: string }): Promise<Seller[]> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        let data = MOCK_SELLERS;
        if (filters?.branchId) {
          data = data.filter(s => s.branchId === filters.branchId);
        }
        resolve(data);
      }, DELAY);
    });
  },

  getById: async (id: string): Promise<Seller | undefined> => {
    return new Promise((resolve) => 
      setTimeout(() => resolve(MOCK_SELLERS.find(s => s.id === id)), DELAY)
    );
  }
};
