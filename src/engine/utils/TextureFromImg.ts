import Texture from "../components/Texture";

export default function TextureFromImg(url: string) {
	const img = new Image();
	img.src = url;

	const texture = new Promise<Texture>((resolve) => {
		img.onload = () => {
			const canvas = document.createElement("canvas");
			const ctx = canvas.getContext("2d");

			canvas.width = img.width;
			canvas.height = img.height;

			ctx.drawImage(img, 0, 0);

			const imgData = ctx.getImageData(0, 0, img.width, img.height);

			resolve(new Texture(imgData.width, imgData.height, Array.from(imgData.data)));
		};
	});

	return texture;
}
