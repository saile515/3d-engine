import MeshFromOBJ from "../utils/MeshFromOBJ";
import Object from "../core/Object";
import Shader from "../components/Shader";
import Texture from "../components/Texture";
import TextureFromImg from "../utils/TextureFromImg";
import Transform from "../components/Transform";
import readFile from "../utils/readFile";

export default class Skybox extends Object {
	constructor() {
		super();
		this.init();
	}

	private async init() {
		const mesh = await MeshFromOBJ("/models/skybox.obj");
		this.addComponent(mesh);

		const texture = await TextureFromImg("/images/skybox1.png");
		this.addComponent(texture);

		const vertCode = await readFile("/shaders/vertex/shader.vert");
		const fragCode = await readFile("/shaders/fragment/skyboxShader.frag");
		const shader = new Shader(vertCode, fragCode);
		this.addComponent(shader);

		this.getComponent<Transform>(Transform).scale.setAll(500);
		this.getComponent<Transform>(Transform).position =
			engine.scene.camera.getComponent<Transform>(Transform).position;
	}

	update() {
		super.update();
		this.getComponent<Transform>(Transform).position =
			engine.scene.camera.getComponent<Transform>(Transform).position;
	}
}
