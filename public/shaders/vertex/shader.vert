attribute vec3 vertexPosition;
attribute vec3 vertexNormal;

uniform mat4 projectionMatrix;
uniform mat4 viewMatrix;
uniform mat4 modelMatrix;
uniform mat4 normalMatrix;

varying highp vec3 vLighting;

void main() {
    gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4(vertexPosition, 1.0);

    highp vec3 ambientLight = vec3(0.3, 0.3, 0.3);
    highp vec3 directionalLightColor = vec3(0.7, 0.65, 0.6);
    highp vec3 directionalVector = normalize(vec3(1.0, -1.0, 1.0));

    highp vec4 transformedNormal = normalMatrix * vec4(vertexNormal, 1.0);

    highp float directional = max(dot(transformedNormal.xyz, directionalVector), 0.0);
    vLighting = ambientLight + (directionalLightColor * directional);
}