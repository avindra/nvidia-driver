const BASE = `https://www.nvidia.com`;

async function getDriver(beta) {
	const isLinux = Deno.build.os === 'linux';
	const params = new URLSearchParams("psid=101&pfid=845&rpf=1&lid=1&ctk=0&dtid=17");

	params.set("osid", isLinux ? 12 : 135);
	params.set("dtcid", isLinux ? 0 : 1);

	if (!isLinux && beta) {
		params.set('dtid', 18);
	} else if (beta || !isLinux) {
		params.set('dtid', 1);
	}

	const URI = new URL(`${BASE}/Download/processDriver.aspx?` + params.toString());

	const r = await fetch(URI);
	const driver_url = await r.text();


	const r_D = await fetch(driver_url);
	const rBody = await r_D.text();

	const DL = rBody.match(/href="(.+)" id="lnkDwnldBtn"/);
	if (!DL) {
		throw new Error("fail to parse")
	}

	const r_DL = await fetch(BASE + DL[1]);
	const rDLBody = await r_DL.text();

	const USDL = rDLBody.match(/href="(\/\/us\.down.+)"/);
	if (USDL) {
		return USDL[1];
	}
}

const [stable,beta] = await Promise.all([getDriver(), getDriver(true)]);
console.log(stable);
console.log(beta);