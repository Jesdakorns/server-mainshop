import type { NextApiRequest, NextApiResponse } from 'next'
import middleware from '@middleware'
import dateFormat from 'dateformat';
import { JSONParser } from 'formidable/parsers';
const db = require('@database');


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
    let id_product = 0

    try {

        const auth = new middleware(req, res);
        if (auth.middleware()) { return }

        let user = auth.user()
        let title = req.body.title || ''
        let description = req.body.description || ''
        let type = req.body.type || ''
        let price = req.body.price || ''
        let coverImage = req.body.cover_image && JSON.parse(req.body.cover_image) || ''
        let productImage = req.body.product_image || []
        let stock_quantity = req.body.stock_quantity || ''
        let address = req.body.address || ''
        let delivery = req.body.delivery || []




        let textSqlProducts = `insert into products (title, price, type_id, address, user_id, description, remove , created_at, updated_at) values (?,?,?,?,?,?,?,?,?)`
        let insertProducts = await db.query(
            textSqlProducts,
            [title, price, type, address, user.id, description, "false", timestamp, timestamp]
        )
        console.log(`insertProducts.insertId`, typeof insertProducts.insertId)
        id_product = insertProducts.insertId

        if (id_product > 0) {
            delivery.map(async (val: any, idx: number) => {
                let _val_delivery = JSON.parse(val)
       

                let textSqlPD = `insert into product_delivery (product_id, delivery_id, price,remove, created_at, updated_at) values (?,?,?,?,?,?)`
                let insertPD = await db.query(
                    textSqlPD,
                    [id_product, _val_delivery.fk, _val_delivery.price, "false", timestamp, timestamp]
                )
            })


            let textSqlPCI = `insert into product_cover_image (type, url, size, product_id, created_at, updated_at) values (?,?,?,?,?,?)`
            let insertPCI = await db.query(
                textSqlPCI,
                [coverImage.type, coverImage.path, coverImage.size, id_product, timestamp, timestamp]
            )

            productImage.map(async (val: any, idx: number) => {
                let _val = JSON.parse(val)
                if (_val) {

                    let textSqlPI = `insert into product_images (type, url, size, product_id, created_at, updated_at) values (?,?,?,?,?,?)`
                    let insertPI = await db.query(
                        textSqlPI,
                        [_val.type, _val.path, _val.size, id_product, timestamp, timestamp]
                    )
                }
            })

            let textSqlPS = `insert into product_stock (stock_quantity, sales_amount, product_id, created_at, updated_at) values (?,?,?,?,?)`
            let insertPS = await db.query(
                textSqlPS,
                [Number(stock_quantity), 0, id_product, timestamp, timestamp]
            )

        }

        textSqlProducts = `
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
            p.created_at as product_created_at, 
            p.updated_at as product_updated_at
        from products as p 
        join product_type as pty on p.type_id = pty.id
        join product_stock as ps on ps.product_id = p.id
        join province as pv on pv.id = p.address
        where p.id = ?`
        let getProducts = await db.query(
            textSqlProducts,
            [id_product]
        )
        let textSqlPI = `
        select id,type,url,size,created_at,updated_at from product_images as pi where pi.product_id = ?`
        let getPI = await db.query(
            textSqlPI,
            [id_product]
        )
        let textSqlPCI = `
        select id,type,url,size,created_at,updated_at from product_cover_image as pci where pci.product_id = ?`
        let getPCI = await db.query(
            textSqlPCI,
            [id_product]
        )


        getProducts[0].product_cover_image = getPCI[0]
        getProducts[0].product_image = getPI
        __res = {
            status: {
                error: false,
                message: ''
            },
            product: getProducts[0],
            timestamp: Math.floor(Date.now() / 1000)
        }
        res.status(200).json(__res)
        return;
    } catch (err) {
        if (!id_product) {
            let textSqlPS = `delete from product_stock where product_id = ?`
            let deletePS = await db.query(
                textSqlPS,
                [id_product]
            )
            let textSqlPCI = `delete from product_cover_image where product_id = ?`
            let deletePCI = await db.query(
                textSqlPCI,
                [id_product]
            )
            let textSqlPI = `delete from product_images where product_id = ?`
            let deletePI = await db.query(
                textSqlPI,
                [id_product]
            )
            let textSqlProducts = `delete from products where id = ?`
            let deleteProducts = await db.query(
                textSqlProducts,
                [id_product]
            )
            let textSqlDelivery = `delete from product_delivery where product_id = ?`
            let deleteDelivery = await db.query(
                textSqlDelivery,
                [id_product]
            )
        }

        let __res = {
            status: {
                error: true,
                message: 'Create product error.'
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
