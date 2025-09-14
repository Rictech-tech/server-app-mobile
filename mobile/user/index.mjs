import express from "express";

const router = express.Router();
const END_POINT_SUPABASE = "https://srhpcnaonhyzwvirvczi.supabase.co";
const SUPABASE_API_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNyaHBjbmFvbmh5end2aXJ2Y3ppIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1Njg2Nzc4NSwiZXhwIjoyMDcyNDQzNzg1fQ.qYVh94hfn-eWPrsPlEBFkueJWwVOlzJZDxHnVZSVHNM";

router.get("/requests", async (req, res) => {
    try {
        console.log(req.query)
        const { user_id } = req.query;

        const response = await fetch(
            `${END_POINT_SUPABASE}/rest/v1/requests?select=*&user_id=eq.${user_id}`, 
            {
                method: "GET",
                headers: {
                    apikey: SUPABASE_API_KEY,
                    Authorization: `Bearer ${SUPABASE_API_KEY}`,
                },
            }
        );

        if (!response.ok) {
            throw new Error(`Error HTTP: ${response.status}`);
        }

        const data = await response.json();
        return res.json({
            success: true,
            data,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
});


export default router;