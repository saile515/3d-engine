export default async function readFile(path: string) {
	let file: Promise<string> = new Promise((resolve, reject) => {
		fetch(path)
			.then((res) => res.text())
			.then((data) => {
				resolve(data);
			});
	});

	return await file;
}
