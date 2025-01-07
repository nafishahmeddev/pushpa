import path from "path";

export function uploadPath(filename = ""){
    return path.join(process.env.UPLOAD_PATH || "", filename);
}