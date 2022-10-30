attribute vec3 vertexPosition;

uniform mat4 projectionMatrix;
uniform mat4 cameraMatrix;
uniform mat4 modelMatrix;

void main() {
    gl_Position = projectionMatrix * cameraMatrix * modelMatrix * vec4(vertexPosition, 1.0);
}