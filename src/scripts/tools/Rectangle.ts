class Rectangle {
    private ctx: CanvasRenderingContext2D;

    constructor(context: CanvasRenderingContext2D) {
        this.ctx = context;
    }

    drawRectangle(startX: number, startY: number, endX: number, endY: number) {
        this.ctx.beginPath();
        this.ctx.rect(startX, startY, endX, endY);
        this.ctx.strokeStyle = 'blue'; // Set line color
        this.ctx.stroke();
    }
}


export default Rectangle;
