import express from "express";

const router = express.Router();
const END_POINT_SUPABASE = "https://srhpcnaonhyzwvirvczi.supabase.co";
const SUPABASE_API_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNyaHBjbmFvbmh5end2aXJ2Y3ppIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1Njg2Nzc4NSwiZXhwIjoyMDcyNDQzNzg1fQ.qYVh94hfn-eWPrsPlEBFkueJWwVOlzJZDxHnVZSVHNM";

let advisors = [
    {
        id: 4233,
        username: 'admin',
        name: 'Daniel Eduardo Eguia Yupanqui',
        position: 'ANALISTA DE CREDITOS III',
        agency: {
            code: "03",
            name: "Huancayo"
        },
        password: '123'
    },
    {
        id: 8833,
        username: 'pepito',
        name: 'Pepito Nunez',
        position: 'ANALISTA DE CREDITOS III',
        agency: {
            code: "03",
            name: "Huancayo"
        },
        password: '1'
    },
    {
        id: 878,
        username: 'a',
        name: 'Joh Doe',
        position: 'ANALISTA DE CREDITOS III',
        agency: {
            code: "03",
            name: "Huancayo"
        },
        password: '1'
    }
]
router.post("/login", async (req, res) => {
    const { email, password } = req.body;
    try {
        console.log({email, password })
        const response = await fetch(`${END_POINT_SUPABASE}/auth/v1/token?grant_type=password`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                apikey: `${SUPABASE_API_KEY}`,
                Authorization: `Bearer ${SUPABASE_API_KEY}`,
            },
            body: JSON.stringify({
                email,
                password
            })
        });
        const data = await response.json();
        const data_send = {
            success: true,
            user: {
                email: data.user.email,
                ...data.user.user_metadata
            }
        }
        console.log(data_send.user)
        return res.json(data_send);
    } catch(err) {
        console.log(err)
        return res.json({
            success: false,
            message: "Login incorrecto",
        });
    }
});

router.get("/clients", async (req, res) => {
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
        data: data.reduce((acc, cur) => {
            acc.push(Object.entries(cur).reduce((accc, curr) => {
                const [k, v] = curr
                if (k !== "routes") {
                    accc[k] = v
                }
                return accc
            }, {}))
            return acc
        }, []),
    });
});

router.post("/routes/add", async (req, res) => {
    console.log("Routes")
    const { coordinates, client_id, signature, notes, photos } = req.body

    const response = await fetch(`${END_POINT_SUPABASE}/rest/v1/routes`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            apikey: SUPABASE_API_KEY,
            Authorization: `Bearer ${SUPABASE_API_KEY}`,
        },
        body: JSON.stringify({
            coordinates,
            client_id,
            signature,
            notes,
            photos
        })
    });

    if (!response.ok) {
        throw new Error(`Error HTTP: ${response.status}`);
    }

    console.log({ coordinates, client_id, signature, notes, photos })
    return res.json({
        success: true,
        message: 'Se Agregó correctamente'
    });
});

router.post("/visits/add", async (req, res) => {
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
