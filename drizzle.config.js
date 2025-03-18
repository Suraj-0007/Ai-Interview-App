/** @type { import("drizzle-kit").Config } */
export default {
    schema: "./utils/schema.js",
    dialect: 'postgresql',
    dbCredentials: {
        url: 'postgresql://neondb_owner:npg_WwV5IsyLon3C@ep-lucky-cherry-a5v5yg5o-pooler.us-east-2.aws.neon.tech/neondb?sslmode=require',
    }
}