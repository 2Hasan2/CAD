// tool bar 
const ToolEle = document.getElementById('toolbar') as HTMLDivElement;

// Tool bar
export class ToolBoard {
	private tool: string;
	private toolEle: HTMLDivElement;
	private toolList: string[];
	private toolMap: Map<string, HTMLButtonElement>;

	constructor() {
		this.tool = ""
		this.toolEle = ToolEle;
		this.toolList = ['line', 'circle', 'point'];
		this.toolMap = new Map();
		this.init();
	}

	private init() {
		this.toolList.forEach((tool) => {
			const div = document.createElement('div');
			div.classList.add('tool');
			const button = document.createElement('button');
			button.classList.add('btn');
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
	}

	public getTool() {
		return this.tool;
	}
}

export default ToolBoard;