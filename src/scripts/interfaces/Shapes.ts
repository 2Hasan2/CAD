/**
 * @interface Shape
 * @property {string} type - type of shape (line, circle, arc)
 * @property {[number, number]} origin - origin point of shape
 * @property {number} radius - radius of shape (only for circle and arc)
 * @property {[number, number]} end - end point of shape (only for line and arc)
 * @property {string} color - color of shape
 * @property {function} draw - draw shape on canvas
 */
interface Shape {
    type: 'line' | 'circle' | 'arc';
    origin: [number, number];
    radius?: number;
    end?: [number, number];
    color: string;
    draw(ctx: CanvasRenderingContext2D): void;
}

/**
 * @class Line
 * @implements {Shape}
 * @property {string} type - type of shape : line
 * @property {[number, number]} origin - origin point of shape
 * @property {[number, number]} end - end point of shape
 * @property {string} color - color of shape
 * @method draw - draw shape on canvas
 * 
 * @param {number} originX - x coordinate of origin point
 * @param {number} originY - y coordinate of origin point
 * @param {number} endX - x coordinate of end point
 * @param {number} endY - y coordinate of end point
 * @param {string} color - color of shape
 * 
 * @returns {Shape} - line shape
 * 
 * @example
 * const line = new Line(0, 0, 100, 100, 'red');
 * line.draw(ctx);
 */

class Line implements Shape {
    type: 'line';
    origin: [number, number];
    end: [number, number];
    color: string;

    constructor(originX: number, originY: number, endX: number, endY: number, color: string) {
        this.type = 'line';
        this.origin = [originX, originY];
        this.end = [endX, endY];
        this.color = color;
    }

    draw(ctx: CanvasRenderingContext2D) {
        ctx.beginPath();
        ctx.moveTo(this.origin[0], this.origin[1]);
        ctx.lineTo(this.end[0], this.end[1]);
        ctx.strokeStyle = this.color;
        ctx.stroke();
    }
}

/**
 * @class Circle
 * @implements {Shape}
 * @property {string} type - type of shape : circle
 * @property {[number, number]} origin - origin point of shape
 * @property {number} radius - radius of shape
 * @property {string} color - color of shape
 * @method draw - draw shape on canvas
 * 
 * @param {number} originX - x coordinate of origin point
 * @param {number} originY - y coordinate of origin point
 * @param {number} radius - radius of shape
 * @param {string} color - color of shape
 * 
 * @returns {Shape} - circle shape
 * 
 * @example
 * const circle = new Circle(0, 0, 50, 'red');
 * circle.draw(ctx);
 */

class Circle implements Shape {
    type: 'circle';
    origin: [number, number];
    radius: number;
    color: string;

    constructor(originX: number, originY: number, radius: number, color: string) {
        this.type = 'circle';
        this.origin = [originX, originY];
        this.radius = radius;
        this.color = color;
    }

    draw(ctx: CanvasRenderingContext2D) {
        ctx.beginPath();
        ctx.arc(this.origin[0], this.origin[1], this.radius, 0, 2 * Math.PI);
        ctx.strokeStyle = this.color;
        ctx.stroke();
    }

}

// const arc = {
// 	type: 'arc',
// 	origin: [50, 50],
// 	radius: 50,
// 	startAngle: 0,
// 	endAngle: 1
// };
    

/**
 * @class Arc
 * @implements {Shape}
 * @property {string} type - type of shape : arc
 * @property {[number, number]} origin - origin point of shape
 * @property {number} radius - radius of shape
 * @property {number} startAngle - start angle of arc
 * @property {number} endAngle - end angle of arc
 * @property {string} color - color of shape
 * @returns {Shape} - arc shape
 * 
 * @example
 * const arc = new Arc(0, 0, 50, 0, 1, 'red');
 * arc.draw(ctx);
 */

class Arc implements Shape {
    type: 'arc';
    origin: [number, number];
    radius: number;
    startAngle: number;
    endAngle: number;
    color: string;

    constructor(originX: number, originY: number, radius: number, startAngle: number, endAngle: number, color: string) {
        this.type = 'arc';
        this.origin = [originX, originY];
        this.radius = radius;
        this.startAngle = startAngle;
        this.endAngle = endAngle;
        this.color = color;
    }

    draw(ctx: CanvasRenderingContext2D) {
        ctx.beginPath();
        ctx.arc(this.origin[0], this.origin[1], this.radius, this.startAngle, this.endAngle);
        ctx.strokeStyle = this.color;
        ctx.stroke();
    }
}

export {Line, Circle, Arc,Shape};