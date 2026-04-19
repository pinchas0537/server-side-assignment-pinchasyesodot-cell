import express from "express";
import { connectDB } from "./config/db";
import orderR from "./routers/orderR";
import logger from "./utils/Logger";
import itemR from "./routers/itemR";

const app = express();

const PORT = 3000;

app.use(express.json());

app.use((req: express.Request, res: express.Response, next: express.NextFunction) => {
    logger.info("Incoming request", { method: req.method, url: req.url ,IP: req.ip} );
    next();
});

app.use("/api/orders", orderR)

app.use("/api/items", itemR)

async function startServer() {
    try {
        await connectDB();
        app.listen(PORT, () => {
            console.log(`Server is running on http://localhost:${PORT}`);
        });
    } catch (error) {
        console.error("Failed to start server:", error);
        process.exit(1);
    }
}
startServer();