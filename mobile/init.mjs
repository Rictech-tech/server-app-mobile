import express from "express";

const router = express.Router();

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
        visits: []
    },
]
router.post("/login", async (req, res) => {
    console.log("Login");

    const { username, password } = req.body;
    console.log({ username, password })
    const user = advisors.find(el => el.username === username)
    console.log({ user })
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
    console.log("CLients")
    return res.json({
        success: true,
        data: clients.reduce((acc, cur) => {
            acc.push(Object.entries(cur).reduce((accc, curr) => {
                const [k, v] = curr
                if (k !== "visits") {
                    accc[k] = v
                }
                return accc
            }, {}))
            return acc
        }, []),
    });
});

router.post("/visits/add", async (req, res) => {
    const { coordinates, client_id, signature, notes } = req.body
    // console.log(req.body)
    console.log(notes)
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
                        coordinates,
                        signature,
                        notes
                    }
                ]
            }
            acc.push(data)
            return acc
        }, [])
        // console.log(JSON.stringify(clients))
    }
    console.log("add")
    return res.json({
        success: true,
        message: 'Se Agregó correctamente'
    });
});

export default router;
