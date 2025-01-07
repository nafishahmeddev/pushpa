import multer from "multer";
import crypto from "crypto";


const UploadMiddleware = (dest = "/tmp/") => {
    const storage = multer.diskStorage({
        destination: function (req, file, cb) {
            cb(null, dest)
        },
        filename: function (req, file, cb) {
            cb(null, crypto.randomUUID() + "-" + file.originalname)
        }
    })
    return multer({ storage: storage })
}

export default UploadMiddleware;
