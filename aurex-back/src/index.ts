import { initData } from "./initData";
import { conn } from "./db";
import app from "./app";

const PORT = process.env.PORT || 3001;

if (process.argv.includes("--init-data")) {
  // Set init data
  initData();
} else {
  console.log(7);
  // Verificar conexión sin sincronizar (más eficiente)
  conn.authenticate()
    .then(() => {
      console.log(8);
      console.log("Database connection established successfully.");
      // Open server
      app.listen(PORT, () => {
        console.log(9);
        console.log(`Server listening in port ${PORT}`);
      });
    })
    .catch((err) => {
      console.error("Unable to connect to the database:", err);
      process.exit(1);
    });
}
