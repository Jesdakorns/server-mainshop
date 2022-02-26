import type { NextApiRequest, NextApiResponse } from 'next'
import middleware from '@middleware'
const db = require('@database');
import { runMiddleware } from '@lib/cors'

type Data = {
    status: {
        success: boolean,
        message: string,
    },
    data?: object,
    timestamp: number

}
const cors = {
    methods: ['GET'],
}
const get = async (req: NextApiRequest, res: NextApiResponse) => {
    let __res = {}

    // try {
    let textTypeProduct = `
    select 
        pty.id as product_type_id,
        pty.title_en as product_type_title_en,
        pty.title_th as product_type_title_th,
         pty.image as product_type_image,
        pty.remove as product_type_remove
    from product_type as pty
    where pty.remove = "false"`
    let getTypeProduct = await db.query(textTypeProduct)

    if (getTypeProduct.length == 0) {
        __res = {
            status: {
                error: false,
                message: 'not data'
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
        data: getTypeProduct,
        timestamp: Math.floor(Date.now() / 1000)
    }
    res.status(200).json(__res)

    // } catch (err) {
    //     let __res = {
    //         status: {
    //             error: true,
    //             message: 'Get product all error.'
    //         },
    //         timestamp: Math.floor(Date.now() / 1000)
    //     }
    //     res.status(500).json(__res)
    // }
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
