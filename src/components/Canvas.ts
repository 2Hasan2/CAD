class InfiniteCanvas {
	private canvas: HTMLCanvasElement;
	ctx: CanvasRenderingContext2D;
	private centerX: number;
	private centerY: number;
	private scale: number;
	private mouseX: number;
	private mouseY: number;
	private isMouseDown: boolean;
	private Draws: any[];

	constructor(canvas: HTMLCanvasElement) {
		this.canvas = canvas;
		this.ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
		this.centerX = 0;
		this.centerY = 0;
		this.scale = 50;
		this.mouseX = 0;
		this.mouseY = 0;
		this.isMouseDown = false;
		this.Draws = [];
		this.init();
		this.render();
		this.canvas.addEventListener('mousemove', this.handleMouseMove.bind(this));
		this.canvas.addEventListener('mousedown', this.handleMouseDown.bind(this));
		this.canvas.addEventListener('mouseup', this.handleMouseUp.bind(this));
		this.canvas.addEventListener('wheel', this.handleMouseWheel.bind(this));
		window.addEventListener('resize', () => {
			this.init()
			this.render();
		});
	}

	private init() {
		// we must handle the canvas size to be the same as the window size but make sure it even numbers to avoid the blurry lines
		this.canvas.width = Math.floor(window.innerWidth / 2) * 2;
		this.canvas.height = Math.floor(window.innerHeight / 2) * 2;
		// translate the canvas to the center of the screen
		this.ctx.translate(this.canvas.width / 2, this.canvas.height / 2);
		// Invert the y-axis to match the cartesian coordinate system
		this.ctx.scale(1, -1);
	}

	private render() {
		this.ctx.clearRect(
			-this.canvas.width / 2,
			-this.canvas.height / 2,
			this.canvas.width,
			this.canvas.height
		);
		this.drawGrid();
		this.Draws.forEach((draw: any) => {
			draw.toCTX()
		});
	}

	private drawGrid() {
		let [dx , dy] = [this.canvas.width / 2, this.canvas.height / 2];
		this.ctx.beginPath();
		// left vertical line
		for (let i = this.centerX; i <= dx; i += this.scale) {
			this.ctx.moveTo(i, -dy);
			this.ctx.lineTo(i, dy);
		}
		// right vertical line
		for (let i = this.centerX; i >= -dx; i -= this.scale) {
			this.ctx.moveTo(i, -dy);
			this.ctx.lineTo(i, dy);
		}

		// bottom horizontal line
		for (let i = this.centerY; i <= dy; i += this.scale) {
			this.ctx.moveTo(-dx, i);
			this.ctx.lineTo(dx, i);
		}
		// top horizontal line
		for (let i = this.centerY; i >= -dy; i -= this.scale) {
			this.ctx.moveTo(-dx, i);
			this.ctx.lineTo(dx, i);
		}

		this.ctx.stroke();
	}

	// mouse handling events
	private handleMouseDown(event: MouseEvent) {
		this.isMouseDown = true;
		this.mouseX = event.clientX;
		this.mouseY = event.clientY;
	}

	private handleMouseMove(event: MouseEvent) {
		if (this.isMouseDown) {
			const deltaX = event.clientX - this.mouseX;
			const deltaY = event.clientY - this.mouseY;
			this.centerX += deltaX;
			// why use - in the deltaY? because the canvas y-axis is inverted
			this.centerY -= deltaY;
			this.mouseX = event.clientX;
			this.mouseY = event.clientY;
			this.render();
		}
	}

	private handleMouseUp() {
		this.isMouseDown = false;
	}

	private handleMouseWheel(event: WheelEvent) {
		const scale = event.deltaY > 0 ? 1.1 : 0.9;
		this.scale *= scale;

		// get the mouse position before scaling
		const [mouseX, mouseY] = this.getMousePosition(event);
		this.centerX -= mouseX * (scale - 1);
		this.centerY += mouseY * (scale - 1);

		this.render();
		event.preventDefault();
	}

	// helper functions
	public getMousePosition(event: MouseEvent): [number, number] {
		const rect = this.canvas.getBoundingClientRect();
		const mouseX = (event.clientX - rect.left - this.canvas.width / 2 - this.centerX)
		const mouseY = -(event.clientY - rect.top - this.canvas.height / 2 - this.centerY)
		return [mouseX, mouseY];
	}


	// add shapes to the canvas
	private addDraw(draw: any) {
		this.Draws.push(draw);
	}
	
	public BindDraws(draws: any[]) {
		this.Draws.length = 0;
		draws.forEach((draw)=>{
			this.addDraw(draw)
		})
		this.render();
	}
}

export default InfiniteCanvas;
