import AuthStore, { AuthStateLoggedIn } from "@app/store/auth";
import { CountryCode, parsePhoneNumberWithError } from "libphonenumber-js";
import moment from "moment";


export default class Formatter {
    static country(): string {
        const auth = AuthStore.getState<AuthStateLoggedIn>();
        if (auth.loggedIn && auth.user.restaurant?.country) {
            return auth.user.restaurant?.country as CountryCode;
        }
        return "IN";
    }

    static currency(): string {
        const auth = AuthStore.getState<AuthStateLoggedIn>();
        if (auth.loggedIn && auth.user.restaurant?.country) {
            return auth.user.restaurant?.currency;
        }
        return "INR";
    }
    static money(amount: number, currency?: string) {
        const formatter = new Intl.NumberFormat("en-GB", {
            style: "currency",
            currency: currency ?? Formatter.currency(),
        });
        return formatter.format(amount);
    }

    static datetime(datetime: string | Date): string {
        return datetime ? moment(datetime).format("DD/MM/YYYY hh:mm:ss A") : "";
    }

    static time(datetime: string | Date): string {
        return datetime ? moment(datetime).format("hh:mm:ss A") : "";
    }

    static date(datetime: string | Date): string {
        return datetime ? moment(datetime).format("DD/MM/YYYY") : "";
    }

    static phone(number: string, country: CountryCode = "IN"): string {
        try {
            const parsed = parsePhoneNumberWithError(number, country ?? Formatter.country());
            const formatted = parsed.format("INTERNATIONAL");
            return formatted;
        } catch {
            return number;
        }
    }
}