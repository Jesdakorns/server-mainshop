import type { NextApiRequest, NextApiResponse } from 'next'
import middleware from '@middleware'
import dateFormat from 'dateformat';
import { JSONParser } from 'formidable/parsers';
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
    methods: ['GET','PATCH','DELETE'],
}

const Get = async (req: NextApiRequest, res: NextApiResponse) => {
    let timestamp = dateFormat(new Date(), "yyyy-mm-dd, h:MM:ss");
    let __res = {}
    let id_product = 0
  
    try {
        let queryProductId = req.query.id
        // const auth = new middleware(req, res);
        // if (auth.middleware()) { return }

        // let user = auth.user()

        let textSqlProducts = `
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
        where p.id = ? and p.remove = "false"`
        let getProducts = await db.query(
            textSqlProducts,
            [queryProductId]
        )
        let textSqlPI = `
        select id,type,url,size,created_at,updated_at from product_images as pi where pi.product_id = ?`
        let getPI = await db.query(
            textSqlPI,
            [queryProductId]
        )
        let textSqlPCI = `
        select id,type,url,size,created_at,updated_at from product_cover_image as pci where pci.product_id = ?`
        let getPCI = await db.query(
            textSqlPCI,
            [queryProductId]
        )

        if (getProducts.length > 0) {

            getProducts[0].product_cover_image = getPCI[0]
            getProducts[0].product_image = getPI
        } else {
            let __res = {
                status: {
                    error: false,
                    message: 'Not data.'
                },
                timestamp: Math.floor(Date.now() / 1000)
            }
            res.status(200).json(__res)
            return;
        }

        let __res = {
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
    let timestamp = dateFormat(new Date(), "yyyy-mm-dd, h:MM:ss");
    let __res = {}
    let id_product = 0
    console.log(`req.query.id`, req.query.id)
    console.log(`req.headers`, req.headers)

    try {

        const auth = new middleware(req, res);
        if (auth.middleware()) { return }
        let user = auth.user()

        let queryProductId = req.query.id

        let title = req.body.title || ''
        let description = req.body.description || ''
        let type = req.body.type || ''
        let price = req.body.price || ''
        let coverImage = req.body.cover_image && JSON.parse(req.body.cover_image) || ''
        let productImage = req.body.product_image || []
        let stockQuantity = req.body.stock_quantity || ''
        let address = req.body.address || ''

        let sqlVariable = []
        let sqlText = []
        let sqlTitle = ``
        let sqlDescription = ``
        let sqlType = ``
        let sqlPrice = ``
        let sqlStockQuantity = ``
        let sqlCoverImage = ``

        if (title !== '') {
            sqlTitle = ` p.title = ? `
            sqlText.push(sqlTitle)
            sqlVariable.push(title)
        }

        if (description !== '') {
            sqlDescription = ``
            sqlText.push(sqlDescription)
            sqlVariable.push(description)
        }

        if (type !== '') {
            sqlType = ` p.type_id  = ? `
            sqlText.push(sqlType)
            sqlVariable.push(type)
        }

        if (price !== '') {
            sqlPrice = ` p.price = ? `
            sqlText.push(sqlPrice)
            sqlVariable.push(price)
        }
        if (address !== '') {
            sqlPrice = ` p.address = ? `
            sqlText.push(sqlPrice)
            sqlVariable.push(address)
        }

        if (stockQuantity !== '') {
            sqlStockQuantity = ` ps.stock_quantity = ? , ps.updated_at = ?`
            sqlText.push(sqlStockQuantity)
            sqlVariable.push(stockQuantity)
            sqlVariable.push(timestamp)

        }

        if (coverImage !== '') {
            console.log(`coverImage`, coverImage)
            sqlCoverImage = ` pci.type = ? , pci.url = ? , pci.size = ? , pci.updated_at = ? `
            sqlText.push(sqlCoverImage)
            sqlVariable.push(coverImage.type)
            sqlVariable.push(coverImage.path)
            sqlVariable.push(coverImage.size)
            sqlVariable.push(timestamp)
        }



        console.log(`productImage`, typeof productImage[0], productImage)
        if (productImage.length > 0) {
            let textSqlPI = `delete from product_images where product_id = ?`
            let deletePI = await db.query(
                textSqlPI,
                [queryProductId]
            )

            productImage?.map(async (val: any, idx: number) => {
                let _val = JSON.parse(val)
                if (_val) {

                    let textSqlPI = `insert into product_images (type, url, size, product_id, created_at, updated_at) values (?,?,?,?,?,?)`
                    let insertPI = await db.query(
                        textSqlPI,
                        [_val.type, _val.path, _val.size, queryProductId, timestamp, timestamp]
                    )
                }
            })
        }


        sqlText.push(` p.updated_at = ? `)
        sqlVariable.push(timestamp)
        sqlVariable.push(queryProductId)
        sqlVariable.push(queryProductId)
        sqlVariable.push(queryProductId)
        let textSqlProducts = `
            update products as p 
            join product_stock as ps 
            join product_cover_image as pci
            set ${sqlText} 
            where p.id = ? and ps.product_id = ? and pci.product_id = ? and p.remove = "false"`
        console.log(`textSqlProducts`, textSqlProducts)
        let updateProducts = await db.query(
            textSqlProducts,
            sqlVariable
        )

        if (updateProducts.changedRows > 0) {
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
            where p.id = ? and p.remove = "false" `
            let getProducts = await db.query(
                textSqlProducts,
                [queryProductId]
            )
            let textSqlPI = `
            select id,type,url,size,created_at,updated_at from product_images as pi where pi.product_id = ?`
            let getPI = await db.query(
                textSqlPI,
                [queryProductId]
            )
            let textSqlPCI = `
            select id,type,url,size,created_at,updated_at from product_cover_image as pci where pci.product_id = ?`
            let getPCI = await db.query(
                textSqlPCI,
                [queryProductId]
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
        } else {
            __res = {
                status: {
                    error: false,
                    message: 'No data updates.'
                },
                timestamp: Math.floor(Date.now() / 1000)
            }
            res.status(200).json(__res)
        }

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
    let timestamp = dateFormat(new Date(), "yyyy-mm-dd, h:MM:ss");
    let __res = {}
    let id_product = 0
    console.log(`req.query.id`, req.query.id)
    console.log(`req.headers`, req.headers)

    try {
        const auth = new middleware(req, res);
        if (auth.middleware()) { return }
        let user = auth.user()

        let queryProductId = req.query.id

        // let textSqlPS = `delete from product_stock where product_id = ?`
        // let deletePS = await db.query(
        //     textSqlPS,
        //     [queryProductId]
        // )
        // let textSqlPCI = `delete from product_cover_image where product_id = ?`
        // let deletePCI = await db.query(
        //     textSqlPCI,
        //     [queryProductId]
        // )
        // let textSqlPI = `delete from product_images where product_id = ?`
        // let deletePI = await db.query(
        //     textSqlPI,
        //     [queryProductId]
        // )
        // let textSqlProducts = `delete from products where id = ?`
        let textSqlProducts = `update products as p set remove = "true"  where p.id = ? and p.remove = "false"`
        let deleteProducts = await db.query(
            textSqlProducts,
            [queryProductId]
        )

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
    await runMiddleware(req, res, cors)
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
