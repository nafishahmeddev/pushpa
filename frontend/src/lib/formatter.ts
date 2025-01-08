import AuthStore, { AuthStateLoggedIn } from "@app/store/auth";
import moment from "moment";


export default class Formatter {
    static country(): string {
        const auth = AuthStore.getState<AuthStateLoggedIn>();
        if (auth.loggedIn && auth.user.restaurant?.country) {
            return auth.user.restaurant?.country as string;
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

    static phone(number: string): string {
        try {
            return number.toString();
        } catch {
            return number;
        }
    }
}