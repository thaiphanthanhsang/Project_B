import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import authRoutes from "./routes/auth.js";
import userRoutes from "./routes/users.js";
import productRoutes from "./routes/products.js";
import menuRoutes from "./routes/menu.js";
import checkoutRoutes from "./routes/checkout.js";
import adminOrders from "./routes/adminOrder.js";
import ordersRouter from "./routes/orders.js";
import adminNotifications from "./routes/adminNotifications.js"
import chatRoutes from "./routes/chatBox.js";
dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/products", productRoutes);
app.use("/api/menu", menuRoutes);
app.use("/api/checkout", checkoutRoutes);
app.use("/api/admin/orders", adminOrders);
app.use("/api/orders", ordersRouter);
app.use("/api/admin/notifications", adminNotifications);

app.use("/api/chat", chatRoutes);




const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running at port ${PORT}`);
});
