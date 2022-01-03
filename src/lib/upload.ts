const formidable = require('formidable-serverless');
const slugify = require('slugify')
const path = require('path')
import { v4 as uuidv4 } from 'uuid';
import fs from 'fs'

const isFileValid = (file: any, valid: any) => {
    const type = file.type.split("/").pop();
    const validTypes = valid || ["jpg", "jpeg", "png", "pdf"];
    if (validTypes.indexOf(type) === -1) {
        return false;
    }
    return true;
};

export const uploadFile = async (req: any, pathDir: string, valid: string[]) => {

    const data = await new Promise((resolve, rejects) => {

        fs.mkdir(`public/${pathDir}`, { recursive: true }, (err) => {
            return console.log(`err`, err)
        })
        const form = formidable({
            multiples: true,
            uploadDir: `public/${pathDir}`
        })
        console.log(`form`, form)
        form.keepExtensions = true
        form.keepFileName = true
        form.on("fileBegin", (name: any, file: any) => {
            const isValid = isFileValid(file, valid);
            if (!isValid) {
                file.path = null
            } else {
                let pathC = []
                let type = file.type.split("/").pop();
                file.path = path.join(`public/${pathDir}`, slugify(`${Date.now()}-${uuidv4()}.${type}`))
                file.name = slugify(`${Date.now()}-${uuidv4()}.${type}`)
            }
        })
        form.on('file', (name: any, file: any) => {
            file.path = file.path.substring(7);
            file.path = file.path.replace("\\", "/")
        });
        form.parse(req, (err: any, fields: any, files: any) => {
            if (err) { console.log(`err`, err); return rejects(err); }
            resolve(files)
        })

    })
    return data

}