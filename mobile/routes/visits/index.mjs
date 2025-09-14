import express from "express";

const router = express.Router();
const END_POINT_SUPABASE = "https://srhpcnaonhyzwvirvczi.supabase.co";
const SUPABASE_API_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNyaHBjbmFvbmh5end2aXJ2Y3ppIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1Njg2Nzc4NSwiZXhwIjoyMDcyNDQzNzg1fQ.qYVh94hfn-eWPrsPlEBFkueJWwVOlzJZDxHnVZSVHNM";

router.post("/add", async (req, res) => {
    const { client_id, signature, notes, photos } = req.body
    const response = await fetch(`${END_POINT_SUPABASE}/rest/v1/visits`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Prefer: "return=representation",
            apikey: SUPABASE_API_KEY,
            Authorization: `Bearer ${SUPABASE_API_KEY}`,
        },
        body: JSON.stringify({
            client_id,
            signature,
            notes,
            photos
        })
    });
    if (!response.ok) {
        throw new Error(`Error HTTP: ${response.status}`);
    }
    console.log({ client_id, signature, notes, photos })
    return res.json({
        success: true,
        message: 'Se Agregó correctamente'
    });
});

export default router;