const ToolEle = document.getElementById('toolbar') as HTMLDivElement;

export class ToolBoard {
	private tool: string;
	private toolEle: HTMLDivElement;
	private toolList: string[];
	private toolMap: Map<string, HTMLButtonElement>;
	private clickCallback: (tool: string) => void;

	constructor() {
		this.tool = "";
		this.toolEle = ToolEle;
		this.toolList = [ 'dxf','line', 'circle', 'point', 'dimension'];
		this.toolMap = new Map();
		this.clickCallback = () => { };
		this.init();
	}

	private init() {
		this.toolList.forEach((tool) => {
			const div = document.createElement('div');
			div.classList.add('tool');
			const button = document.createElement('button');
			button.classList.add('btn');
			button.id = tool;
			button.classList.add('btn-light');
			button.innerHTML = tool;
			button.onclick = () => this.changeTool(tool);
			div.appendChild(button);
			this.toolEle.appendChild(div);
			this.toolMap.set(tool, button);
		});
	}

	private changeTool(tool: string) {
		this.tool = tool;
		// Call the callback with the updated tool
		this.clickCallback(tool);
	}

	public getTool() {
		return this.tool;
	}

	public click(callback: (tool: string) => void) {
		this.clickCallback = callback;
	}
}

export default ToolBoard;
