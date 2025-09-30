import { pdf } from "@react-pdf/renderer";
import { OrderManagement } from "../../interfaces/OrderManagement";

import ShippingTicketPDF from "./ShippingTicketPDF";

export function usePDF() {
  async function openShippingTicketPDF(order: OrderManagement) {
    // Generate PDF
    const blob = await pdf(<ShippingTicketPDF order={order} />).toBlob();

    // Create url and open PDF
    const url = URL.createObjectURL(blob);
    window.open(url, "_blank");
  }

  return { openShippingTicketPDF };
}
