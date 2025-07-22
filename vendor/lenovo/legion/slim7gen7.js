const LENOVO_VID = 0x048D;
const ITEDEV_PID = 0xC977;

const REPORT_SIZE = 960;
const REPORT_ID = 0x07;

const Commands = {
    SET_ACTIVE_PRF: 0x0C8,
    GET_ACTIVE_PRF: 0x0CA,

    SAVE_PROFILE: 0x0CB,

    GET_BRIGHTNESS: 0x0CD,
    SET_BRIGHTNESS: 0x0CE,
};

export class LenovoLegionSlim7Gen7Kb {
    #handle;

    static get VID() { return LENOVO_VID; };
    static get PID() { return ITEDEV_PID; };

    static get minBrightness() { return 0; };
    static get maxBrightness() { return 9; };

    static get minProfile() { return 1; };
    static get maxProfile() { return 6; };

    constructor(hnd) {
        this.#handle = hnd;
    };

    isOpen = () => this.#handle && this.#handle.opened;

    #sendFeatureReport = async (report) => {
        if (!this.isOpen()) {
            console.log("Device not connected");
            return;
        }

        const buffer = new Uint8Array(REPORT_SIZE);
        buffer.set(report, 0);
        await this.#handle.sendFeatureReport(REPORT_ID, buffer);
    };

    setBrightness = async (value) => {
        if (!(Number.isInteger(value))) {
            console.log("Input in not a number");
            return;
        }

        try {
            await this.#sendFeatureReport(
                [Commands.SET_BRIGHTNESS, 0xC0, 0x03, value]
            );
            console.log(`Set brightness to ${value}`);
        } catch (error) {
            console.log(`Failed to send feature report: ${error.message}`);
            return;
        }
    };

    getBrightness = async () => {
        if (!this.isOpen()) {
            console.log("Device not connected");
            return;
        }

        const buffer = new Uint8Array(REPORT_SIZE);
        buffer.set([Commands.GET_BRIGHTNESS, 0xC0, 0x03], 0);

        try {
            await this.#handle.sendFeatureReport(REPORT_ID, buffer);
            const res = await this.#handle.receiveFeatureReport(REPORT_ID);
            const value = (new Uint8Array(res.buffer))[4];
            console.log(`Current brightness: ${value}`);
            return value;
        } catch (error) {
            console.log(`Failed to send feature report: ${error.message}`);
            return;
        }
    };

    setActiveProfile = async (id) => {
        try {
            await this.#sendFeatureReport(
                [Commands.SET_ACTIVE_PRF, 0xC0, 0x03, id]
            );
            console.log(`Set profile to ${id}`);
        } catch (error) {
            console.log(`Failed to send feature report: ${error.message}`);
            return;
        }
    }

    getActiveProfile = async () => {
        if (!this.isOpen()) {
            console.log("Device not connected");
            return;
        }

        const buffer = new Uint8Array(REPORT_SIZE);
        buffer.set([Commands.GET_ACTIVE_PRF, 0xC0, 0x03], 0);

        try {
            await this.#handle.sendFeatureReport(REPORT_ID, buffer);
            const res = await this.#handle.receiveFeatureReport(REPORT_ID);
            const value = (new Uint8Array(res.buffer))[4];
            console.log(`Current brightness: ${value}`);
            return value;
        } catch (error) {
            console.log(`Failed to send feature report: ${error.message}`);
            return;
        }
    };
}