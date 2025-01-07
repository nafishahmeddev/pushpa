import multer from "multer";
const UploadMiddleware = (dest = "/tmp/") => multer({ dest: dest })

export default UploadMiddleware;
