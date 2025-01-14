export default class TimezoneHelper{
    static convertOffsetToTimezoneFormat(offsetInMinutes?: string) {
        const offset: number = Number(offsetInMinutes || 0);
        const sign = offset >= 0 ? "+" : "-";
        const hours = Math.floor(Math.abs(offset) / 60);
        const minutes = Math.abs(offset) % 60;
        return `${sign}${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
    }
}