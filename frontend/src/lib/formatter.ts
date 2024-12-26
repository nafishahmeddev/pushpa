import moment from "moment";

const formatter = new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
});
export default class Formatter {
    static money(amount: number) {
        return formatter.format(amount);
    }

    static datetime(datetime: string | Date) : string {
        return datetime ? moment(datetime).format("DD/MM/YYYY hh:mm:ss A") : "";
    }

    static time(datetime: string | Date) : string {
        return datetime ? moment(datetime).format("hh:mm:ss A") : "";
    }

    static date(datetime: string | Date) : string {
        return datetime ? moment(datetime).format("DD/MM/YYYY") : "";
    }
}