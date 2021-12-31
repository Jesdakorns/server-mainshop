import type { NextApiRequest, NextApiResponse } from 'next'
const { Validator } = require('node-input-validator');
const db = require('@database');
import dateFormat, { masks } from "dateformat";
const bcrypt = require('bcrypt');
const saltRounds = 10;


let timestamp = dateFormat(new Date(), "yyyy-mm-dd, h:MM:ss");

type Data = {
    status: {
        success: boolean,
        message: string,
    },
    data?: object,
    timestamp: number

}


const post = async (req: NextApiRequest, res: NextApiResponse) => {
    let __res = {}
    try {

        const v = await new Validator(req.body, {
            username: 'required',
            password: 'required|minLength:6',
            email: 'required|email',
            firstname: 'required',
            lastname: 'required',
            gender: 'required',
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

        let isUsername = await db.query(`select username from users where username = ?`, [v.inputs.username])
        let isEmail = await db.query(`select email from users where email = ?`, [v.inputs.email])


        if (isUsername.length > 0 || isEmail.length > 0) {
            let __res = {
                status: {
                    error: true,
                    message: (isUsername.length > 0 && isEmail.length > 0 ? 'Username and Email is already in use.' : (isUsername.length > 0 ? 'Username is already in use.' : (isEmail.length > 0 ? 'Email is already in use.' : '')))
                },
                timestamp: Math.floor(Date.now() / 1000)
            }
            res.status(400).json(__res)
            return;
        }



        let hashPassword = bcrypt.hashSync(v.inputs.password, Number(process.env.NEXT_PUBLIC_SALT));

        let inserUser = await db.query(
            'INSERT INTO users (username,email,firstname,lastname,gender,created_at,updated_at) VALUES (?,?,?,?,?,?,?)',
            [
                v.inputs.username || '',
                v.inputs.email || '',
                v.inputs.firstname || '',
                v.inputs.lastname || '',
                v.inputs.gender || 'female',
                timestamp,
                timestamp
            ]
        );


        if (inserUser.insertId != 0) {
            let resDBPassword = await db.query(
                'INSERT INTO password (user_id,password,created_at,updated_at) VALUES (?,?,?,?)',
                [
                    inserUser.insertId,
                    hashPassword || '',
                    timestamp,
                    timestamp
                ]
            );
            let __res = {
                status: {
                    error: false,
                    message: 'Register success'
                },
                user: inserUser,
                timestamp: Math.floor(Date.now() / 1000)
            }
            res.status(201).json(__res)

        }




    } catch (err) {
        __res = {
            status: {
                error: true,
                message: 'Register Error.'
            },
            timestamp: Math.floor(Date.now() / 1000)
        }
        res.status(500).json(__res)
    }
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    switch (req.method) {
        case 'POST':
            post(req, res)
            break
        default:
            res.status(405).end() //Method Not Allowed
            break
    }
}


