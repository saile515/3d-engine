import MeshFromOBJ from "../utils/MeshFromOBJ";
import Object from "../core/Object";
import Texture from "../components/Texture";
import TextureFromImg from "../utils/TextureFromImg";
import Transform from "../components/Transform";

export default class Skybox extends Object {
	constructor() {
		super();
		this.init();
	}

	async init() {
		const mesh = await MeshFromOBJ("/models/skybox.obj");
		this.addComponent(mesh);
		const texture = await TextureFromImg("/images/skybox1.png");
		this.addComponent(texture);
		this.getComponent<Transform>(Transform).scale.setAll(500);
		this.getComponent<Transform>(Transform).position = engine.scene.camera.getComponent<Transform>(Transform).position;
	}

	update() {
		super.update();
		this.getComponent<Transform>(Transform).position = engine.scene.camera.getComponent<Transform>(Transform).position;
	}
}
