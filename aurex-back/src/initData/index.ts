import { UserRol, UserStatus } from "../interfaces/UserTS";
import { conn, User } from "../db";
import readline from "readline";

const bcrypt = require("bcrypt");
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

export async function initData() {
  rl.question(
    "Are you sure you want to run this function? This will delete the database and load backup (yes/no): ",
    async (answer: string) => {
      if (answer.toLowerCase() === "yes") {
        await loadData()
          .then(() => {
            console.log("Data loaded successfully!");
            rl.close();
          })
          .catch((error) => {
            console.error("Error al cargar datos iniciales:", error);
            rl.close();
          });
      } else {
        console.log("Initialization aborted by the user");
        rl.close();
      }
    }
  );
}

async function createUsers() {
  const initUsers = [
    {
      email: "admin@mipanel.online",
      rol: UserRol.ADMIN,
      status: UserStatus.ACTIVE,
      password: await bcrypt.hash("123qwe", 10),
    },
    {
      email: "comprador@mipanel.online",
      rol: UserRol.CLIENT,
      status: UserStatus.ACTIVE,
      password: await bcrypt.hash("123qwe", 10),
    },
    {
      email: "vendedor@mipanel.online",
      rol: UserRol.SELLER,
      status: UserStatus.ACTIVE,
      password: await bcrypt.hash("123qwe", 10),
    },
    {
      email: "vendedor2@mipanel.online",
      rol: UserRol.SELLER,
      status: UserStatus.WAITING,
      password: await bcrypt.hash("123qwe", 10),
    },
  ];

  for (const user of initUsers) {
    try {
      await User.create({
        ...user,
        name: user.email.split("@")[0],
      });
    } catch (error) {
      console.log("Error to create user:", user.email);
    }
  }
}

async function loadData(): Promise<void> {
  console.log("Dropping all tables (ignoring constraints)...");
  
  // Desactivar verificaciones de foreign keys para poder eliminar todo sin problemas
  await conn.query("SET FOREIGN_KEY_CHECKS = 0;");
  
  try {
    // Eliminar todas las tablas
    await conn.drop();
  } catch (error: any) {
    // Si falla, intentar eliminar tablas manualmente
    console.log("Attempting alternative drop method...");
    const [results] = await conn.query(
      "SELECT TABLE_NAME FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_SCHEMA = DATABASE()"
    ) as any[];
    
    for (const row of results) {
      try {
        await conn.query(`DROP TABLE IF EXISTS \`${row.TABLE_NAME}\`;`);
      } catch (dropError: any) {
        console.log(`Could not drop table ${row.TABLE_NAME}:`, dropError.message);
      }
    }
  }
  
  // Reactivar verificaciones de foreign keys
  await conn.query("SET FOREIGN_KEY_CHECKS = 1;");

  console.log("Creating tables...");
  // Crear todas las tablas desde cero
  await conn.sync({ force: false });

  await createUsers();
}
