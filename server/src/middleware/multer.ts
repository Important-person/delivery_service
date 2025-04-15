import multer from "multer";
import path, { dirname } from "path";
import { Request } from "express";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));

const storageConfig = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadsDir = path.join(__dirname, '../uploads');
        cb(null, uploadsDir);
    },
    filename: (req, file, cb) => {
        const extName = path.extname(file.originalname);
        cb(null, file.fieldname + "-" + Date.now()  + extName);
    }
})

const filterFile = (req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
    if(["image/png", "image/jpg", "image/jpeg"].includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('Only image-type file'));
    }
}

const multerSettings = multer({storage: storageConfig, fileFilter: filterFile});

export default multerSettings;