import type { NextApiRequest, NextApiResponse } from 'next';
// import { object } from 'prop-types'
const jwt = require('jsonwebtoken');
// // import { JWT } from 'server.config'
const { Validator } = require('node-input-validator');
const db = require('@database');
// import { query } from '@database';
const bcrypt = require('bcrypt');
// const saltRounds = 10;
import { runMiddleware } from '@lib/cors'
const cors = {
    methods: ['POST'],
}
type Data = {
    status: {
        success: boolean,
        message: string,
    },
    data?: {
        id: number,
        username: string,
        token: string,
    },
    timestamp: number

}

const post = async (req: NextApiRequest, res: NextApiResponse) => {

    let __res = {}
    try {
        const v = await new Validator(req.body, {
            username: 'required',
            password: 'required|minLength:6',
        });
        const matched = await v.check();
        if (!matched) {
            let validator = v.errors;
            __res = {
                status: {
                    error: true,
                    message: 'Request Required'
                },
                validator,
                timestamp: Math.floor(Date.now() / 1000)
            }
            res.status(400).send(__res);
            return;
        }

        let resUser = await db.query(
            'select id,username,email,firstname,lastname from users where username = ? or email = ? limit 1',
            [v.inputs.username, v.inputs.username]
        )

        let resPassword = await db.query(
            'select * from password where user_id = ? limit 1',
            [resUser[0].id]
        )

        let isAuth = await bcrypt.compare(v.inputs.password, resPassword[0].password);
        if (!isAuth) {
            let __res = {
                status: {
                    error: true,
                    message: 'The username/email or password is incorrect.'
                },
                timestamp: Math.floor(Date.now() / 1000)
            }
            res.status(400).json(__res)
            return;
        }

        let dataJwt = {
            id: resUser[0].id,
            username: resUser[0].username,
            firstname: resUser[0].firstname,
            lastname: resUser[0].lastname,
            fullname: `${resUser[0].firstname} ${resUser[0].lastname}`,
            email: resUser[0].email
        }
        var token = jwt.sign(dataJwt, process.env.NEXT_PUBLIC_JWT_KEY, { expiresIn: process.env.NEXT_PUBLIC_JWT_EXP });

        __res = {
            status: {
                error: false,
                message: ''
            },
            token,
            timestamp: Math.floor(Date.now() / 1000)
        }
        res.status(200).json(__res)
    } catch (err) {
        __res = {
            status: {
                error: true,
                message: 'Login Error.'
            },
            timestamp: Math.floor(Date.now() / 1000)
        }
        res.status(500).json(__res)
    }
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    await runMiddleware(req, res, cors)
    switch (req.method) {
        case 'POST':
            post(req, res)
            break
        default:
            res.status(405).end() //Method Not Allowed
            break
    }

}


