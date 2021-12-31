import type { NextApiRequest, NextApiResponse } from 'next'
const jwt = require('jsonwebtoken');

export default class Middleware {
    header = ''
    token = ''
    decoded = {
        id: 0,
        username: '',
        firstname: '',
        lastname: '',
        fullname: '',
        email: '',
        iat: 0,
        exp: 0
    }
    req: any;
    res: any;
    constructor(req: any, res: any) {
        this.req = req
        this.res = res
        this.header = this.req?.headers?.authorization || '';
        this.token = this.header?.split(/\s+/).pop() || '';
    }
    user() {
        return this.decoded
    }
    middleware() {
        try {
            this.decoded = jwt.verify(this.token, process.env.NEXT_PUBLIC_JWT_KEY);
            return false;
        } catch (err) {
            let __res = {
                status: {
                    error: true,
                    message: 'Please login to your account.'
                },
                timestamp: Math.floor(Date.now() / 1000)
            }
            this.res.status(511).json(__res)
            return true;
        }
    }
}
