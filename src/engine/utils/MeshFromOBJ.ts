import Mesh from "../components/Mesh";
import { OBJ } from "webgl-obj-loader";
import readFile from "./readFile";

export default async function MeshFromOBJ(path: string) {
	const meshData = new OBJ.Mesh(await readFile(path));

	const mesh = new Mesh(meshData.vertices, meshData.indices, meshData.vertexNormals);
	return mesh;
}
