import { Line, Circle, Shape } from './interfaces/Shapes';
import generateDXF from './functions/ToDXF';

class CADGrid {
    private canvas: HTMLCanvasElement;
    private ctx: CanvasRenderingContext2D;
    private zoomLevel: number;
    private panStartX: number;
    private panStartY: number;
    private isPanning: boolean;
    private panX: number;
    private panY: number;
    private scale: number;
    private shapes: Shape[] = [];

    constructor(canvasId: string) {
        this.canvas = document.getElementById(canvasId) as HTMLCanvasElement;
        this.ctx = this.canvas.getContext('2d')!;
        this.zoomLevel = 3.5;
        this.panStartX = 0;
        this.panStartY = 0;
        this.isPanning = false;
        this.panX = this.canvas.width / 2;
        this.panY = this.canvas.height / 2;
        this.scale = 5;

        // Initialize canvas
        this.setCanvasSize();
        this.setupEventListeners();
    }

    private setupEventListeners() {
        // zoom in and out
        this.canvas.addEventListener('wheel', this.handleZoom.bind(this));

        this.canvas.addEventListener('mousedown', this.handleMouseDown.bind(this));

        // mouse down, move and up
        this.canvas.addEventListener('mousemove', this.handlePanMove.bind(this));
        this.canvas.addEventListener('mouseup', this.handlePanEnd.bind(this));

        // window resize
        window.addEventListener('resize', this.setCanvasSize.bind(this));

        // when click on space key, move to center
        window.addEventListener('keydown', (event: KeyboardEvent) => {
            if (event.code === 'Space') {
                this.moveToCenter();
            }
        });
    }

    private handleMouseDown(event: MouseEvent) {
        this.handlePanStart(event);
    }

    private handleZoom(event: WheelEvent) {
        event.preventDefault();
        const zoomIntensity = 0.02;
        const wheel = event.deltaY < 0 ? 1 : -1;
        const zoom = Math.exp(wheel * zoomIntensity);

        this.zoomLevel = Math.max(3, Math.min(1000, this.zoomLevel * zoom));

        this.drawGrid();
    }

    private setCanvasSize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        this.panX = this.canvas.width / 2;
        this.panY = this.canvas.height / 2;

        this.drawGrid();
    }

    private handlePanStart(event: MouseEvent) {
        this.panStartX = event.clientX;
        this.panStartY = event.clientY;
        this.isPanning = true;
    }

    private handlePanMove(event: MouseEvent) {
        this.showCoordinates(event);
        if (this.isPanning) {
            const deltaX = event.clientX - this.panStartX;
            const deltaY = event.clientY - this.panStartY;

            this.panStartX = event.clientX;
            this.panStartY = event.clientY;

            this.panX += deltaX;
            this.panY += deltaY;

            this.drawGrid();
        }
    }

    private handlePanEnd(event: MouseEvent) {
        this.isPanning = false;
    }

    private drawGridLines(start: number, end: number, isVertical: boolean) {
        this.ctx.beginPath();
        for (let pos = start; pos <= -start; pos += this.scale) {
            isVertical ? this.ctx.moveTo(pos, start) : this.ctx.moveTo(start, pos);
            isVertical ? this.ctx.lineTo(pos, -start) : this.ctx.lineTo(-start, pos);
        }
        this.ctx.strokeStyle = '#ccc';
        this.ctx.stroke();
    }

    private drawGrid() {
        this.ctx.setTransform(1, 0, 0, 1, 0, 0);
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        this.ctx.setTransform(this.zoomLevel, 0, 0, this.zoomLevel, this.panX, this.panY);
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        this.ctx.lineWidth = 1 / this.zoomLevel;
        this.ctx.strokeStyle = '#000';

        this.drawGridLines(-this.canvas.width * this.scale, this.canvas.width * this.scale, true);
        this.drawGridLines(-this.canvas.height * this.scale, this.canvas.height * this.scale, false);

        this.ctx.fillStyle = 'red';
        this.ctx.beginPath();
        this.ctx.arc(0, 0, 3 / this.zoomLevel, 0, 2 * Math.PI);
        this.ctx.fill();

        this.drawShapes();
    }

    private drawShapes() {
        let line = new Line(0, 0, 100.2, 0, 'red');
        line.draw(this.ctx);
        let line2 = new Line(0, 0, 100, 0, 'green');
        line2.draw(this.ctx);
        let circle = new Circle(0, 0, 55, 'blue');
        circle.draw(this.ctx);

        // this.shapes.push(line, line2, circle);
        // console.log(this.shapes);
    }

    private showCoordinates(event: MouseEvent) {
        const x = Math.round((event.clientX - this.panX) / this.zoomLevel);
        const y = Math.round((event.clientY - this.panY) / this.zoomLevel);
        const coordinates = `(${x}, ${y})`;
        document.getElementById('position')!.innerHTML = coordinates;
    }

    private moveToCenter() {
        this.panX = this.canvas.width / 2;
        this.panY = this.canvas.height / 2;
        this.zoomLevel = 3.5;
        this.drawGrid();
    }
}

// Create an instance of CADGrid with the canvas ID
const cadGrid = new CADGrid('canvas');