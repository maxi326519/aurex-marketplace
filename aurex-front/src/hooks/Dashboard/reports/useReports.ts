import { useReportsStore } from "./useReportsStore";
import { useEffect } from "react";
import { Report } from "../../../interfaces/Report";
import axios from "axios";
import Swal from "sweetalert2";

export interface UseReports {
  reports: Report[];
  currentReport: Report | null;
  loading: boolean;
  createReport: (
    openReason: string,
    description: string,
    OrderId?: string,
    BusinessId?: string,
    ChatId?: string
  ) => Promise<Report>;
  getReports: (page?: number) => Promise<{ reports: Report[]; pagination: any }>;
  updateReport: (
    reportId: string,
    closeReason?: string,
    notes?: string,
    state?: "Abierto" | "Cerrado",
    AdminId?: string
  ) => Promise<Report>;
  deleteReport: (reportId: string) => Promise<void>;
  clearReports: () => void;
}

export default function useReports(): UseReports {
  const {
    reports,
    currentReport,
    loading,
    setReports,
    setCurrentReport,
    addReport,
    updateReport: updateReportStore,
    removeReport,
    setLoading,
    clearReports: clearReportsStore,
  } = useReportsStore();

  useEffect(() => {
    console.log("Reports:", reports);
    console.log("Current Report:", currentReport);
  }, [reports, currentReport]);

  // Report API functions
  const postReport = async (
    openReason: string,
    description: string,
    OrderId?: string,
    BusinessId?: string,
    ChatId?: string
  ): Promise<Report> => {
    const response = await axios.post("/reports", {
      openReason,
      description,
      OrderId,
      BusinessId,
      ChatId,
    });
    return response.data.report;
  };

  const getReportsAPI = async (
    page: number = 1
  ): Promise<{ reports: Report[]; pagination: any }> => {
    const response = await axios.get(`/reports?page=${page}&limit=10`);
    return response.data;
  };

  const updateReportAPI = async (
    reportId: string,
    closeReason?: string,
    notes?: string,
    state?: "Abierto" | "Cerrado",
    AdminId?: string
  ): Promise<Report> => {
    const response = await axios.patch(`/reports/${reportId}`, {
      closeReason,
      notes,
      state,
      AdminId,
    });
    return response.data.report;
  };

  const deleteReportAPI = async (reportId: string): Promise<void> => {
    await axios.patch(`/reports/delete/${reportId}`);
  };

  // Report operations
  async function createReport(
    openReason: string,
    description: string,
    OrderId?: string,
    BusinessId?: string,
    ChatId?: string
  ): Promise<Report> {
    try {
      setLoading(true);
      const newReport = await postReport(
        openReason,
        description,
        OrderId,
        BusinessId,
        ChatId
      );
      addReport(newReport);
      Swal.fire("Reporte Creado", "Reporte creado exitosamente", "success");
      return newReport;
    } catch (error) {
      console.error(error);
      Swal.fire(
        "Error",
        "Error al crear el reporte, intenta más tarde",
        "error"
      );
      throw error;
    } finally {
      setLoading(false);
    }
  }

  async function getReports(
    page: number = 1
  ): Promise<{ reports: Report[]; pagination: any }> {
    try {
      setLoading(true);
      const { reports: newReports, pagination } = await getReportsAPI(page);

      if (page === 1) {
        setReports(newReports);
      } else {
        setReports([...reports, ...newReports]);
      }

      return { reports: newReports, pagination };
    } catch (error) {
      console.error(error);
      Swal.fire(
        "Error",
        "Error al obtener los reportes, intenta más tarde",
        "error"
      );
      throw error;
    } finally {
      setLoading(false);
    }
  }

  async function updateReport(
    reportId: string,
    closeReason?: string,
    notes?: string,
    state?: "Abierto" | "Cerrado",
    AdminId?: string
  ): Promise<Report> {
    try {
      setLoading(true);
      const updatedReport = await updateReportAPI(
        reportId,
        closeReason,
        notes,
        state,
        AdminId
      );
      updateReportStore(updatedReport);
      Swal.fire("Reporte Actualizado", "Reporte actualizado exitosamente", "success");
      return updatedReport;
    } catch (error) {
      console.error(error);
      Swal.fire(
        "Error",
        "Error al actualizar el reporte, intenta más tarde",
        "error"
      );
      throw error;
    } finally {
      setLoading(false);
    }
  }

  async function deleteReport(reportId: string): Promise<void> {
    try {
      setLoading(true);
      await deleteReportAPI(reportId);
      removeReport(reportId);
      Swal.fire("Reporte Eliminado", "Reporte eliminado exitosamente", "success");
    } catch (error) {
      console.error(error);
      Swal.fire(
        "Error",
        "Error al eliminar el reporte, intenta más tarde",
        "error"
      );
      throw error;
    } finally {
      setLoading(false);
    }
  }

  function clearReports(): void {
    clearReportsStore();
  }

  return {
    reports,
    currentReport,
    loading,
    createReport,
    getReports,
    updateReport,
    deleteReport,
    clearReports,
  };
}
