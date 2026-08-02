"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type {
  Asset,
  Budget,
  Expense,
  ITTicket,
  IncomeRecord,
  Invoice,
  Lead,
} from "@/types/domain";
import { generateId } from "@/lib/utils";
import { WORKSPACES } from "@/lib/mock-data/workspaces";
import { USERS } from "@/lib/mock-data/users";
import { INITIAL_DATASETS, type WorkspaceDataset } from "@/lib/mock-data/seed";

interface WorkspaceStoreState {
  isAuthenticated: boolean;
  hasHydrated: boolean;
  activeWorkspaceId: string;
  currentUserId: string;
  datasets: Record<string, WorkspaceDataset>;

  login: (userId: string) => void;
  logout: () => void;
  switchWorkspace: (workspaceId: string) => void;
  switchUser: (userId: string) => void;

  addLead: (lead: Omit<Lead, "id" | "workspaceId">) => void;
  addInvoice: (invoice: Omit<Invoice, "id" | "workspaceId">) => void;
  addIncome: (income: Omit<IncomeRecord, "id" | "workspaceId">) => void;
  addExpense: (expense: Omit<Expense, "id" | "workspaceId">) => void;
  addBudget: (budget: Omit<Budget, "id" | "workspaceId">) => void;
  addAsset: (asset: Omit<Asset, "id" | "workspaceId">) => void;
  addITTicket: (ticket: Omit<ITTicket, "id" | "workspaceId">) => void;
}

export const useWorkspaceStore = create<WorkspaceStoreState>()(
  persist(
    (set, get) => ({
      isAuthenticated: false,
      hasHydrated: false,
      activeWorkspaceId: WORKSPACES[0].id,
      currentUserId: USERS[0].id,
      datasets: INITIAL_DATASETS,

      login: (userId) => {
        const user = USERS.find((u) => u.id === userId);
        if (!user) return;
        set({
          isAuthenticated: true,
          currentUserId: user.id,
          activeWorkspaceId: user.workspaceId,
        });
      },

      logout: () => set({ isAuthenticated: false }),

      switchWorkspace: (workspaceId) => {
        const fallbackUser = USERS.find((u) => u.workspaceId === workspaceId);
        set({
          activeWorkspaceId: workspaceId,
          currentUserId: fallbackUser?.id ?? get().currentUserId,
        });
      },

      switchUser: (userId) => {
        const user = USERS.find((u) => u.id === userId);
        if (!user) return;
        set({ currentUserId: user.id, activeWorkspaceId: user.workspaceId });
      },

      addLead: (lead) => {
        const workspaceId = get().activeWorkspaceId;
        set((state) => ({
          datasets: {
            ...state.datasets,
            [workspaceId]: {
              ...state.datasets[workspaceId],
              leads: [
                { ...lead, id: generateId("lead"), workspaceId },
                ...state.datasets[workspaceId].leads,
              ],
            },
          },
        }));
      },

      addInvoice: (invoice) => {
        const workspaceId = get().activeWorkspaceId;
        set((state) => ({
          datasets: {
            ...state.datasets,
            [workspaceId]: {
              ...state.datasets[workspaceId],
              invoices: [
                { ...invoice, id: generateId("inv"), workspaceId },
                ...state.datasets[workspaceId].invoices,
              ],
            },
          },
        }));
      },

      addIncome: (income) => {
        const workspaceId = get().activeWorkspaceId;
        set((state) => ({
          datasets: {
            ...state.datasets,
            [workspaceId]: {
              ...state.datasets[workspaceId],
              incomeRecords: [
                { ...income, id: generateId("inc"), workspaceId },
                ...state.datasets[workspaceId].incomeRecords,
              ],
            },
          },
        }));
      },

      addExpense: (expense) => {
        const workspaceId = get().activeWorkspaceId;
        set((state) => ({
          datasets: {
            ...state.datasets,
            [workspaceId]: {
              ...state.datasets[workspaceId],
              expenses: [
                { ...expense, id: generateId("exp"), workspaceId },
                ...state.datasets[workspaceId].expenses,
              ],
            },
          },
        }));
      },

      addBudget: (budget) => {
        const workspaceId = get().activeWorkspaceId;
        set((state) => ({
          datasets: {
            ...state.datasets,
            [workspaceId]: {
              ...state.datasets[workspaceId],
              budgets: [
                { ...budget, id: generateId("bud"), workspaceId },
                ...state.datasets[workspaceId].budgets,
              ],
            },
          },
        }));
      },

      addAsset: (asset) => {
        const workspaceId = get().activeWorkspaceId;
        set((state) => ({
          datasets: {
            ...state.datasets,
            [workspaceId]: {
              ...state.datasets[workspaceId],
              assets: [
                { ...asset, id: generateId("ast"), workspaceId },
                ...state.datasets[workspaceId].assets,
              ],
            },
          },
        }));
      },

      addITTicket: (ticket) => {
        const workspaceId = get().activeWorkspaceId;
        set((state) => ({
          datasets: {
            ...state.datasets,
            [workspaceId]: {
              ...state.datasets[workspaceId],
              itTickets: [
                { ...ticket, id: generateId("tkt"), workspaceId },
                ...state.datasets[workspaceId].itTickets,
              ],
            },
          },
        }));
      },
    }),
    {
      name: "ceo-dashboard-store",
      onRehydrateStorage: () => () => {
        useWorkspaceStore.setState({ hasHydrated: true });
      },
    }
  )
);
