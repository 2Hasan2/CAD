class InfiniteCanvas {
	private canvas: HTMLCanvasElement;
	ctx: CanvasRenderingContext2D;
	private offsetX: number;
	private offsetY: number;
	private scale: number;
	private mouseX: number;
	private mouseY: number;
	private isMouseDown: boolean;
	private isDrawing: boolean;
	private ClickedOn: [number, number][]

	constructor(canvas: HTMLCanvasElement) {
		this.canvas = canvas;
		this.ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
		this.offsetX = 0;
		this.offsetY = 0;
		this.scale = 50;
		this.mouseX = 0;
		this.mouseY = 0;
		this.isMouseDown = false;
		this.isDrawing = true;
		this.ClickedOn = []
		this.init();
		this.render();
	}

	private init() {
		this.canvas.width = window.innerWidth;
		this.canvas.height = window.innerHeight;
		this.canvas.addEventListener('mousedown', this.handleMouseDown.bind(this));
		this.canvas.addEventListener('mousemove', this.handleMouseMove.bind(this));
		this.canvas.addEventListener('mouseup', this.handleMouseUp.bind(this));
		this.canvas.addEventListener('wheel', this.handleMouseWheel.bind(this));
		window.addEventListener('resize', () => {
			this.canvas.width = window.innerWidth;
			this.canvas.height = window.innerHeight;
			this.render();
		});
	}

	private render() {
		this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
		this.drawGrid();
		this.drawAxes();
	}

	public PosToCanvas(x:number, y:number):[number, number]{
		let up = this.canvas.height / 2 + this.offsetY
		let left = this.canvas.width / 2 + this.offsetX
		return [x + left, (-y + up)]
	}

	private drawGrid() {
		const centerX = this.canvas.width / 2 + this.offsetX;
		const centerY = this.canvas.height / 2 + this.offsetY;

		// draw lines for the grid
		this.ctx.strokeStyle = '#ddd';
		this.ctx.beginPath();
		for (let i = centerX % this.scale; i < this.canvas.width; i += this.scale) {
			this.ctx.moveTo(i, 0);
			this.ctx.lineTo(i, this.canvas.height);
		}
		for (let i = centerY % this.scale; i < this.canvas.height; i += this.scale) {
			this.ctx.moveTo(0, i);
			this.ctx.lineTo(this.canvas.width, i);
		}
		this.ctx.stroke();
	}

	private drawAxes() {
		const centerX = this.canvas.width / 2 + this.offsetX;
		const centerY = this.canvas.height / 2 + this.offsetY;

		// draw the x-axis
		this.ctx.strokeStyle = 'black';
		this.ctx.beginPath();
		this.ctx.moveTo(centerX, 0);
		this.ctx.lineTo(centerX, this.canvas.height);
		this.ctx.stroke();

		// draw the y-axis
		this.ctx.beginPath();
		this.ctx.moveTo(0, centerY);
		this.ctx.lineTo(this.canvas.width, centerY);
		this.ctx.stroke();
	}


	private handleMouseDown(event: MouseEvent) {
		this.isMouseDown = true;
		this.mouseX = event.clientX;
		this.mouseY = event.clientY;
		if (this.isDrawing) {
			this.ClickedOn.unshift(this.getMousePosition(event))
			if (this.ClickedOn.length == 2) {
				console.log(this.ClickedOn);
				// draw
				this.ClickedOn.length = 0
			}
		}
	}

	private handleMouseMove(event: MouseEvent) {
		if (this.isMouseDown && !this.isDrawing) {
			const deltaX = event.clientX - this.mouseX;
			const deltaY = event.clientY - this.mouseY;
			this.offsetX += deltaX;
			this.offsetY += deltaY;
			this.mouseX = event.clientX;
			this.mouseY = event.clientY;
			this.render();
		}
	}

	private handleMouseUp() {
		this.isMouseDown = false;
	}

	private handleMouseWheel(event: WheelEvent) {
		// max scale is 100 and min	scale is 5
		let [max, min]=[200, 10]
		this.scale += event.deltaY > 0 ? -1 : 1;
		if (this.scale < min) {
			this.scale = min;
		} else if (this.scale > max) {
			this.scale = max;
		}
		this.render();
		event.preventDefault();
		console.log(this.scale);
		
	}


	public getMousePosition(event: MouseEvent): [number, number] {
		const rect = this.canvas.getBoundingClientRect();
		const mouseX = (event.clientX - rect.left - this.canvas.width / 2 - this.offsetX)
		const mouseY = -(event.clientY - rect.top - this.canvas.height / 2 - this.offsetY)
		return [mouseX, mouseY];
	}

	// draw method
	public StartDrawing() {
		this.isDrawing = true
	}
}

export default InfiniteCanvas;
