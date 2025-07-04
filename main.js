import {
    hidConnectAuto, hidConnectManual,
    LenovoLegionSlim7Gen7Kb
} from "./vendor/devices.js"

let bSlider = document.getElementById("brightness-slider");
let bIndicator = document.getElementById("brightness-value");
let bPanel = document.getElementById("brightness-panel");

let kb = null;

const updateUI = async () => {
    let connected = kb && kb.isOpen();

    console.log(connected ? "Connected" : "Not connected");

    connectBtn.style.visibility =
        connected ? 'hidden' : 'visible';
    bPanel.style.visibility =
        connected ? 'visible' : 'hidden';

    if (!connected)
        return;

    bSlider.max = LenovoLegionSlim7Gen7Kb.maxBrightness;
    bSlider.min = LenovoLegionSlim7Gen7Kb.minBrightness;

    let brightness = await kb.getBrightness();
    bSlider.value = brightness;
    bIndicator.textContent = brightness;
}

const tryConnectDevice = async () => {
    const hnd = await hidConnectAuto(
        LenovoLegionSlim7Gen7Kb.VID,
        LenovoLegionSlim7Gen7Kb.PID,
    );
    kb = new LenovoLegionSlim7Gen7Kb(hnd);
}

document.addEventListener("DOMContentLoaded", async () => {
    await tryConnectDevice();
    await updateUI();
});

let connectBtn = document.getElementById("connect-button");
connectBtn.addEventListener("click", async () => {
    const hnd = await hidConnectManual(
        LenovoLegionSlim7Gen7Kb.VID,
        LenovoLegionSlim7Gen7Kb.PID,
    );
    kb = new LenovoLegionSlim7Gen7Kb(hnd);
    await updateUI();
});

bSlider.addEventListener("input", async () => {
    const value = parseInt(bSlider.value, 10);
    bIndicator.textContent = value;
    await kb.setBrightness(value);
})