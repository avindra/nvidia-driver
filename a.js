const BASE = `https://www.nvidia.com`;

async function getDriver(beta) {
	const params = new URLSearchParams("psid=101&pfid=845&rpf=1&osid=12&lid=1&lang=en-us&ctk=0&dtid=17&dtcid=0");

	if (beta) {
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