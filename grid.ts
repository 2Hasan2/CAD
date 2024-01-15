import Line from './tools/Line';
import Circle from './tools/Circle';
import Rectangle from './tools/Rectangle';
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
    private lineTool: Line;
    private circleTool: Circle;
    private rectangleTool: Rectangle;
    private isToolSelected: boolean;
    private isDrawing: boolean;
    private endOfDrawing: boolean;
    private lineStartX: number;
    private lineStartY: number;
    private drawing: any[];

    constructor(canvasId: string) {
        this.canvas = document.getElementById(canvasId) as HTMLCanvasElement;
        this.ctx = this.canvas.getContext('2d')!;
        this.zoomLevel = 1;
        this.panStartX = 0;
        this.panStartY = 0;
        this.isPanning = false;
        this.panX = this.canvas.width / 2;
        this.panY = this.canvas.height / 2;
        this.scale = 5;

        // draw line
        this.isDrawing = false;
        this.endOfDrawing = true;
        this.isToolSelected = false;
        this.lineStartX = 0;
        this.lineStartY = 0;
        this.drawing = [];

        // Initialize tools
        this.lineTool = new Line(this.ctx);
        this.circleTool = new Circle(this.ctx);
        this.rectangleTool = new Rectangle(this.ctx);

        // Initialize canvas
        this.setCanvasSize();
        this.setupEventListeners();
    }

    private setupEventListeners() {
        // zoom in and out
        this.canvas.addEventListener('wheel', this.handleZoom.bind(this));

        // toggle isDrawing when click on key 'd'
        document.addEventListener('keydown', (event) => {
            if (event.key === 'd') {
                this.isToolSelected = !this.isToolSelected;
            }
        });

        this.canvas.addEventListener('mousedown', this.handleMouseDown.bind(this));

        // mouse down, move and up
        this.canvas.addEventListener('mousemove', this.handlePanMove.bind(this));
        this.canvas.addEventListener('mouseup', this.handlePanEnd.bind(this));

        // draw line
        this.canvas.addEventListener('mousemove', this.handleLineDraw.bind(this));
        this.canvas.addEventListener('mouseup', this.handleLineEnd.bind(this));

        // draw circle
        this.canvas.addEventListener('mousemove', this.handleCircleDraw.bind(this));
        this.canvas.addEventListener('mouseup', this.handleCircleEnd.bind(this));

        // draw rectangle
        this.canvas.addEventListener('mousemove', this.handleRectangleDraw.bind(this));
        this.canvas.addEventListener('mouseup', this.handleRectangleEnd.bind(this));

        // window resize
        window.addEventListener('resize', this.setCanvasSize.bind(this));
    }

    // handle mouse down for start drawing a line or handle pan
    private handleMouseDown(event: MouseEvent) {
        if (this.isToolSelected) {
            this.handleLineStart(event);
        } else {
            this.handlePanStart(event);
        }
    }

    // draw line
    private handleLineStart(event: MouseEvent) {
        this.isDrawing = true;
        this.endOfDrawing = !this.endOfDrawing;
        const { offsetX, offsetY } = event;
        if (!this.endOfDrawing) {
            this.lineStartX = offsetX / this.zoomLevel - this.panX / this.zoomLevel;
            this.lineStartY = offsetY / this.zoomLevel - this.panY / this.zoomLevel;
            console.log(this.lineStartX, this.lineStartY);
        }
    }

    private handleLineDraw(event: MouseEvent) {
        // Draw the line while the mouse moves
        if (this.isDrawing) {
            const { offsetX, offsetY } = event;
            const mouseX = offsetX / this.zoomLevel - this.panX / this.zoomLevel;
            const mouseY = offsetY / this.zoomLevel - this.panY / this.zoomLevel;

            // Draw line using the Line tool
            this.drawGrid();
            this.lineTool.drawLine(this.lineStartX, this.lineStartY, mouseX, mouseY);
        }
    }

    private handleLineEnd(event: MouseEvent) {
        if (this.endOfDrawing && this.isDrawing) {
            this.isDrawing = false;
            let line = {
                start: { x: this.lineStartX, y: this.lineStartY },
                end: { x: event.offsetX / this.zoomLevel - this.panX / this.zoomLevel, y: event.offsetY / this.zoomLevel - this.panY / this.zoomLevel }
            }
            console.log(line);
            this.saveDrawing(line);
        }
    }

    // draw circle
    private handleCircleDraw(event: MouseEvent) {
        if (this.isDrawing) {
            const { offsetX, offsetY } = event;
            const centerX = (this.lineStartX + offsetX / this.zoomLevel - this.panX / this.zoomLevel) / 2;
            const centerY = (this.lineStartY + offsetY / this.zoomLevel - this.panY / this.zoomLevel) / 2;
            const radius = Math.abs(offsetX / this.zoomLevel - this.panX / this.zoomLevel - this.lineStartX) / 2;
            
            // Draw circle using the Circle tool
            this.drawGrid();
            this.circleTool.drawCircle(centerX, centerY, radius);
        }
    }

    private handleCircleEnd(event: MouseEvent) {
        if (this.endOfDrawing && this.isDrawing) {
            this.isDrawing = false;
            let circle = {
                centerX: (this.lineStartX + event.offsetX / this.zoomLevel - this.panX / this.zoomLevel) / 2,
                centerY: (this.lineStartY + event.offsetY / this.zoomLevel - this.panY / this.zoomLevel) / 2,
                radius: Math.abs(event.offsetX / this.zoomLevel - this.panX / this.zoomLevel - this.lineStartX) / 2
            }
            console.log(circle);
            this.saveDrawing(circle);
        }
    }

    // draw rectangle
    private handleRectangleDraw(event: MouseEvent) {
        if (this.isDrawing) {
            const { offsetX, offsetY } = event;
            const startX = this.lineStartX;
            const startY = this.lineStartY;
            const width = offsetX / this.zoomLevel - this.panX / this.zoomLevel - this.lineStartX;
            const height = offsetY / this.zoomLevel - this.panY / this.zoomLevel - this.lineStartY;
            
            // Draw rectangle using the Rectangle tool
            this.drawGrid();
            this.rectangleTool.drawRectangle(startX, startY, width, height);
        }
    }

    private handleRectangleEnd(event: MouseEvent) {
        if (this.endOfDrawing && this.isDrawing) {
            this.isDrawing = false;
            let rectangle = {
                startX: this.lineStartX,
                startY: this.lineStartY,
                width: event.offsetX / this.zoomLevel - this.panX / this.zoomLevel - this.lineStartX,
                height: event.offsetY / this.zoomLevel - this.panY / this.zoomLevel - this.lineStartY
            }
            console.log(rectangle);
            this.saveDrawing(rectangle);
        }
    }

    private saveDrawing(draw: any) {
        this.drawing.push(draw);
        console.log(this.drawing);
    }

    private drawDrawing() {
        this.drawing.forEach((draw: any) => {
            if (draw.type === 'line') {
                this.lineTool.drawLine(draw.start.x, draw.start.y, draw.end.x, draw.end.y);
            } else if (draw.type === 'circle') {
                this.circleTool.drawCircle(draw.centerX, draw.centerY, draw.radius);
            } else if (draw.type === 'rectangle') {
                this.rectangleTool.drawRectangle(draw.startX, draw.startY, draw.width, draw.height);
            }
        });
    }

    private handleZoom(event: WheelEvent) {
        const zoomSpeed = 0.1;
        const zoomFactor = 1 + zoomSpeed;

        if (event.deltaY > 0) {
            if (this.zoomLevel > 1) {
                this.zoomLevel -= zoomSpeed;
            }
        } else {
            if (this.zoomLevel < 10) {
                this.zoomLevel += zoomSpeed;
            }
        }

        this.drawGrid();
    }

    // set canvas width and height
    private setCanvasSize() {
        const length = Math.min(window.innerWidth, window.innerHeight);
        this.canvas.width = length;
        this.canvas.height = length;
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
        // show the mouse coordinates
        this.showMouseCoordinates(event);
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

    private drawGrid() {
        // center the grid
        this.ctx.setTransform(1, 0, 0, 1, 0, 0);
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // Set the transform to apply zoom and pan
        this.ctx.setTransform(this.zoomLevel, 0, 0, this.zoomLevel, this.panX, this.panY);

        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // style of the grid
        this.ctx.lineWidth = 2 / this.zoomLevel;
        this.ctx.strokeStyle = '#000';

        // Draw grid lines
        this.ctx.beginPath();
        for (let x = -1000; x <= 1000; x += 50) {
            this.ctx.moveTo(x, -1000);
            this.ctx.lineTo(x, 1000);
        }
        for (let y = -1000; y <= 1000; y += 50) {
            this.ctx.moveTo(-1000, y);
            this.ctx.lineTo(1000, y);
        }
        this.ctx.strokeStyle = '#ccc';
        this.ctx.stroke();

        // Draw center point
        this.ctx.fillStyle = 'red';
        this.ctx.beginPath();
        this.ctx.arc(0, 0, 5, 0, 2 * Math.PI);
        this.ctx.fill();

        // draw the drawing
        this.drawDrawing();
    }

    private showMouseCoordinates(event: MouseEvent) {
        // position of the mouse relative to the canvas like the center point... and the Y is different
        let left = this.canvas.offsetLeft + this.canvas.clientLeft;
        let top = this.canvas.offsetTop + this.canvas.clientTop;
        const x = ((event.clientX - this.panX) - left) / this.zoomLevel;
        const y = ((event.clientY - this.panY) - top) / this.zoomLevel;
        // show the mouse coordinates in id position
        document.getElementById('position')!.innerHTML = `(${x.toFixed(0)}, ${y.toFixed(0)})`;
    }
}

// Create an instance of CADGrid with the canvas ID
const cadGrid = new CADGrid('canvas');
