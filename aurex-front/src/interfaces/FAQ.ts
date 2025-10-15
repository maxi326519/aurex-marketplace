export interface Answer {
  id: string;
  text: string;
  action: "next" | "solution" | "report";
  nextQuestionId?: string;
  solution?: string;
}

export interface FAQItem {
  id: string;
  question: string;
  answers: Answer[];
}
