import express from "express";

const router = express.Router();
const END_POINT_SUPABASE = "https://srhpcnaonhyzwvirvczi.supabase.co";
const SUPABASE_API_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNyaHBjbmFvbmh5end2aXJ2Y3ppIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1Njg2Nzc4NSwiZXhwIjoyMDcyNDQzNzg1fQ.qYVh94hfn-eWPrsPlEBFkueJWwVOlzJZDxHnVZSVHNM";

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
        data: data,
    });
});

async function routesGoogleMaps({
    current,
    routes
}) {
    console.log({ current, routes })
    const origin = `${current.latitude},${current.longitude}`;
    // "-11.8245954,-77.1025073"
    const destinations = routes.reduce((acc, cur) => {
        acc.push(`${cur.latitude},${cur.longitude}`)
        return acc
    }, []).join("|");
    console.log(destinations)

    const apiKey = "AIzaSyDEq0noWzgMY4-hm1Jp2i7IGhH-saEHnv0";

    const response = await fetch(
        `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${origin}&destinations=${destinations}&mode=driving&key=${apiKey}`
    );
    const data = await response.json();
    return data

}


router.post("/routes", async (req, res) => {
    console.log(req.body)
    const { coordinates } = req.body
    const response = await fetch(`${END_POINT_SUPABASE}/rest/v1/routes?select=coordinates,id,created_at,client_id,client:clients(*)&order=created_at.desc`, {
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
    const uniqueClientIds = [];
    const uniqueData = data.reduce((acc, item) => {
        if (!acc.some(el => el.client_id === item.client_id)) {
            acc.push(item);
        }
        return acc;
    }, []);

    const googleMaps = await routesGoogleMaps({
        current: coordinates,
        routes: uniqueData.reduce((acc, cur) => {
            acc.push(cur['coordinates'][cur.coordinates.length - 1])
            return acc
        }, [])
    })

    const newData = uniqueData.reduce((acc, cur, index) => {
        acc.push({
            ...cur,
            google_maps: {
                address: googleMaps.destination_addresses[index],
                location: googleMaps.rows[0].elements[index]
            }
        })
        return acc
    }, [])

    return res.json({
        success: true,
        googleMaps,
        data: newData,
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
