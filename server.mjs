import express from 'express';
import cors from 'cors'
import dotenv from 'dotenv';
import mobileRoutes from "./mobile/init.mjs";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.get('/api/test', async (req, res) => {
    return res.send({
        error: false
    });
});
app.use("/api/mobile", mobileRoutes);

const PORT = process.env?.PORT || 4002;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});
