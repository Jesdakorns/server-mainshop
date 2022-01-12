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
    methods: ['GET', 'POST'],
}

const Get = async (req: NextApiRequest, res: NextApiResponse) => {
    let timestamp = dateFormat(new Date(), "yyyy-mm-dd, h:MM:ss");
    let __res = {}
    let id_product = 0

    try {
        let queryProductId = req.query.id
        let page = req.query.page || 1


        let per_page = 5;
        let offset = (Number(page) - 1) * per_page;
        let rowProduct = await db.query(`select count(*) as rows from product_review as pr where pr.product_id = ? and pr.remove = "false"`, [queryProductId])


        let last_page = Math.ceil(rowProduct[0].rows / per_page)
        console.log(`page`, typeof last_page, last_page)

        let textSqlReviewAll = `
        select 
           sum(pr.rating) as product_review_rating_all
         from product_review as pr 
         join users as u on u.id = pr.user_id 
         where pr.product_id = ? and pr.remove = "false"`
        let getReviewAll = await db.query(
            textSqlReviewAll,
            [queryProductId]
        )


        let textSqlProducts = `
        select 
            pr.id as product_review_id,
            pr.rating as product_review_rating,
            pr.description as product_review_description,
            u.firstname as user_firstname,
            u.lastname as user_lastname,
            u.image as user_image,
            pr.created_at as product_review_created_at
         from product_review as pr 
         join users as u on u.id = pr.user_id 
         where pr.product_id = ? and pr.remove = "false"
         order by pr.id desc
         limit ${offset},${per_page}`
        let getProductsReview = await db.query(
            textSqlProducts,
            [queryProductId]
        )
        let textSqlProductsReviewUpload = `
        select 
            id,
            type,
            url,
            size,
            product_review_id,
            created_at,
            updated_at 
        from product_review_upload 
        where product_id  = ?`
        let getProductsReviewUpload = await db.query(
            textSqlProductsReviewUpload,
            [queryProductId]
        )

        // getProductsReview.map((val: any, idx: number) => {
        //     getProductsReviewUpload.map((_val: any) 
        //     getProductsReview[idx].product_review_upload = getProductsReviewUpload.map((_val: any) => ((_val.product_review_id == val.product_review_id) && _val))
        // })


        if (getProductsReview.length == 0) {
            let __res = {
                status: {
                    error: false,
                    message: 'not data.'
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
            product_review_sum: Number((Number(getReviewAll[0].product_review_rating_all) / rowProduct[0].rows).toFixed(1)),
            data: { review_comment: getProductsReview, review_upload: getProductsReviewUpload },
            data_total: per_page,
            per_page: rowProduct[0].rows,
            current_page: Number(page),
            last_page: last_page,
            path: `${process.env.NEXT_PUBLIC_APP_URL}`,
            first_page_url: `${process.env.NEXT_PUBLIC_APP_URL}/api/product/review/${queryProductId}?page=1`,
            last_page_url: `${process.env.NEXT_PUBLIC_APP_URL}/api/product/review/${queryProductId}?page=${last_page}`,
            next_page_url: (Number(page) < last_page ? `${process.env.NEXT_PUBLIC_APP_URL}/api/product/review/${queryProductId}?page=${Number(page) + 1}` : ""),
            prev_page_url: (Number(page) !== 1 ? `${process.env.NEXT_PUBLIC_APP_URL}/api/product/review/${queryProductId}?page=${Number(page) - 1}` : ""),
            timestamp: Math.floor(Date.now() / 1000)
        }
        res.status(200).json(__res)
        return;

    } catch (err) {
        let __res = {
            status: {
                error: true,
                message: 'Get review product one error.'
            },
            timestamp: Math.floor(Date.now() / 1000)
        }
        res.status(500).json(__res)
        return;
    }
}

const Post = async (req: NextApiRequest, res: NextApiResponse) => {


}


export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    await runMiddleware(req, res, cors)
    switch (req.method) {
        case 'GET':
            Get(req, res)
            break
        case 'POST':
            Post(req, res)
            break
        default:
            res.status(405).end() //Method Not Allowed
            break
    }

}
