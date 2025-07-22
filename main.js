import {
    hidConnectAuto, hidConnectManual,
    LenovoLegionSlim7Gen7Kb
} from "./vendor/devices.js"

const clamp = (x, a, b) => Math.min(Math.max(x, a), b);

let bSlider = document.getElementById("brightness-slider");
let bIndicator = document.getElementById("brightness-indicator");
// let bPanel = document.getElementById("brightness-panel");

let pSlider = document.getElementById("profile-slider");
let pIndicator = document.getElementById("profile-indicator");

let kb = null;

const updateUI = async () => {
    let connected = kb && kb.isOpen();

    console.log(connected ? "Connected" : "Not connected");

    connectBtn.style.visibility =
        connected ? 'hidden' : 'visible';
    // bPanel.style.visibility =
    //     connected ? 'visible' : 'hidden';

    if (!connected)
        return;

    let kbType = kb.constructor;

    bSlider.min = kbType.minBrightness;
    bSlider.max = kbType.maxBrightness;

    pSlider.min = kbType.minProfile;
    pSlider.max = kbType.maxProfile;

    let brightness = await kb.getBrightness();
    bSlider.value = brightness;
    bIndicator.textContent = brightness;

    let profile = await kb.getActiveProfile();
    pSlider.value = profile;
    pIndicator.textContent = profile;
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
    let value = parseInt(bSlider.value, 10);
    bIndicator.textContent = value;
    await kb.setBrightness(value);
})

pSlider.addEventListener("input", async () => {
    const value = parseInt(pSlider.value, 10);
    pIndicator.textContent = value;
    await kb.setActiveProfile(value);
})