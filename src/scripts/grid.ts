import { Line, Circle, Shape, Arc } from './interfaces/Shapes';

class CADGrid {
    private canvas: HTMLCanvasElement;
    ctx: CanvasRenderingContext2D;
    private zoomLevel: number;
    private panStartX: number;
    private panStartY: number;
    private startPoint: [number, number];
    private IsStartPointSet: boolean = true;
    private isPanning: boolean;
    private panX: number;
    private panY: number;
    private scale: number;
    private shapes: Shape[] = [];
    private moveHand: boolean = false;
    private currShape: string = '';
    private Draw: any;

    constructor(canvasId: string) {
        this.canvas = document.getElementById(canvasId) as HTMLCanvasElement;
        this.ctx = this.canvas.getContext('2d')!;
        this.zoomLevel = 3.5;
        this.panStartX = 0;
        this.panStartY = 0;
        this.startPoint = [0, 0];
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
        const deltaX = event.clientX - this.panStartX;
        const deltaY = event.clientY - this.panStartY;

        this.panStartX = event.clientX;
        this.panStartY = event.clientY;
        
        if (this.isPanning && this.moveHand) {
            this.panX += deltaX;
            this.panY += deltaY;
            this.drawGrid();
        }
        else if (this.isPanning && !this.moveHand) {
            if (this.IsStartPointSet) {
                this.startPoint = [Math.round((event.clientX - this.panX) / this.zoomLevel), Math.round((event.clientY - this.panY) / this.zoomLevel)];
                this.IsStartPointSet = false;
            }
            this.panStartX = Math.round((event.clientX - this.panX) / this.zoomLevel);
            this.panStartY = Math.round((event.clientY - this.panY) / this.zoomLevel);
            this.drawGrid();
            if (this.currShape === 'line') {
                console.log(!this.moveHand, this.isPanning);
                let line = new Line(this.startPoint[0],this.startPoint[1],this.panStartX, this.panStartY, 'red');
                this.drawShape(line);
                this.Draw = line;
            }
        }
    }

    setCurrShape(string: string) {
        if (string === 'line') {
            this.currShape = 'line';
        }else if (string === 'circle') {
            this.currShape = 'circle';
        }else if (string === 'arc') {
            this.currShape = 'arc';
        }
    }

    private handlePanEnd() {
        this.IsStartPointSet = true;
        this.isPanning = false;
        // save shape
        if (!this.Draw) return;
        if (this.currShape === 'line') {
            this.shapes.push(this.Draw);
            this.Draw = null;
        }
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

    private showCoordinates(event: MouseEvent) {
        const x = Math.round((event.clientX - this.panX) / this.zoomLevel);
        const y = -Math.round((event.clientY - this.panY) / this.zoomLevel);
        const coordinates = `(${x}, ${y})`;
        document.getElementById('position')!.innerHTML = coordinates;
    }

    private moveToCenter() {
        this.panX = this.canvas.width / 2;
        this.panY = this.canvas.height / 2;
        this.zoomLevel = 3.5;
        this.drawGrid();
    }

    getShapes() {
        return this.shapes;
    }

    drawShapes() {
        this.shapes.forEach(shape => {
            shape.draw(this.ctx);
        });
    }

    drawShape(shape: Shape) {
        shape.draw(this.ctx);
    }

    toggleMoveHand() {
        this.moveHand = !this.moveHand;
        this.canvas.style.cursor = this.moveHand ? 'move' : 'default';
    }
}

// Create an instance of CADGrid with the canvas ID
const cadGrid = new CADGrid('canvas');

// cadGrid.addShape(new Line(0, 0, 100, 100, 'red'));
// cadGrid.addShape(new Circle(0, 0, 50, 'blue'));
// cadGrid.addShape(new Circle(100, 100, 50, 'green'));
// cadGrid.addShape(new Arc(50, 50, 50, Math.PI / 2, Math.PI, 'green'));
// cadGrid.addShape(new Arc(50, 50, 50, Math.PI * 1.5, 0, 'red'));

// cadGrid.drawShapes();

// console.log(cadGrid.getShapes());



export default cadGrid;