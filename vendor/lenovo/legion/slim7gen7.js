const LENOVO_VID = 0x048D;
const ITEDEV_PID = 0xC977;

const BRIGHTNESS_MIN = 0;
const BRIGHTNESS_MAX = 9;

const REPORT_SIZE = 960;
const REPORT_ID = 0x07;

const Commands = {
    SET_BRIGHTNESS: 0x0CE,
    GET_BRIGHTNESS: 0x0CD,
};

const clamp = (x, a, b) => Math.min(Math.max(x, a), b);

export class LenovoLegionSlim7Gen7Kb {
    #handle;

    static get VID() { return LENOVO_VID; };
    static get PID() { return ITEDEV_PID; };

    static get minBrightness() { return BRIGHTNESS_MIN; };
    static get maxBrightness() { return BRIGHTNESS_MAX; };

    constructor(hnd) {
        this.#handle = hnd;
    };

    isOpen = () => this.#handle && this.#handle.opened;

    setBrightness = async (value) => {
        if (!this.isOpen()) {
            console.log("Device not connected");
            return;
        }

        if (!(Number.isInteger(value))) {
            console.log("Input in not a number");
            return;
        }

        value = clamp(value, BRIGHTNESS_MIN, BRIGHTNESS_MAX);

        const buffer = new Uint8Array(REPORT_SIZE);
        buffer.set([Commands.SET_BRIGHTNESS, 0xC0, 0x03, value], 0);

        try {
            await this.#handle.sendFeatureReport(REPORT_ID, buffer)
            console.log(`Set brightness to ${value}`);
        } catch (error) {
            console.log(`Failed to send feature report: ${error.message}`);
            return;
        }
    };

    getBrightness = async () => {
        if (!this.isOpen()) {
            console.log("Device not connected")
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
}