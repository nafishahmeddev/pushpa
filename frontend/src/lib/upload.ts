export function uploadUrl(filename = ""){
    return [import.meta.env.VITE_UPLOAD_URL, filename].filter(e=>!!e).join("/");
}