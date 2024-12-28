import { store } from "@app/store";
import { AuthStateLoggedIn } from "@app/store/slices/auth";
import { CountryCode, parsePhoneNumberWithError } from "libphonenumber-js";
import moment from "moment";


export default class Formatter {
    static get country(): string {
        const state = store.getState();
        const auth = state.auth as AuthStateLoggedIn;
        if (auth.loggedIn && auth.user.restaurant?.country) {
            return auth.user.restaurant?.country as CountryCode;
        }
        return "IN";
    }

    static get currency(): string {
        const state = store.getState();
        const auth = state.auth as AuthStateLoggedIn;
        if (auth.loggedIn && auth.user.restaurant?.country) {
            return auth.user.restaurant?.currency;
        }
        return "INR";
    }
    static money(amount: number, currency?: string) {
        const formatter = new Intl.NumberFormat("en-IN", {
            style: "currency",
            currency: currency ?? Formatter.currency,
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
        const state = store.getState();
        const auth = state.auth as AuthStateLoggedIn;
        if (auth.loggedIn && auth.user.restaurant?.country) {
            country = auth.user.restaurant?.country as CountryCode;
        }
        const parsed = parsePhoneNumberWithError(number, country);
        const formatted = parsed.format("INTERNATIONAL");
        return formatted;
    }
}