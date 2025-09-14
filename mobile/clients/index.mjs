import express from "express";

const router = express.Router();
const END_POINT_SUPABASE = "https://srhpcnaonhyzwvirvczi.supabase.co";
const SUPABASE_API_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNyaHBjbmFvbmh5end2aXJ2Y3ppIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1Njg2Nzc4NSwiZXhwIjoyMDcyNDQzNzg1fQ.qYVh94hfn-eWPrsPlEBFkueJWwVOlzJZDxHnVZSVHNM";


router.get("/", async (req, res) => {
    const response = await fetch(`${END_POINT_SUPABASE}/rest/v1/clients?select=*`, {
        method: "GET",
        headers: {
            apikey: SUPABASE_API_KEY,
            Authorization: `Bearer ${SUPABASE_API_KEY}`,
        },
    });

    if (!response.ok) {
        throw new Error(`Error HTTP: ${response.status}`);
    }
    const data = await response.json();
    return res.json({
        success: true,
        data: data,
    });
});

export default router;