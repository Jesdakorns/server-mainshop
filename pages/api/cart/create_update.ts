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

const post = async (req: NextApiRequest, res: NextApiResponse) => {
    let timestamp = dateFormat(new Date(), "yyyy-mm-dd, h:MM:ss");
    let __res = {}
    try {
        const auth = new middleware(req, res);
        if (auth.middleware()) { return }
        let user = auth.user()

        let product_id = req.body.product_id || '0'
        let quantity = req.body.quantity || '1'

        let textGetSqlCart = `select * from cart where product_id = ? and user_id = ? and pay = ?`
        let getCart = await db.query(
            textGetSqlCart,
            [product_id, user.id, '0']
        )
        console.log(`getCart.length == 0`, getCart.length)
        let isInsert = false
        let isUpdate = false
        if (getCart.length == 0) {
            let textSqlCart = `insert into cart (product_id, user_id, quantity, pay, remove, created_at, updated_at) values (?,?,?,?,?,?,?)`

            let insertCart = await db.query(
                textSqlCart,
                [product_id, user.id, quantity, '0', '0', timestamp, timestamp]
            )
            console.log(`insertCart`, insertCart)
            if (insertCart.insertId > 0) {
                isInsert = true
            }
        } else {

            let textSqlCart = `update cart set quantity = ?, updated_at = ? where product_id = ? and user_id = ? and pay = "0"`

            let updateCart = await db.query(
                textSqlCart,
                [quantity, timestamp, product_id, user.id]
            )
            console.log(`updateCart`, updateCart)
            if (updateCart.changedRows > 0) {
                isUpdate = true
            }
        }
        let getCartAll

        if (isInsert || isUpdate) {
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
                    pty.id as product_type_id,
                    pty.title_en as product_type_en,
                    pty.title_th as product_type_th,
                    c.quantity as product_quantity,
                    c.pay as product_pay,
                    p.created_at as product_created_at, 
                    p.updated_at as product_updated_at
                from cart as c
                join products as p on c.product_id = p.id
                join product_type as pty on p.type_id = pty.id
                join product_stock as ps on ps.product_id = p.id
                join province as pv on pv.id = p.address
                where c.user_id = ? and p.id = ? and c.pay = "0" and c.remove = "0" limit 1`
            getCartAll = await db.query(
                textSelectSqlCart,
                [user.id, product_id]
            )
            let textSqlPCI = `
            select id,type,url,size,created_at,updated_at from product_cover_image as pci where pci.product_id = ?`
            let getPCI = await db.query(
                textSqlPCI,
                [product_id]
            )
            getCartAll[0].product_cover_image = getPCI[0]
        }


        __res = {
            status: {
                error: false,
                message: ''
            },
            cart: getCartAll,
            timestamp: Math.floor(Date.now() / 1000)
        }
        res.status(200).json(__res)

    } catch (err) {
        let __res = {
            status: {
                error: true,
                message: 'Create product form cart error.'
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
