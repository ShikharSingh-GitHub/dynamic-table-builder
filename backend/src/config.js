// Loads environment variables and exports application and DB configuration
import "dotenv/config";

export const config = {
  port: process.env.PORT || 4000,
  db: {
    host: process.env.MYSQL_HOST,
    port: Number(process.env.MYSQL_PORT || 3306),
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE,
  },
  adminToken: process.env.ADMIN_TOKEN,
};
