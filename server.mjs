import express from 'express';
import cors from 'cors'
import dotenv from 'dotenv';
import requestRoutes from "./mobile/requests/index.mjs";
import userRoutes from "./mobile/user/index.mjs";
import clientsRoutes from "./mobile/clients/index.mjs";
import routesRoutes from "./mobile/routes/index.mjs";
import loginRoutes from "./mobile/login/index.mjs";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.get('/api/test', async (req, res) => {
    console.log("aaa")
    return res.send({
        error: false
    });
});
app.use("/api/requests", requestRoutes);
app.use("/api/user", userRoutes);
app.use("/api/login", loginRoutes);
app.use("/api/clients", clientsRoutes);
app.use("/api/routes", routesRoutes);

const PORT = process.env?.PORT || 3007;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});
