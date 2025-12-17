import { create } from 'zustand';
import { User } from '@/types';
import { DateRange } from 'react-day-picker';
import { subDays } from 'date-fns';

interface GlobalState {
  user: User;
  selectedBranchId: string | 'all';
  dateRange: DateRange | undefined;
  
  setUser: (user: User) => void;
  setSelectedBranchId: (id: string | 'all') => void;
  setDateRange: (range: DateRange | undefined) => void;
  
  isSidebarOpen: boolean;
  toggleSidebar: () => void;
}

export const useStore = create<GlobalState>((set) => ({
  user: {
    id: "u-1",
    name: "Roberto Pandolfo",
    email: "roberto@pandolfo.com",
    role: "owner",
  },
  selectedBranchId: 'all',
  dateRange: {
    from: subDays(new Date(), 30),
    to: new Date(),
  },
  
  isSidebarOpen: true,
  
  setUser: (user) => set({ user }),
  setSelectedBranchId: (id) => set({ selectedBranchId: id }),
  setDateRange: (range) => set({ dateRange: range }),
  toggleSidebar: () => set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),
}));
