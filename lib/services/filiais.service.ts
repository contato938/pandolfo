import { MOCK_BRANCHES } from "@/lib/data";
import { Branch } from "@/types";

const DELAY = 500;

export const filiaisService = {
  list: async (): Promise<Branch[]> => {
    return new Promise((resolve) => setTimeout(() => resolve(MOCK_BRANCHES), DELAY));
  },

  getById: async (id: string): Promise<Branch | undefined> => {
    return new Promise((resolve) => 
      setTimeout(() => resolve(MOCK_BRANCHES.find(b => b.id === id)), DELAY)
    );
  },

  create: async (data: Omit<Branch, "id">): Promise<Branch> => {
    // In a real app we would push to MOCK_BRANCHES but for read-only mocks usually we just return mock
    // User requested "simulando fetch... create".
    const newBranch = { ...data, id: Math.random().toString() };
    return new Promise((resolve) => setTimeout(() => resolve(newBranch), DELAY));
  }
};
