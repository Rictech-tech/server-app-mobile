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
        agency: 'Huancayo',
        password: '123'
    },
    {
        id: 8833,
        username: 'pepito',
        name: 'Pepito Nunez',
        position: 'ANALISTA DE CREDITOS III',
        agency: 'Huancayo',
        password: '1'
    },
    {
        id: 878,
        username: 'a',
        name: 'Joh Doe',
        position: 'ANALISTA DE CREDITOS III',
        agency: 'Huancayo',
        password: '1'
    }
]

let clients = [
    {
        id: 344,
        name: "Daniel Suarez",
        document_number: "88393839",
        address: "Av, los proceres 123",
        district: "Lince",
        balance: 423.0,
        blackberry: 3.5,
        promises_to_pay_today: 5,
        new_disbursements: 120,
        routes: [],
        visits: []
    },
    {
        id: 543,
        name: "Edwin Donaire",
        document_number: "88393839",
        address: "Av, los proceres 123",
        district: "Lince",
        balance: 538.0,
        blackberry: 3.5,
        promises_to_pay_today: 5,
        new_disbursements: 22,
        routes: [],
        visits: []
    },
    {
        id: 533,
        name: "Ernesto Ortega",
        document_number: "88393839",
        address: "Av, los proceres 123",
        district: "Lince",
        balance: 723.0,
        blackberry: 3.5,
        promises_to_pay_today: 5,
        new_disbursements: 33,
        routes: [],
        visits: []
    },
    {
        id: 884,
        name: "Juan Soto",
        document_number: "88393839",
        address: "Av, los proceres 123",
        district: "Lince",
        balance: 234.0,
        blackberry: 3.5,
        promises_to_pay_today: 5,
        new_disbursements: 44,
        routes: [],
        visits: []
    },
]
router.post("/login", async (req, res) => {
    console.log("Login");
    const { username, password } = req.body;
    const user = advisors.find(el => el.username === username)
    if (user && user.password === password) {
        const data = {
            success: true,
            message: "Login correcto",
            user: user
        }
        console.log({ data })
        return res.json(data);
    }

    return res.json({
        success: false,
        message: "Login incorrecto",
    });
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
    console.log("Visits")
    console.log({ client_id, signature, notes, photos })
    const client = clients.find(el => el.id == client_id)
    if (client) {
        console.log("Has client")
        clients = clients.reduce((acc, cur) => {
            const data = cur
            if (cur.id === client_id) {
                data['visits'] = [
                    ...data['visits'],
                    {
                        date: new Date(),
                        signature,
                        notes,
                        photos
                    }
                ]
            }
            acc.push(data)
            return acc
        }, [])
    }
    return res.json({
        success: true,
        message: 'Se Agregó correctamente'
    });
});

export default router;
