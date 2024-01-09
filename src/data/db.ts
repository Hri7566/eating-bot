import { Level } from "level";

export const db = new Level("./users.db");
export default db;
