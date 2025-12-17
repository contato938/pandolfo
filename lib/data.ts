import { Branch, Client, Lead, Opportunity, Seller, Territory } from "@/types";

// Helper to generate dates
const subDays = (days: number) => {
  const d = new Date();
  d.setDate(d.getDate() - days);
  return d.toISOString();
};

export const MOCK_TERRITORIES: Territory[] = [
  { id: '1', name: 'Gran Asunción', cities: ['Asunción', 'Luque', 'San Lorenzo', 'Lambaré'] },
  { id: '2', name: 'Este', cities: ['Ciudad del Este', 'Hernandarias', 'Presidente Franco'] },
  { id: '3', name: 'Sur', cities: ['Encarnación', 'Pilar'] },
  { id: '4', name: 'Norte', cities: ['Pedro Juan Caballero', 'Concepción'] },
  { id: '5', name: 'Chaco', cities: ['Filadelfia', 'Loma Plata'] },
];

export const MOCK_BRANCHES: Branch[] = [
  { id: '1', name: 'Matriz Asunción', city: 'Asunción', territoryId: '1', active: true, sellersCount: 8 },
  { id: '2', name: 'Sucursal Luque', city: 'Luque', territoryId: '1', active: true, sellersCount: 4 },
  { id: '3', name: 'Sucursal San Lorenzo', city: 'San Lorenzo', territoryId: '1', active: true, sellersCount: 5 },
  { id: '4', name: 'Sucursal CDE Centro', city: 'Ciudad del Este', territoryId: '2', active: true, sellersCount: 6 },
  { id: '5', name: 'Sucursal CDE Km 7', city: 'Ciudad del Este', territoryId: '2', active: true, sellersCount: 3 },
  { id: '6', name: 'Sucursal Encarnación', city: 'Encarnación', territoryId: '3', active: true, sellersCount: 4 },
  { id: '7', name: 'Sucursal PJC', city: 'Pedro Juan Caballero', territoryId: '4', active: true, sellersCount: 3 },
  { id: '8', name: 'Sucursal Concepción', city: 'Concepción', territoryId: '4', active: true, sellersCount: 2 },
  { id: '9', name: 'Sucursal Chaco', city: 'Filadelfia', territoryId: '5', active: true, sellersCount: 2 },
  { id: '10', name: 'Sucursal Lambaré', city: 'Lambaré', territoryId: '1', active: true, sellersCount: 3 },
  { id: '11', name: 'Sucursal Villarrica', city: 'Villarrica', territoryId: '2', active: true, sellersCount: 2 },
  { id: '12', name: 'Sucursal Coronel Oviedo', city: 'Coronel Oviedo', territoryId: '2', active: true, sellersCount: 2 },
  { id: '13', name: 'Sucursal Hernandarias', city: 'Hernandarias', territoryId: '2', active: true, sellersCount: 2 },
  { id: '14', name: 'Sucursal Pilar', city: 'Pilar', territoryId: '3', active: true, sellersCount: 2 },
];

export const MOCK_SELLERS: Seller[] = MOCK_BRANCHES.flatMap((branch, i) => 
  Array.from({ length: branch.sellersCount }).map((_, j) => ({
    id: `s-${branch.id}-${j}`,
    name: `Vendedor ${j + 1} - ${branch.city}`,
    branchId: branch.id,
    active: true,
    monthlyGoal: 50000000 + Math.random() * 50000000, // Guarani volume
    avatarUrl: `/avatars/${(i + j) % 10}.png`
  }))
);

// Translating Status and Categories
const STATUS_FUNNEL = ['Nuevo', 'Calificado', 'Presupuesto solicitado', 'En negociación', 'Ganado', 'Perdido'] as const;
const CATEGORIES = ['Residencial', 'Comercial', 'Corporativo'] as const;

export const leads: Lead[] = Array.from({ length: 50 }).map((_, i) => ({
  id: `l-${i}`,
  name: `Prospecto ${i} González`,
  phone: `+595 981 ${100000 + i}`,
  origin: i % 2 === 0 ? 'Instagram' : 'Google',
  type: 'Persona Física',
  category: CATEGORIES[i % 3],
  budgetRange: i % 3 === 0 ? 'Alto' : 'Medio',
  branchId: MOCK_BRANCHES[i % MOCK_BRANCHES.length].id,
  sellerId: MOCK_SELLERS[i % MOCK_SELLERS.length].id,
  createdAt: subDays(Math.floor(Math.random() * 30)),
}));

export const clients: Client[] = Array.from({ length: 30 }).map((_, i) => ({
  id: `c-${i}`,
  name: `Cliente ${i} Benítez`,
  phone: `+595 971 ${200000 + i}`,
  email: `cliente${i}@email.com.py`,
  type: 'Persona Física',
  branchId: MOCK_BRANCHES[i % MOCK_BRANCHES.length].id,
  sellerId: MOCK_SELLERS[i % MOCK_SELLERS.length].id,
  createdAt: subDays(Math.floor(Math.random() * 90)),
  opportunitiesCount: Math.floor(Math.random() * 3) + 1,
  totalWonValue: Math.floor(Math.random() * 100000000),
}));

export const opportunities: Opportunity[] = Array.from({ length: 100 }).map((_, i) => {
  const status = STATUS_FUNNEL[Math.floor(Math.random() * STATUS_FUNNEL.length)];
  const isLost = status === 'Perdido';
  const isWon = status === 'Ganado';
  // Values in Guaranies (approx 1 USD = 7500 PYG)
  const estim = 5000000 + Math.random() * 80000000;
  
  return {
    id: `o-${i}`,
    title: `Proyecto ${i} - ${CATEGORIES[i % 3]}`,
    clientId: i % 3 === 0 ? `c-${i % 30}` : undefined,
    leadId: i % 3 !== 0 ? `l-${i % 50}` : undefined,
    branchId: MOCK_BRANCHES[i % MOCK_BRANCHES.length].id,
    sellerId: MOCK_SELLERS[i % MOCK_SELLERS.length].id,
    funnelStatus: status,
    category: CATEGORIES[i % 3],
    budgetRange: i % 2 === 0 ? 'Medio' : 'Alto',
    estimatedValue: estim,
    finalValue: isWon ? estim * 0.95 : undefined,
    lossReason: isLost ? 'Precio' : undefined,
    createdAt: subDays(Math.floor(Math.random() * 60)),
    closedAt: (isWon || isLost) ? subDays(Math.floor(Math.random() * 10)) : undefined,
  };
});
