import { Shape, Circle, Line, Point } from "../entities/Shapes";
import { Dimension } from "../entities/Dimensions";
class CADGrid {

    /**
     * @param canvas - The canvas element
     * @param ctx - The canvas context
     * @param zoomLevel - The zoom level
     * @param panStartX - The start x position of the pan
     * @param panStartY - The start y position of the pan
     * @param isPanning - A boolean to check if the user is panning
     * @param panX - The x position of the pan
     * @param panY - The y position of the pan
     * @param scale - The scale of the grid
     * @method handleZoom - A method to handle the zoom event
     * @method setCanvasSize - A method to set the canvas size
     * @method handleMouseDown - A method to handle the mouse down event
     * @method handlePanStart - A method to handle the pan start event
     * @method handlePanMove - A method to handle the pan move event
     * @method handlePanEnd - A method to handle the pan end event
     * @method drawGrid - A method to draw the grid
     * @method showCoordinates - A method to show the coordinates
     * @method moveToCenter - A method to move to the center
     * @method setupEventListeners - A method to setup the event listeners
     * @method drawGridLines - A method to draw the grid lines
     * 
    */
    private canvas: HTMLCanvasElement;
    public ctx: CanvasRenderingContext2D;
    private zoomLevel: number;
    private panStartX: number;
    private panStartY: number;
    private isPanning: boolean;
    private panX: number;
    private panY: number;
    public shapes: Shape[] = [];
    public demoShape: Shape | undefined;
    public DimsArray: Dimension[] = []

    constructor(canvasId: string) {
        this.canvas = document.getElementById(canvasId) as HTMLCanvasElement;
        this.ctx = this.canvas.getContext('2d') as CanvasRenderingContext2D;
        this.zoomLevel = 3.5;
        this.panStartX = 0;
        this.panStartY = 0;
        this.isPanning = false;
        this.panX = this.canvas.width / 2;
        this.panY = this.canvas.height / 2;
        this.demoShape = undefined
        this.DimsArray = []

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
        
        if (this.isPanning /*&& this.moveHand*/) {
            this.panX += deltaX;
            this.panY += deltaY;
            this.drawGrid();
        }
    }

    private handlePanEnd() {
        this.isPanning = false;
    }

    public drawGrid() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.drawGridLines();
        this.drawDemoShapes();
        this.drawShapes();
        this.drawAllDims();
    }

    private drawGridLines() {
        const ctx = this.ctx;
        ctx.beginPath();
        ctx.strokeStyle = '#d1d1d1';
        ctx.lineWidth = 1;
        const gridSize = 5 * this.zoomLevel;
        const width = this.canvas.width;
        const height = this.canvas.height;
        const offsetX = this.panX % gridSize;
        const offsetY = this.panY % gridSize;

        for (let i = 0; i < width / gridSize; i++) {
            ctx.moveTo(i * gridSize + offsetX, 0);
            ctx.lineTo(i * gridSize + offsetX, height);
        }

        for (let i = 0; i < height / gridSize; i++) {
            ctx.moveTo(0, i * gridSize + offsetY);
            ctx.lineTo(width, i * gridSize + offsetY);
        }

        // center point
        ctx.moveTo(this.panX, this.panY);
        ctx.arc(this.panX, this.panY, 5, 0, 2 * Math.PI);
        ctx.stroke();
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

    // out mouse position
    public getMousePosition(event: MouseEvent) {
        const x = Math.round((event.clientX - this.panX) / this.zoomLevel);
        const y = -Math.round((event.clientY - this.panY) / this.zoomLevel);
        return { x, y };
    }

    // make shape demo
    public drawDemoShapes() {
        const shape = this.demoShape;
        if (!shape) return;
        if (shape.type === 'line') {
            this.drawShapeLine(shape as Line);
        } else if (shape.type === 'circle') {
            this.drawShapeCircle(shape as Circle);
        } else if (shape.type === 'point') {
            this.drawShapePoint(shape as Point);
        }
    }

    // make shape methods
    public drawShapes() {
        this.shapes.forEach(shape => {
            if (shape.type === 'line') {
                this.drawShapeLine(shape as Line);
            } else if (shape.type === 'circle') {
                this.drawShapeCircle(shape as Circle);
            } else if (shape.type === 'point') {
                this.drawShapePoint(shape as Point);
            }
        });
    }

    private ifThereIsPoint(x: number, y: number) {
        return this.shapes.map(shape => {
            if (shape.type === 'point') {
                if (shape.origin[0] === x && shape.origin[1] === y) {
                    return true;
                }
            }
        }).includes(true);
    }


    public addShape(shape: Shape) {
        let there= this.ifThereIsPoint(shape.origin[0], shape.origin[1]) && shape.type == "point";
        if (there) return;
        this.shapes.push(shape.copy());
        this.drawGrid()
    }

    public removeShape(id: string) {
        this.shapes = this.shapes.filter(shape => shape.id !== id);
        this.drawGrid();
    }

    private drawShapeLine(shape: Line) {
        const ctx = this.ctx;
        ctx.beginPath();
        ctx.strokeStyle = '#000';
        ctx.lineWidth = 1;
        ctx.moveTo(shape.origin[0] * this.zoomLevel + this.panX, -shape.origin[1] * this.zoomLevel + this.panY);
        ctx.lineTo(shape.end[0] * this.zoomLevel + this.panX, -shape.end[1] * this.zoomLevel + this.panY);
        ctx.stroke();
        // draw children points
        shape.getChildrenPoints().forEach(point => {
            this.drawShapePoint(point);
        });
    }

    private drawShapeCircle(shape: Circle) {
        const ctx = this.ctx;
        ctx.beginPath();
        ctx.strokeStyle = '#000';
        ctx.lineWidth = 1;
        ctx.arc(shape.origin[0] * this.zoomLevel + this.panX, -shape.origin[1] * this.zoomLevel + this.panY, shape.radius * this.zoomLevel, 0, 2 * Math.PI);
        ctx.stroke();
    }

    private drawShapePoint(shape: Point) {
        const ctx = this.ctx;
        ctx.beginPath();
        ctx.strokeStyle = '#000';
        ctx.lineWidth = 1;
        ctx.arc(shape.origin[0] * this.zoomLevel + this.panX, -shape.origin[1] * this.zoomLevel + this.panY, 2, 0, 2 * Math.PI);
        ctx.stroke();
    }

    // the hover method
    public hoverShape(event: MouseEvent) : Shape | undefined{
        const mousePos = this.getMousePosition(event);
        let shape = this.shapes.find(shape => {
            if (shape.is_hovered(mousePos.x, mousePos.y) && shape.type == "point") {
                return shape;
            }
        })
        return shape 
    }

    // copy the shapes
    public copyShapes() {
        return this.shapes.map(shape => shape.copy());
    }


    // add dimension

    public addDims(dim: Dimension) {
        this.DimsArray.push(dim);
        this.drawDims(dim);
    }

    public drawDims( dim: Dimension) {
            const ctx = this.ctx;
            ctx.beginPath();
            ctx.strokeStyle = '#630';
            ctx.lineWidth = 1;
            // draw dim up line 
            let x1 = dim.start[0] * this.zoomLevel + this.panX;
            let y1 = -dim.start[1] * this.zoomLevel + this.panY;
            let x2 = dim.end[0] * this.zoomLevel + this.panX;
            let y2 = -dim.end[1] * this.zoomLevel + this.panY;

            let { x, y } = UpByAngle(x1, y1, dim.angle, dim.len/5);
            ctx.moveTo(x1, y1);
            ctx.lineTo(x, y);
            let { x: x3, y: y3 } = UpByAngle(x2, y2, dim.angle, dim.len/5);
            ctx.moveTo(x2, y2);
            ctx.lineTo(x3, y3);
            ctx.moveTo(x, y);
            ctx.lineTo(x3, y3);
            // font size is negative or positive based on the y position and the angle
            let fontSize = 20;
            ctx.font = `${Math.abs(fontSize)}px Arial`;
            let text = dim.len.toFixed(2).toString().concat('mm');
            x = dim.dim[0] * this.zoomLevel + this.panX - 10;
            y = -dim.dim[1] * this.zoomLevel + this.panY - 15;
            ctx.fillText(text, x, y);
            // draw dim line
            ctx.stroke();
    }

    private drawAllDims() {
        this.DimsArray.forEach(dim => {
            this.drawDims(dim);
        });
    }

}
export default CADGrid;

function UpByAngle(x: number, y: number, angle: number, length: number): { x: number, y: number } {
    const radians = (-90 - angle) * Math.PI / 180;
    return { x: x + length * Math.cos(radians), y: y + length * Math.sin(radians) };
}