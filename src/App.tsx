import Init from "./engine/main";
import { useEffect } from "react";

function App() {
	useEffect(() => {
		Init();
	}, []);

	return (
		<div className="App">
			<canvas id="glCanvas"></canvas>
		</div>
	);
}

export default App;
