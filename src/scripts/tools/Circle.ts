// tools/circle.ts
class Circle {
    private ctx: CanvasRenderingContext2D;

    constructor(context: CanvasRenderingContext2D) {
        this.ctx = context;
    }

    drawCircle(centerX: number, centerY: number, radius: number) {
        this.ctx.beginPath();
        this.ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
        this.ctx.strokeStyle = 'green'; // Set circle outline color
        this.ctx.stroke();
    }
}

export default Circle;

// usage
// const circle = new Circle(this.ctx);
// circle.drawCircle(0, 0, 100);