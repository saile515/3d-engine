import Mesh from "../components/Mesh";
import OBJFile from "obj-file-parser";
import Vector3 from "../core/Vector3";
import readFile from "./readFile";

export default async function MeshFromOBJ(path: string) {
	const data = new OBJFile(await readFile(path)).parse();
	if (data.models.length > 1) throw new Error("Only pass object files with one object.");
	const vertices = data.models[0].vertices.map((vertex) => new Vector3(vertex.x, vertex.y, vertex.z));
	const indicesRaw = data.models[0].faces.map((face) => face.vertices.map((vertex) => vertex.vertexIndex - 1));
	const indices = indicesRaw.reduce((previous, current) => [...previous, ...current]);

	const normalsIndicesRaw = data.models[0].faces.map((face) => face.vertices.map((vertex) => vertex.vertexNormalIndex - 1));
	const normalsIndices = normalsIndicesRaw.reduce((previous, current) => [...previous, ...current]);
	const normalsRaw = data.models[0].vertexNormals.map((vertex) => new Vector3(vertex.x, vertex.y, vertex.z));
	const normals = normalsIndices.map((index) => normalsRaw[index]);

	const mesh = new Mesh(vertices, indices, normals);
	return mesh;
}
