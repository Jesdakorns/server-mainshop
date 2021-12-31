import type { NextApiRequest, NextApiResponse } from 'next'
import middleware from '@middleware'
import dateFormat from 'dateformat';
const db = require('@database');
const bcrypt = require('bcrypt');
var omise = require('omise')({
    publicKey: process.env.NEXT_PUBLIC_PAYMENT_PUBLIC_KEY,
    secretKey: process.env.NEXT_PUBLIC_PAYMENT_SECRET_KEY,
})

type Data = {
    status: {
        success: boolean,
        message: string,
    },
    data?: object,
    timestamp: number

}

const Post = async (req: NextApiRequest, res: NextApiResponse) => {
    let __res = {}
    let date = dateFormat(new Date(), "yyyy-mm-dd, h:MM:ss");


    let token = await omise.tokens.create({
        "object": "source",
        "amount": 400000,
        "currency": "THB",
        "type": "internet_banking_scb",

    })
    console.log(`token`, token)
    return
    try {
        const auth = new middleware(req, res);
        if (auth.middleware()) { return }

        let user = auth.user()

        let type = req.body.type || 'card'
        let password = req.body.password || ''


        let resPassword = await db.query(
            'select * from password where user_id = ? limit 1',
            [user.id]
        )

        let isAuth = await bcrypt.compare(password, resPassword[0].password);
        if (!isAuth) {
            let __res = {
                status: {
                    error: true,
                    message: 'The password is incorrect.'
                },
                timestamp: Math.floor(Date.now() / 1000)
            }
            res.status(400).json(__res)
            return;
        }

        if (type == 'card') {
            let name = req.body.name || ''
            let amount = req.body.amount * 100 || 0
            let number = req.body.number || ''
            let expiration = req.body.expiration || ''
            let security = req.body.security || ''
            let expiration_month = expiration.split('/')[0]
            let expiration_year = expiration.split('/')[1]

            let tokenPayment = await omise.tokens.create({
                'card': {
                    'name': name,
                    'number': number,
                    'expiration_month': expiration_month,
                    'expiration_year': expiration_year,
                    'security_code': security
                }
            });


            console.log(`tokenPayment`, tokenPayment)

            let customer = await omise.customers.create({
                email: user.email,
                description: date,
                card: tokenPayment?.id
            });
            console.log(`customer`, customer)

            let charges = await omise.charges.create({
                amount: amount,
                currency: 'thb',
                customer: customer.id
            });
            console.log(`charges`, charges)

        } else if (type == 'internet_banking') {

            let amount = req.body.amount * 100 || ''
            let token = req.body.token || ''
            token = await omise.tokens.create({
                "source": {
                    "amount": 400000,
                    "currency": "THB",
                    "type": "internet_banking_scb",
                }
            })
            let charges = await omise.charges.create({
                amount: amount,
                source: token,
                currency: 'thb',
                return_url: 'http://localhost:3000'
            });
            console.log(`charges`, charges)
        }
        __res = {
            status: {
                error: false,
                message: ''
            },
            user,
            timestamp: Math.floor(Date.now() / 1000)
        }
        res.status(200).json(__res)

    } catch (err) {
        let __res = {
            status: {
                error: true,
                message: 'Payment error.'
            },
            timestamp: Math.floor(Date.now() / 1000)
        }
        res.status(500).json(__res)
    }
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    switch (req.method) {
        case 'POST':
            Post(req, res)
            break
        default:
            res.status(405).end() //Method Not Allowed
            break
    }

}
