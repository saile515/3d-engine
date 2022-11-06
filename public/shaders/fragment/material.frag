varying highp vec3 vLighting;
varying highp vec3 vVertexColor;

void main(void) {
    gl_FragColor = vec4(vVertexColor * vLighting, 1);  
}