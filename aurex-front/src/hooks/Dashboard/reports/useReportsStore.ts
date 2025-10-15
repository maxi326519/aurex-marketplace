import { create } from "zustand";
import { Report } from "../../../interfaces/Report";

interface ReportsState {
  reports: Report[];
  currentReport: Report | null;
  loading: boolean;
  setReports: (reports: Report[]) => void;
  setCurrentReport: (report: Report | null) => void;
  addReport: (report: Report) => void;
  updateReport: (report: Report) => void;
  removeReport: (reportId: string) => void;
  setLoading: (loading: boolean) => void;
  clearReports: () => void;
}

export const useReportsStore = create<ReportsState>((set) => ({
  reports: [],
  currentReport: null,
  loading: false,
  setReports: (reports) => set({ reports }),
  setCurrentReport: (report) => set({ currentReport: report }),
  addReport: (report) =>
    set((state) => ({
      reports: [...state.reports, report],
    })),
  updateReport: (report) =>
    set((state) => ({
      reports: state.reports.map((r) => (r.id === report.id ? report : r)),
    })),
  removeReport: (reportId) =>
    set((state) => ({
      reports: state.reports.filter((r) => r.id !== reportId),
    })),
  setLoading: (loading) => set({ loading }),
  clearReports: () => set({ reports: [], currentReport: null }),
}));
