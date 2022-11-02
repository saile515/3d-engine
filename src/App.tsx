import { useEffect, useState } from "react";

import Init from "./game/main";

export interface UIState {
	fps: number;
}

function App() {
	const [uiState, setUiState] = useState<UIState>({ fps: 0 });

	useEffect(() => {
		Init(setUiState);
	}, []);

	return (
		<div className="App">
			<canvas id="glCanvas"></canvas>
			<div style={{ zIndex: 10, position: "fixed", top: 0, display: "flex" }}>
				<p style={{ backgroundColor: "#ffffff99", padding: "0.5rem", display: "inline" }}>{uiState.fps}</p>
			</div>
		</div>
	);
}

export default App;
