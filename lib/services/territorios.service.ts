import { MOCK_TERRITORIES } from "@/lib/data";
import { Territory } from "@/types";

const DELAY = 500;

export const territoriosService = {
  list: async (): Promise<Territory[]> => {
    return new Promise((resolve) => setTimeout(() => resolve(MOCK_TERRITORIES), DELAY));
  },
  
  getById: async (id: string): Promise<Territory | undefined> => {
    return new Promise((resolve) => 
      setTimeout(() => resolve(MOCK_TERRITORIES.find(t => t.id === id)), DELAY)
    );
  }
};
