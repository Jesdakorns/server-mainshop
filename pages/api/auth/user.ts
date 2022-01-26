import type { NextApiRequest, NextApiResponse } from 'next'
import middleware from '@middleware'
const db = require('@database');
import { runMiddleware } from '@lib/cors'
const cors = {
    methods: ['GET'],
}
type Data = {
    status: {
        success: boolean,
        message: string,
    },
    data?: object,
    timestamp: number

}


const get = async (req: NextApiRequest, res: NextApiResponse) => {
    let __res = {}
    try {
        const auth = new middleware(req, res);
        if (auth.middleware()) { return }

        let resUser = await db.query(`
            select 
                users.id,
                users.username,
                users.firstname,
                users.lastname,
                users.email,
                users.gender,
                 users.image,
                users.phone,
                users.birthday,
                line.line_key,
                users.address,
                users.created_at
            from users LEFT JOIN line ON users.id = line.user_id WHERE users.id = ? limit 1`,
            [auth.user().id]
        )

        __res = {
            status: {
                error: false,
                message: ''
            },
            user: {
                id: resUser[0].id,
                username: resUser[0].username,
                firstname: resUser[0].firstname,
                lastname: resUser[0].lastname,
                fullname: `${resUser[0].firstname} ${resUser[0].lastname}`,
                email: resUser[0].email,
                image: resUser[0].image || '',
                birthday: resUser[0].birthday || '',
                gender: resUser[0].gender,
                phone: resUser[0].phone || '',
                line: resUser[0].line_key || '',
                created_at: Math.floor(Date.parse(resUser[0].created_at) / 1000)

            },
            timestamp: Math.floor(Date.now() / 1000)
        }

        res.status(200).json(__res)

    } catch (err) {
        let __res = {
            status: {
                error: true,
                message: 'Get user auth error.'
            },
            timestamp: Math.floor(Date.now() / 1000)
        }
        res.status(500).json(__res)
    }
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    await runMiddleware(req, res, cors)
    switch (req.method) {
        case 'GET':
            get(req, res)
            break
        default:
            res.status(405).end() //Method Not Allowed
            break
    }
}
