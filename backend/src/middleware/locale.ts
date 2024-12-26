import {  INext, IRequest, IResponse, Language } from "@app/interfaces/vendors/express"

const SUPPORTED_LANGUAGES = ["en", "bn"]
export default function LocaleMiddleware(req: IRequest, res: IResponse, next: INext) {
    const languageHeader = req.headers["content-language"]
    let language = SUPPORTED_LANGUAGES[0]
    if (typeof languageHeader === "string" && SUPPORTED_LANGUAGES.includes((languageHeader as string))) {
        language = languageHeader
    }
    req.language = language as Language;
    return next()
}