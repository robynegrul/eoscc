export const hidConnectAuto = async (vid, pid) => {
    try {
        const devs = await navigator.hid.getDevices();
        let hnd = devs.find(
            (d) => d.vendorId === vid
                && d.productId === pid
        );

        if (!hnd) {
            console.log("Device needs manual connection");
            return null;
        }

        await hnd.open();
        console.log(`Connectedd to ${hnd.productName}`);
        return hnd;
    } catch (error) {
        console.log(`Failed to connect: ${error.message}`);
        return null;
    }
};

export const hidConnectManual = async (vid, pid) => {
    try {
        const filters = [{
            vendorId: vid,
            productId: pid,
        }];

        const devs = await navigator.hid.requestDevice({filters});
        if (devs.length === 0) {
            console.log("No matching device selected.");
            return null;
        }

        let hnd = devs[0];
        await hnd.open();

        console.log(`Connected to ${hnd.productName}`);
        return hnd;
    } catch (error) {
        console.log(`Failed to connect: ${error.message}`);
        return null;
    }
};