import { FAQItem } from "../../interfaces/FAQ";

export const faqData: FAQItem[] = [
  {
    id: "1",
    question: "¿Cuál es el problema con tu pedido?",
    answers: [
      {
        id: "a1",
        text: "El producto llegó dañado",
        action: "next",
        nextQuestionId: "2"
      },
      {
        id: "a2",
        text: "El producto no llegó",
        action: "next",
        nextQuestionId: "3"
      },
      {
        id: "a3",
        text: "El producto no coincide con la descripción",
        action: "next",
        nextQuestionId: "4"
      },
      {
        id: "a4",
        text: "Problemas con el vendedor",
        action: "next",
        nextQuestionId: "5"
      },
      {
        id: "a5",
        text: "Otro problema",
        action: "report"
      }
    ]
  },
  {
    id: "2",
    question: "¿Qué tipo de daño tiene el producto?",
    answers: [
      {
        id: "b1",
        text: "Daño físico (rayones, golpes, etc.)",
        action: "solution",
        solution: "Te recomendamos contactar al vendedor para solicitar un reemplazo o reembolso. Toma fotos del daño como evidencia."
      },
      {
        id: "b2",
        text: "Producto defectuoso (no funciona)",
        action: "solution",
        solution: "Contacta al vendedor para solicitar garantía. Si el producto tiene garantía del fabricante, también puedes contactarlos directamente."
      },
      {
        id: "b3",
        text: "Embalaje dañado pero producto intacto",
        action: "solution",
        solution: "Si el producto está en buen estado, puedes conservarlo. Si tienes dudas sobre su funcionamiento, contáctanos."
      }
    ]
  },
  {
    id: "3",
    question: "¿Cuánto tiempo ha pasado desde la fecha de entrega estimada?",
    answers: [
      {
        id: "c1",
        text: "Menos de 3 días",
        action: "solution",
        solution: "Es normal que haya retrasos menores. Te recomendamos esperar 2-3 días más antes de contactar al vendedor."
      },
      {
        id: "c2",
        text: "Entre 3-7 días",
        action: "solution",
        solution: "Contacta al vendedor para verificar el estado del envío. Puede haber retrasos en el transporte."
      },
      {
        id: "c3",
        text: "Más de 7 días",
        action: "solution",
        solution: "Contacta inmediatamente al vendedor. Si no obtienes respuesta en 24 horas, puedes crear un reporte."
      }
    ]
  },
  {
    id: "4",
    question: "¿En qué aspecto no coincide el producto?",
    answers: [
      {
        id: "d1",
        text: "Color diferente",
        action: "solution",
        solution: "Contacta al vendedor para solicitar el cambio por el color correcto o un reembolso si prefieres."
      },
      {
        id: "d2",
        text: "Tamaño diferente",
        action: "solution",
        solution: "Contacta al vendedor para solicitar el cambio por el tamaño correcto. Verifica las medidas antes de pedir el cambio."
      },
      {
        id: "d3",
        text: "Modelo diferente",
        action: "solution",
        solution: "Esto es un error grave. Contacta inmediatamente al vendedor para solicitar el producto correcto o reembolso completo."
      },
      {
        id: "d4",
        text: "Calidad inferior a la descrita",
        action: "solution",
        solution: "Contacta al vendedor con fotos del producto. Puedes solicitar un reembolso parcial o completo según el caso."
      }
    ]
  },
  {
    id: "5",
    question: "¿Qué tipo de problema tienes con el vendedor?",
    answers: [
      {
        id: "e1",
        text: "No responde mis mensajes",
        action: "solution",
        solution: "Espera 24-48 horas para una respuesta. Si no obtienes respuesta, puedes crear un reporte para que intervengamos."
      },
      {
        id: "e2",
        text: "Actitud inapropiada",
        action: "solution",
        solution: "Documenta las conversaciones y crea un reporte inmediatamente. No toleramos comportamientos inapropiados."
      },
      {
        id: "e3",
        text: "Se niega a resolver el problema",
        action: "solution",
        solution: "Crea un reporte con todos los detalles. Nuestro equipo revisará el caso y tomará las medidas necesarias."
      }
    ]
  }
];
