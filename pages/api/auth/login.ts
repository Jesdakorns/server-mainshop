import type { NextApiRequest, NextApiResponse } from 'next'
// import { object } from 'prop-types'
// const jwt = require('jsonwebtoken');
// // import { JWT } from 'server.config'
const { Validator } = require('node-input-validator');
// const db = require('@database');
// import { query } from '@database';
const bcrypt = require('bcrypt');
// const saltRounds = 10;


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
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
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

        // let resUser = await db.query(
        //     'select id,username,email from users where username = ? or email = ? limit 1',
        //     [v.inputs.username, v.inputs.username]
        // )

        // let resPassword = await db.query(
        //     'select * from password where user_id = ? limit 1',
        //     [resUser[0].id]
        // )

        // console.log(`resPassword[0].password`, resPassword[0].password)
        // console.log(`v.inputs.password`, v.inputs.password)
        // let isAuth = await bcrypt.compare(v.inputs.password, resPassword[0].password);
        // console.log(`isAuth`, isAuth)


        const saltRounds = 10;
        const myPlaintextPassword = 's0/\/\P4$$w0rD';
        const someOtherPlaintextPassword = 'not_bacon';

        const salt = bcrypt.genSaltSync(saltRounds);
        const hash = bcrypt.hashSync(myPlaintextPassword, salt);

        let d = bcrypt.compareSync(myPlaintextPassword, hash); // true
        let s = bcrypt.compareSync(someOtherPlaintextPassword, hash); // false
            console.log(`d`, d)
            console.log(`s`, s)
        // if (!isAuth) {

        // }
        __res = {
            status: {
                error: false,
                message: ''
            },
            d,
            s,
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
