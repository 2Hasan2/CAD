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

    constructor(canvasId: string) {
        this.canvas = document.getElementById(canvasId) as HTMLCanvasElement;
        this.ctx = this.canvas.getContext('2d')!;
        this.zoomLevel = 1;
        this.panStartX = 0;
        this.panStartY = 0;
        this.isPanning = false;
        this.panX = this.canvas.width / 2;
        this.panY = this.canvas.height / 2;
        this.scale = 25;

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

    // handle mouse down for start drawing a line or handle pan
    private handleMouseDown(event: MouseEvent) {
            this.handlePanStart(event);
    }


    private handleZoom(event: WheelEvent) {
            event.preventDefault();
            const zoomIntensity = 0.01;
            const wheel = event.deltaY < 0 ? 1 : -1;
            const zoom = Math.exp(wheel * zoomIntensity);

            // Limit the zoom level between 0.01 and 100
            this.zoomLevel = Math.max(0.01, Math.min(15, this.zoomLevel * zoom));

            this.drawGrid();
    }

    // set canvas width and height
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
        // show the mouse coordinates
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

        this.scale = Math.pow(2, Math.round(Math.log2(50 / this.zoomLevel)));



        const numLinesX = Math.pow(3, Math.round(Math.log2(10000 / this.scale )));
        const numLinesY = Math.pow(3, Math.round(Math.log2(10000 / this.scale)));


        const startX = -numLinesX * this.scale;
        const startY = -numLinesY * this.scale;

        // Draw grid lines
        this.ctx.beginPath();
        for (let x = startX; x <= -startX; x += this.scale) {
            this.ctx.moveTo(x, startY);
            this.ctx.lineTo(x, -startY);
        }
        for (let y = startY; y <= -startY; y += this.scale) {
            this.ctx.moveTo(startX, y);
            this.ctx.lineTo(-startX, y);
        }
        this.ctx.strokeStyle = '#ccc';
        this.ctx.stroke();

        // Draw center point
        this.ctx.fillStyle = 'red';
        this.ctx.beginPath();
        this.ctx.arc(0, 0, 3 / this.zoomLevel, 0, 2 * Math.PI);
        this.ctx.fill();
    }
    private showCoordinates(event: MouseEvent) {
        // show the mouse coordinates on the grid... it not event.clientX or event.clientY
        const x = Math.round((event.clientX - this.panX) / this.zoomLevel);
        const y = Math.round((event.clientY - this.panY) / this.zoomLevel);
        const coordinates = `(${x}, ${y})`;
        // show in dom
        document.getElementById('position')!.innerHTML = coordinates;
    }

    // move to the center of the grid
    private moveToCenter() {
        this.panX = this.canvas.width / 2;
        this.panY = this.canvas.height / 2;
        this.zoomLevel = 1;
        this.drawGrid();
    }
}

// Create an instance of CADGrid with the canvas ID
const cadGrid = new CADGrid('canvas');
