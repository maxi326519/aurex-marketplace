import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { FAQItem, Answer } from "../../../interfaces/FAQ";
import { faqData } from "../../../data/mock/faqData";
import useReports from "../../../hooks/Dashboard/reports/useReports";
import Swal from "sweetalert2";

import DashboardLayout from "../../../components/Dashboard/ClientDashboard";
import QuestionCard from "../../../components/Dashboard/Reports/QuestionCard";
import SolutionCard from "../../../components/Dashboard/Reports/SolutionCard";
import ReportForm from "../../../components/Dashboard/Reports/ReportForm";
import Breadcrumb from "../../../components/ui/Breadcrumb";
import Steps from "../../../components/ui/Steps";

type FlowState = "question" | "solution" | "report" | "success";

export default function ReportePage() {
  const { orderId } = useParams<{ orderId: string }>();
  const navigate = useNavigate();
  const { createReport, loading } = useReports();

  const [currentFlowState, setCurrentFlowState] = useState<FlowState>(
    "question"
  );
  const [currentQuestionId, setCurrentQuestionId] = useState<string>("1");
  const [questionHistory, setQuestionHistory] = useState<string[]>([]);
  const [currentSolution, setCurrentSolution] = useState<string>("");

  // Definir los pasos del proceso
  const steps = [
    { id: "question", label: "Preguntas", number: 1 },
    { id: "solution", label: "Solución", number: 2 },
    { id: "report", label: "Reporte", number: 3 },
  ];

  // Definir los elementos del breadcrumb
  const breadcrumbItems = [
    {
      label: "Compras",
      onClick: () => navigate("/panel/compras"),
    },
    {
      label: "Reportar problema",
    },
  ];

  const currentQuestion = faqData.find(
    (q: FAQItem) => q.id === currentQuestionId
  );

  useEffect(() => {
    if (!orderId) {
      navigate("/panel/compras");
    }
  }, [orderId, navigate]);

  const handleAnswerClick = (answer: Answer) => {
    if (answer.action === "next" && answer.nextQuestionId) {
      setQuestionHistory((prev) => [...prev, currentQuestionId]);
      setCurrentQuestionId(answer.nextQuestionId);
    } else if (answer.action === "solution" && answer.solution) {
      setCurrentSolution(answer.solution);
      setCurrentFlowState("solution");
    } else if (answer.action === "report") {
      setCurrentFlowState("report");
    }
  };

  const handleBackClick = () => {
    if (questionHistory.length > 0) {
      const previousQuestionId = questionHistory[questionHistory.length - 1];
      setQuestionHistory((prev) => prev.slice(0, -1));
      setCurrentQuestionId(previousQuestionId);
      setCurrentFlowState("question");
    }
  };

  const handleSolutionHelpful = (helpful: boolean) => {
    if (helpful) {
      Swal.fire({
        title: "¡Excelente!",
        text: "Nos alegra saber que pudimos ayudarte a resolver tu problema.",
        icon: "success",
        confirmButtonText: "Continuar",
      }).then(() => {
        navigate("/panel/compras");
      });
    } else {
      Swal.fire({
        title: "¿Necesitas más ayuda?",
        text:
          "Puedes crear un reporte para que nuestro equipo revise tu caso personalmente.",
        icon: "question",
        showCancelButton: true,
        confirmButtonText: "Crear reporte",
        cancelButtonText: "Volver a compras",
      }).then((result) => {
        if (result.isConfirmed) {
          setCurrentFlowState("report");
        } else {
          navigate("/panel/compras");
        }
      });
    }
  };

  const handleCreateReport = async (
    openReason: string,
    description: string
  ) => {
    try {
      await createReport(openReason, description, orderId);

      Swal.fire({
        title: "Reporte enviado",
        text:
          "Tu reporte ha sido enviado exitosamente. Nuestro equipo lo revisará y te contactará pronto.",
        icon: "success",
        confirmButtonText: "Continuar",
      }).then(() => {
        navigate("/panel/compras");
      });
    } catch (error) {
      console.error("Error creating report:", error);
      Swal.fire({
        title: "Error",
        text:
          "Hubo un problema al enviar tu reporte. Por favor intenta nuevamente.",
        icon: "error",
        confirmButtonText: "Entendido",
      });
    }
  };

  return (
    <DashboardLayout title={`Reportar problema - Pedido #${orderId}`}>
      <div className="max-w-4xl mx-auto">
        {/* Breadcrumb */}
        <Breadcrumb items={breadcrumbItems} />

        {/* Progress indicator */}
        <Steps steps={steps} currentStepId={currentFlowState} />

        {/* Main content */}
        <div className="min-h-[400px] flex items-center justify-center">
          {currentFlowState === "question" ? (
            currentQuestion ? (
              <QuestionCard
                question={currentQuestion}
                onAnswerClick={handleAnswerClick}
                onBackClick={
                  questionHistory.length > 0 ? handleBackClick : undefined
                }
                hasHistory={questionHistory.length > 0}
              />
            ) : null
          ) : currentFlowState === "solution" ? (
            <SolutionCard
              solution={currentSolution}
              onSolutionHelpful={handleSolutionHelpful}
              onBackClick={
                questionHistory.length > 0 ? handleBackClick : undefined
              }
              hasHistory={questionHistory.length > 0}
            />
          ) : currentFlowState === "report" ? (
            <ReportForm
              onSubmit={handleCreateReport}
              onBackClick={
                questionHistory.length > 0 ? handleBackClick : undefined
              }
              hasHistory={questionHistory.length > 0}
              loading={loading}
            />
          ) : null}
        </div>
      </div>
    </DashboardLayout>
  );
}
