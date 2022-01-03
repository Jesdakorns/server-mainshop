import type { NextApiRequest, NextApiResponse } from 'next'
import middleware from '@middleware'
const db = require('@database');

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
        let user = auth.user()

        let textSelectSqlCart = `
                select 
                    p.id as product_id ,
                    p.title as product_title,
                    p.price as product_price,
                    ps.stock_quantity as product_stock_quantity,
                    ps.sales_amount as product_sales_amount,
                    pv.id as product_province_id , 
                    pv.title_en as product_province_title_en , 
                    pv.title_th as product_province_title_th ,  
                    p.description as product_description, 
                    pci.url as product_cover_image,
                    pty.id as product_type_id,
                    pty.title_en as product_type_en,
                    pty.title_th as product_type_th,
                    c.quantity as product_quantity,
                    c.pay as product_pay,
                    p.created_at as product_created_at, 
                    p.updated_at as product_updated_at
                from cart as c
                join products as p on c.product_id = p.id
                join product_cover_image as pci on pci.product_id = p.id
                join product_type as pty on p.type_id = pty.id
                join product_stock as ps on ps.product_id = p.id
                join province as pv on pv.id = p.address
                where c.user_id = ? and c.pay = "false" and c.remove = "false"`
        let getCartAll = await db.query(
            textSelectSqlCart,
            [user.id]
        )
   

        __res = {
            status: {
                error: false,
                message: ''
            },
            getCartAll,
            timestamp: Math.floor(Date.now() / 1000)
        }
        res.status(200).json(__res)

    } catch (err) {
        let __res = {
            status: {
                error: true,
                message: 'Get product all error.'
            },
            timestamp: Math.floor(Date.now() / 1000)
        }
        res.status(500).json(__res)
    }
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    switch (req.method) {
        case 'GET':
            get(req, res)
            break
        default:
            res.status(405).end() //Method Not Allowed
            break
    }

}
