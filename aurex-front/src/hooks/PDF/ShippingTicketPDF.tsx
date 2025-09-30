import { Page, Text, View, Document, StyleSheet, Image } from "@react-pdf/renderer";
import { OrderManagement } from "../../interfaces/OrderManagement";

const styles = StyleSheet.create({
  page: {
    padding: "15px",
    fontSize: "11px",
    fontFamily: "Helvetica",
    width: "400px",
    height: "600px",
  },
  header: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "15px",
    borderBottom: "2px solid #000",
    paddingBottom: "8px",
  },
  logo: {
    width: "60px",
    height: "60px",
  },
  title: {
    fontSize: "14px",
    fontWeight: "bold",
    textAlign: "center",
    flex: 1,
  },
  qrCode: {
    width: "50px",
    height: "50px",
  },
  section: {
    marginBottom: "12px",
  },
  sectionTitle: {
    fontSize: "12px",
    fontWeight: "bold",
    marginBottom: "6px",
    textDecoration: "underline",
  },
  row: {
    display: "flex",
    flexDirection: "row",
    marginBottom: "3px",
  },
  label: {
    width: "120px",
    fontWeight: "bold",
  },
  value: {
    flex: 1,
  },
  barcodeContainer: {
    marginTop: "10px",
    marginBottom: "10px",
    textAlign: "center",
  },
  barcode: {
    fontFamily: "Courier",
    fontSize: "18px",
    fontWeight: "bold",
    letterSpacing: "2px",
    textAlign: "center",
  },
  itemsList: {
    marginTop: "8px",
  },
  itemRow: {
    display: "flex",
    flexDirection: "row",
    marginBottom: "4px",
    padding: "3px",
    backgroundColor: "#f5f5f5",
    borderRadius: "2px",
  },
  itemCol1: { width: "60%", fontWeight: "bold" },
  itemCol2: { width: "40%" },
  footer: {
    marginTop: "15px",
    textAlign: "center",
    fontSize: "9px",
    borderTop: "1px solid #000",
    paddingTop: "8px",
  },
});

interface Props {
  order: OrderManagement;
}

export default function ShippingTicketPDF({ order }: Props) {
  // Logo de Aurex
  const aurexLogo = "/src/assets/img/logos/A1.png";
  // Placeholder QR code
  const qrCode = "https://api.qrserver.com/v1/create-qr-code/?size=50x50&data=" + order.id;

  // Generate barcode data
  const barcodeData = order.id.slice(-8); // Use last 8 chars of order ID
  // Simple barcode pattern using special characters
  const barcodePattern = "||" + barcodeData.split('').join('|') + "||";

  return (
    <Document>
      <Page size={{ width: 400, height: 600 }} style={styles.page}>
        {/* Header con logo y QR */}
        <View style={styles.header}>
          <Image src={aurexLogo} style={styles.logo} />
          <Text style={styles.title}>TICKET DE ENVÍO</Text>
          <Image src={qrCode} style={styles.qrCode} />
        </View>

        {/* Código de barras */}
        <View style={styles.barcodeContainer}>
          <Text style={styles.barcode}>{barcodePattern}</Text>
          <Text style={styles.barcode}>{barcodeData}</Text>
        </View>

        {/* Información del Pedido */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Pedido #{order.id.slice(-8)}</Text>
          <View style={styles.row}>
            <Text style={styles.label}>Fecha:</Text>
            <Text style={styles.value}>{new Date(order.date).toLocaleDateString()}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Estado:</Text>
            <Text style={styles.value}>{order.status}</Text>
          </View>
        </View>

        {/* Información de Envío */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Dirección de Envío</Text>
          {order.shippingAddress && (
            <>
              <Text style={styles.value}>{order.shippingAddress.street}</Text>
              <Text style={styles.value}>
                {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}
              </Text>
              <Text style={styles.value}>{order.shippingAddress.country}</Text>
            </>
          )}
          {order.trackingNumber && (
            <View style={styles.row}>
              <Text style={styles.label}>Tracking:</Text>
              <Text style={styles.value}>{order.trackingNumber}</Text>
            </View>
          )}
          {order.courier && (
            <View style={styles.row}>
              <Text style={styles.label}>Courier:</Text>
              <Text style={styles.value}>{order.courier}</Text>
            </View>
          )}
        </View>

        {/* Productos */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Contenido del Paquete</Text>
          <View style={styles.itemsList}>
            {order.items.map((item, index) => (
              <View key={index} style={styles.itemRow}>
                <Text style={styles.itemCol1}>{item.product?.name || "Producto"}</Text>
                <Text style={styles.itemCol2}>Cant: {item.quantity}</Text>
              </View>
            ))}
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Total Items:</Text>
            <Text style={styles.value}>{order.items.reduce((sum, item) => sum + item.quantity, 0)}</Text>
          </View>
        </View>

        {/* Notas */}
        {order.notes && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Instrucciones Especiales</Text>
            <Text style={styles.value}>{order.notes}</Text>
          </View>
        )}

        {/* Código de barras inferior para empaquetado */}
        <View style={styles.barcodeContainer}>
          <Text style={styles.sectionTitle}>Código para Escaneo</Text>
          <Text style={styles.barcode}>{barcodePattern}</Text>
          <Text style={styles.barcode}>{barcodeData}</Text>
          <Text style={{ fontSize: "8px", textAlign: "center", marginTop: "5px" }}>
            Escanea al empaquetar
          </Text>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text>Aurex - Escanea el QR para tracking</Text>
          <Text style={{ marginTop: "3px" }}>
            Generado: {new Date().toLocaleDateString()}
          </Text>
        </View>
      </Page>
    </Document>
  );
}