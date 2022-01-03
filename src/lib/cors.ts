import Cors from 'cors'

// Initializing the cors middleware

// Helper method to wait for a middleware to execute before continuing
// And to throw an error when an error happens in a middleware
export function runMiddleware(req: any, res: any, fn: any) {
    const cors = Cors(fn)
    
    return new Promise((resolve, reject) => {
        cors(req, res, (result: any) => {
            if (result instanceof Error) {
                return reject(result)
            }

            return resolve(result)
        })
    })
}

// async function handler(req: any, res: any) {
//     // Run the middleware
//     await runMiddleware(req, res, cors)

//     // Rest of the API logic
//     res.json({ message: 'Hello Everyone!' })
// }

// export default handler