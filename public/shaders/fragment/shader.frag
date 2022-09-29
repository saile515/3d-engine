varying highp vec3 vLighting;

void main(void) {
    gl_FragColor = vec4(1.0 * vLighting, 1.0);
}