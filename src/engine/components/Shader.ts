import Component from "../core/Component";

export interface ProgramInfo {
	program: WebGLProgram | null;
	attributes: {
		vertexPosition: number;
		vertexNormal: number;
		vertexColor?: number;
		texturePosition?: number;
	};
	uniforms: {
		projectionMatrix: WebGLUniformLocation | null;
		viewMatrix: WebGLUniformLocation | null;
		modelMatrix: WebGLUniformLocation | null;
		normalMatrix: WebGLUniformLocation | null;
		sampler?: WebGLUniformLocation | null;
	};
}

export default class Shader extends Component {
	private vertexShader: string;
	private fragmentShader: string;
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
		this.program = shaderProgram;

		// Get memory locations for GPU communications
		this.programInfo = {
			program: shaderProgram,
			attributes: {
				vertexPosition: gl.getAttribLocation(shaderProgram, "aVertexPosition"),
				vertexNormal: gl.getAttribLocation(shaderProgram, "aVertexNormal"),
				vertexColor: gl.getAttribLocation(shaderProgram, "aVertexColor"),
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
