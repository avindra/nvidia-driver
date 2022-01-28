const BASE = `https://www.nvidia.com`;


async function get_driver(beta) {
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

	return await get_link(BASE + DL[1]);
}


async function get_unstable() {
	const R = await fetch("https://forums.developer.nvidia.com/t/current-graphics-driver-releases/28500");
	const txt = await R.text();
	

	const result = txt.match(/Current beta release: <a href=".+" data-bbcode="true">.+<\/a> \(<a href="(.+)" data-bbcode="true">x86_64/);
	if (result) {
		return result[1]
	}
}

async function get_link(url) {
	const R = await fetch(url);
	const txt = await R.text();

	const USDL = txt.match(/href="(\/\/us\.down.+)"/);
	if (USDL) {
		return USDL[1];
	}
}


const [stable,beta,unstable] = await Promise.all([get_driver(), get_driver(true), get_unstable()]);
console.log(stable);
console.log(beta);
console.log(unstable);