import type { NextApiRequest, NextApiResponse } from 'next'
import middleware from '@middleware'
const db = require('@database');
import { uploadFile } from '@lib/upload'

export const config = {
    api: {
        bodyParser: false
    }
};


type Data = {
    status: {
        success: boolean,
        message: string,
    },
    data?: object,
    timestamp: number

}



const post = async (req: NextApiRequest, res: NextApiResponse) => {
    let __res = {}

    try {
        const auth = new middleware(req, res);
        if (auth.middleware()) { return }
        
        let fileImage = await uploadFile(req, `image`, ["jpg", "jpeg", "png", "pdf"])

     
        __res = {
            status: {
                error: false,

                message: ''
            },
            fileImage,
            timestamp: Math.floor(Date.now() / 1000)
        }
        res.status(200).json(__res)

    } catch (err) {
        let __res = {
            status: {
                error: true,
                message: `Upload image error. *${err}`,
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
