import express from "express";
import polyline from "@mapbox/polyline"; 

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
    const destinations = routes.reduce((acc, cur) => {
        acc.push(`${cur.latitude},${cur.longitude}`)
        return acc
    }, []).join("|");

    const apiKey = "AIzaSyDEq0noWzgMY4-hm1Jp2i7IGhH-saEHnv0";
    const response = await fetch(
        `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${origin}&destinations=${destinations}&mode=driving&key=${apiKey}`
    );
    const data = await response.json();
    return data
}

const GOOGLE_API_KEY = 'AIzaSyCkeuTYDX-d-uOT5NknCI3lRtaQxjlVaNw'; // 🔐 guarda tu API key en env

/**
 * Obtiene y decodifica la ruta desde Google Directions API
 * @param {Object} origin { lat, lng }
 * @param {Array} waypoints [{ lat, lng }, ...]
 * @param {Object} destination { lat, lng }
 */
export async function getRoute(origin, waypoints) {
  try {
    if (!waypoints || waypoints.length === 0) {
      throw new Error("Debes proporcionar al menos un waypoint");
    }

    const originStr = `${origin.lat},${origin.lng}`;
    const destinationStr = `${waypoints[waypoints.length - 1].lat},${waypoints[waypoints.length - 1].lng}`;
    const waypointsStr = "optimize:true|" + waypoints
      .slice(0, -1) // 👈 todos menos el último
      .map(w => `${w.lat},${w.lng}`)
      .join("|");

    const url = `https://maps.googleapis.com/maps/api/directions/json?origin=${originStr}&destination=${destinationStr}&waypoints=${waypointsStr}&key=${GOOGLE_API_KEY}`;

    const res = await fetch(url);
    const data = await res.json();

    if (!data.routes || data.routes.length === 0) {
      throw new Error("No se encontraron rutas");
    }

    const encoded = data.routes[0].overview_polyline.points;
    const decoded = polyline.decode(encoded);

    const path = decoded.map(([lat, lng]) => ({ latitude: lat, longitude: lng }));

    return { success: true, path };
  } catch (err) {
    console.error("Error en getRoute:", err.message);
    return { success: false, error: err.message };
  }
}

router.post("/routes", async (req, res) => {
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

    const googleMapsRoute = await getRoute(
        {
            lat: coordinates.latitude,
            lng: coordinates.longitude
        },
        uniqueData.reduce((acc, cur) => {
            acc.push({
                lat: cur['coordinates'][cur.coordinates.length - 1].latitude,
                lng: cur['coordinates'][cur.coordinates.length - 1].longitude
            })
            return acc
        }, [])
    )

    const newData = uniqueData.reduce((acc, cur, index) => {
        acc.push({
            ...cur,
            google_maps_route: googleMapsRoute,
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