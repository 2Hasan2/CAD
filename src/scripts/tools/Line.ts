class Line {
    private ctx: CanvasRenderingContext2D;

    constructor(context: CanvasRenderingContext2D) {
        this.ctx = context;
    }

    drawLine(startX: number, startY: number, endX: number, endY: number) {
        this.ctx.beginPath();
        this.ctx.moveTo(startX, startY);
        this.ctx.lineTo(endX, endY);
        this.ctx.strokeStyle = 'blue'; // Set line color
        this.ctx.stroke();
    }
}

export default Line;
