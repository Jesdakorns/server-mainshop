import type { NextApiRequest, NextApiResponse } from 'next'
import middleware from '@middleware'
import dateFormat from 'dateformat';
import { JSONParser } from 'formidable/parsers';
const db = require('@database');

let timestamp = dateFormat(new Date(), "yyyy-mm-dd, h:MM:ss");
type Data = {
    status: {
        success: boolean,
        message: string,
    },
    data?: object,
    timestamp: number

}


const Get = async (req: NextApiRequest, res: NextApiResponse) => {
    let __res = {}
    let id_product = 0

    try {
        const auth = new middleware(req, res);
        if (auth.middleware()) { return }
        let user = auth.user()

        let queryProductId = req.query.id


        let __res = {
            status: {
                error: false,
                message: ''
            },
            timestamp: Math.floor(Date.now() / 1000)
        }
        res.status(200).json(__res)
        return;

    } catch (err) {
        let __res = {
            status: {
                error: true,
                message: 'Get product one error.'
            },
            timestamp: Math.floor(Date.now() / 1000)
        }
        res.status(500).json(__res)
        return;
    }
}

const Patch = async (req: NextApiRequest, res: NextApiResponse) => {
    let __res = {}
    let id_product = 0
    console.log(`req.query.id`, req.query.id)
    console.log(`req.headers`, req.headers)

    try {

        const auth = new middleware(req, res);
        if (auth.middleware()) { return }
        let user = auth.user()

        let queryProductId = req.query.id


        __res = {
            status: {
                error: false,
                message: ''
            },
            timestamp: Math.floor(Date.now() / 1000)
        }
        res.status(200).json(__res)


        return;
    } catch (err) {

        let __res = {
            status: {
                error: true,
                message: 'Update product error.'
            },
            timestamp: Math.floor(Date.now() / 1000)
        }
        res.status(500).json(__res)
    }
}

const Delete = async (req: NextApiRequest, res: NextApiResponse) => {
    let __res = {}
    let id_product = 0
    console.log(`req.query.id`, req.query.id)
    console.log(`req.headers`, req.headers)

    try {
        const auth = new middleware(req, res);
        if (auth.middleware()) { return }
        let user = auth.user()

        let queryProductId = req.query.id

        let textSqlProducts = `update cart as c set remove = ?  where c.user_id = ? and c.product_id = ? and c.remove = ? and c.pay = ?`
        let deleteProducts = await db.query(
            textSqlProducts,
            ["1", user.id, queryProductId,"0","0"]
        )

        if(deleteProducts.changedRows == 0){
            __res = {
                status: {
                    error: false,
                    message: 'Not data'
                },
                timestamp: Math.floor(Date.now() / 1000)
            }
            res.status(200).json(__res)
            return;
        }

        __res = {
            status: {
                error: false,
                message: ''
            },
            timestamp: Math.floor(Date.now() / 1000)
        }
        res.status(200).json(__res)
        return;

    } catch (err) {

        let __res = {
            status: {
                error: true,
                message: 'Delete product error.'
            },
            timestamp: Math.floor(Date.now() / 1000)
        }
        res.status(500).json(__res)
        return;
    }
}


export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    switch (req.method) {
        case 'GET':
            Get(req, res)
            break
        case 'PATCH':
            Patch(req, res)
            break
        case 'DELETE':
            Delete(req, res)
            break
        default:
            res.status(405).end() //Method Not Allowed
            break
    }

}
