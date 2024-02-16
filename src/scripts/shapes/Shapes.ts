// make Shape interface to use it in CAD grid
interface Shape {
    id: string;
    type: 'line' | 'circle' | "point";
    origin: [number, number];
    radius?: number;
    end?: [number, number];
    setPos(originX: number, originY: number, endX: number, endY: number): void;
    is_hovered(x: number, y: number): boolean;
    copy(): Shape;
}

class Line implements Shape {
    id: string;
    type: 'line';
    origin: [number, number];
    end: [number, number];
    middle: [number, number];

    constructor(originX: number, originY: number, endX: number, endY: number) {
        this.id = Math.random().toString(36).substr(2, 9);
        this.type = 'line';
        this.origin = [originX, originY];
        this.end = [endX, endY];
        this.middle = [originX + (endX - originX) / 2, originY + (endY - originY) / 2];
    }


    is_hovered(x: number, y: number): boolean {
        return (x > this.origin[0] && x < this.end[0] && y > this.origin[1] && y < this.end[1]);
    }

    setPos(originX: number, originY: number, endX: number, endY: number): void {
        this.origin = [originX, originY];
        this.end = [endX, endY];
        this.middle = [originX + (endX - originX) / 2, originY + (endY - originY) / 2];
    }

    copy(): Shape {
        return new Line(this.origin[0], this.origin[1], this.end[0], this.end[1]);
    }

}

class Circle implements Shape {
    id: string;
    type: 'circle';
    origin: [number, number];
    end?: [number, number] | undefined;
    radius: number;

    constructor(originX: number, originY: number, endX: number, endY: number) {
        this.id = Math.random().toString(36).substr(2, 9);
        this.type = 'circle';
        this.origin = [originX, originY];
        this.radius = Math.sqrt(Math.pow(endX - originX, 2) + Math.pow(endY - originY, 2));
    }

    is_hovered(x: number, y: number): boolean {
        const dx = this.origin[0] - x;
        const dy = this.origin[1] - y;
        return dx * dx + dy * dy < this.radius * this.radius;
    }

    setPos(originX: number, originY: number, endX: number, endY: number): void {
        this.origin = [originX, originY];
        this.radius = Math.sqrt(Math.pow(endX - originX, 2) + Math.pow(endY - originY, 2));
    }

    copy(): Shape {
        return new Circle(this.origin[0], this.origin[1], this.origin[0] + this.radius, this.origin[1]);
    }

}

class Point implements Shape {
    id: string;
    type: 'point';
    origin: [number, number];

    constructor(originX: number, originY: number) {
        this.id = Math.random().toString(36).substr(2, 9);
        this.type = 'point';
        this.origin = [originX, originY];
    }
    is_hovered(x: number, y: number): boolean {
        const dx = this.origin[0] - x;
        const dy = this.origin[1] - y;
        return dx * dx + dy * dy < 4;
    }

    setPos(originX: number, originY: number, endX: number, endY: number): void {
        this.origin = [originX, originY];
    }

    copy(): Shape {
        return new Point(this.origin[0], this.origin[1]);
    }
}

export { Shape, Line, Circle, Point };