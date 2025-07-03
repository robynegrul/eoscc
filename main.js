import LenovoLegionSlim7Gen7Kb from "./lenovo/legion/slim7gen7.js";

let bSlider = document.getElementById("brightness-slider");
let bIndicator = document.getElementById("brightness-value");

let kb = null;

const updateUI = async () => {
    let connected = (kb ? true : false)
                    && kb.isOpen();

    connectBtn.hidden = connected;
    bSlider.hidden = !connected;
    bIndicator.hidden = !connected;

    if (!connected)
        return;

    bSlider.max = LenovoLegionSlim7Gen7Kb.maxBrightness;
    bSlider.min = LenovoLegionSlim7Gen7Kb.minBrightness;

    let brightness = await kb.getBrightness();
    bSlider.value = brightness;
    bIndicator.textContent = brightness;
}

const tryConnectDevice = async () => {
    kb = await LenovoLegionSlim7Gen7Kb.connectAuto();
    updateUI();
}


document.addEventListener("DOMContentLoaded", async () => {
    await tryConnectDevice();
});

let connectBtn = document.getElementById("connect-button");
connectBtn.addEventListener("click", async () => {
    kb = await LenovoLegionSlim7Gen7Kb.connectManual();
    await updateUI();
});

bSlider.addEventListener("input", async () => {
    const value = parseInt(bSlider.value, 10);
    bIndicator.textContent = value;
    await kb.setBrightness(value);
})