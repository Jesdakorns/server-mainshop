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
    let id_product_review = 0

    try {

        const auth = new middleware(req, res);
        if (auth.middleware()) { return }

        let user = auth.user()

        let description = req.body.description || ''
        let rating = req.body.rating || 0
        let upload = req.body.upload || []
        let product_id = req.body.product_id || ''


        let textSqlProductsReview = `insert into product_review (rating, product_id , user_id , description, remove, created_at, updated_at) values (?,?,?,?,?,?,?)`
        let insertProductsReview = await db.query(
            textSqlProductsReview,
            [rating, product_id, user.id, description, "false", timestamp, timestamp]
        )
        console.log(`insertProducts.insertId`, typeof insertProductsReview.insertId)
        id_product_review = insertProductsReview.insertId

        if (id_product_review > 0) {

            upload.map(async (val: any, idx: number) => {
                let _val = JSON.parse(val)
                let textSqlPI = `insert into product_review_upload (type, url, size, product_review_id,product_id , created_at, updated_at) values (?,?,?,?,?,?,?)`
                let insertPI = await db.query(
                    textSqlPI,
                    [_val.type, _val.path, _val.size, id_product_review, product_id, timestamp, timestamp]
                )
            })

        }

        textSqlProductsReview = `
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
        where pr.id = ? and pr.product_id = ? and pr.remove = "false"`
        let getProductsReview = await db.query(
            textSqlProductsReview,
            [id_product_review, product_id]
        )


        let textSqlProductsReviewUpload = `
        select 
            id,
            type,
            url,
            size,
            created_at,
            updated_at 
        from product_review_upload 
        where product_review_id  = ?`
        let getProductsReviewUpload = await db.query(
            textSqlProductsReviewUpload,
            [id_product_review]
        )



        getProductsReview[0].product_review_upload = getProductsReviewUpload

        __res = {
            status: {
                error: false,
                message: ''
            },
            product_review: getProductsReview[0],
            timestamp: Math.floor(Date.now() / 1000)
        }
        res.status(200).json(__res)
        return;
    } catch (err) {
        if (!id_product_review) {

            let textSqlPCI = `delete from product_review where id = ?`
            let deletePCI = await db.query(
                textSqlPCI,
                [id_product_review]
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

    function newFunction(upload: any) {
        console.log(`upload`, upload);
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
