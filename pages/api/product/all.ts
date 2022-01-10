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
   
    try {

        let category = req.query.category || ""
        let minPrice = req.query.minPrice || ""
        let maxPrice = req.query.maxPrice || ""
        let keyword = req.query.keyword || ""
        let sortBy = req.query.sortBy || ""
        let order = req.query.order || ""
        let page = req.query.page || 1

        console.log(`minPrice`, minPrice)
        console.log(`maxPrice`, maxPrice)

        // console.log(`category`, typeof category, category)
        // console.log(`minPrice`, typeof minPrice, minPrice)
        // console.log(`maxPrice`, typeof maxPrice, maxPrice)
        // console.log(`keyword`, typeof keyword, keyword)
        // console.log(`sortBy`, typeof sortBy, sortBy)
        // console.log(`order`, typeof order, order)
        // console.log(`page`, typeof page, page)

        let sqlKeyword = ``
        let sqlCategory = ``
        let sqlPrice = ``
        let sqlSortBy = ``
        if (sortBy === '') {
            sqlSortBy = ` order by p.id desc `
        } else if (sortBy === "price") {
            console.log(`price`)
            sqlSortBy = ` order by p.price ${order} `
        } else if (sortBy === "sales") {
            console.log(`sales`);
            sqlSortBy = ` order by p.price desc `
        }

        if (minPrice != "" && maxPrice != "") {
            sqlPrice = (minPrice != "" && maxPrice != "" ? ` and p.price between ${minPrice} AND ${maxPrice} ` : ``)
        } else if (minPrice != "") {
            sqlPrice = (minPrice != "" ? ` and p.price <= ${minPrice} ` : ``)
        } else if (maxPrice != "") {
            sqlPrice = (maxPrice != "" ? ` and p.price >= ${maxPrice} ` : ``)
        }


        sqlKeyword = (keyword != "" ? ` and (p.title like "%${keyword}%" or pty.title_th like "%${keyword}%" or pty.title_en like "%${keyword}%")  ` : ``)
        sqlCategory = (category != "" ? ` and  (pty.title_th like "%${category}%" or pty.title_en like "%${category}%") ` : ``)


        let per_page = 15;
        let offset = (Number(page) - 1) * per_page;

        let rowProduct = await db.query(`select count(*) as rows from products where remove = "false"`)


        let last_page = Math.ceil(rowProduct[0].rows / per_page)
        console.log(`page`, typeof last_page, last_page)


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
            pci.type as product_cover_image_type,
            pci.url as product_cover_image_url,
            p.created_at as product_created_at, 
            p.updated_at as product_updated_at
        from products as p 
        join product_type as pty on p.type_id = pty.id
        join product_stock as ps on ps.product_id = p.id
        join product_cover_image as pci on pci.product_id = p.id
        join province as pv on pv.id = p.address
        where p.remove = "false" 
        ${sqlKeyword}${sqlCategory}${sqlPrice}${sqlSortBy}

        limit ${offset},${per_page}`
        console.log(`textSqlProducts`, textSqlProducts)
        let getProducts = await db.query(
            textSqlProducts
        )


        if (getProducts.length == 0) {
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
            data: getProducts,
            // total: rowProduct[0].rows,
            per_page: per_page,
            current_page: Number(page),
            last_page: last_page,
            path: `${process.env.NEXT_PUBLIC_APP_URL}`,
            first_page_url: `${process.env.NEXT_PUBLIC_APP_URL}/api/product/all?page=1`,
            last_page_url: `${process.env.NEXT_PUBLIC_APP_URL}/api/product/all?page=${last_page}`,
            next_page_url: (Number(page) < last_page ? `${process.env.NEXT_PUBLIC_APP_URL}/api/product/all?page=${Number(page) + 1}` : ""),
            prev_page_url: (Number(page) !== 1 ? `${process.env.NEXT_PUBLIC_APP_URL}/api/product/all?page=${Number(page) - 1}` : ""),
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
