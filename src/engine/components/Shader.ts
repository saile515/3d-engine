import Component from "../core/Component";
import { ProgramInfo } from "../core/Scene";

export default class Shader extends Component {
	vertexShader: string;
	fragmentShader: string;
	programInfo: ProgramInfo;
	program: WebGLProgram;

	constructor(vertexShader: string, fragmentShader: string) {
		super();
		this.vertexShader = vertexShader;
		this.fragmentShader = fragmentShader;

		this.init();
	}

	init() {
		const vertShader = gl.createShader(gl.VERTEX_SHADER)!;
		gl.shaderSource(vertShader, this.vertexShader);
		gl.compileShader(vertShader);

		// Create fragment shader
		const fragShader = gl.createShader(gl.FRAGMENT_SHADER)!;
		gl.shaderSource(fragShader, this.fragmentShader);
		gl.compileShader(fragShader);

		// Create a shader program
		const shaderProgram = gl.createProgram()!;
		gl.attachShader(shaderProgram, vertShader);
		gl.attachShader(shaderProgram, fragShader);
		gl.linkProgram(shaderProgram);

		// Get memory locations for GPU communications
		this.programInfo = {
			program: shaderProgram,
			attributes: {
				vertexPosition: gl.getAttribLocation(shaderProgram, "aVertexPosition"),
				vertexNormal: gl.getAttribLocation(shaderProgram, "aVertexNormal"),
				texturePosition: gl.getAttribLocation(shaderProgram, "aTexturePosition"),
			},
			uniforms: {
				projectionMatrix: gl.getUniformLocation(shaderProgram, "uProjectionMatrix"),
				viewMatrix: gl.getUniformLocation(shaderProgram, "uViewMatrix"),
				modelMatrix: gl.getUniformLocation(shaderProgram, "uModelMatrix"),
				normalMatrix: gl.getUniformLocation(shaderProgram, "uNormalMatrix"),
				sampler: gl.getUniformLocation(shaderProgram, "uSampler"),
			},
		};
	}
}
