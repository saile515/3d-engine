import Mesh from "../components/Mesh";
import { OBJ } from "webgl-obj-loader";
import OBJFile from "obj-file-parser";
import Vector3 from "../core/Vector3";
import readFile from "./readFile";

export default async function MeshFromOBJ(path: string) {
	const meshData = new OBJ.Mesh(await readFile(path));

	const mesh = new Mesh(meshData.vertices, meshData.indices, meshData.vertexNormals);
	return mesh;
}
