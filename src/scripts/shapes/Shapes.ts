// make Shape interface to use it in CAD grid
interface Shape {
    id: string;
    type: 'line' | 'circle' | "point";
    origin: [number, number];
    children?: Shape[];
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
    children?: Shape[] | [];


    constructor(originX: number, originY: number, endX: number, endY: number) {
        this.id = Math.random().toString(36).substr(2, 9);
        this.type = 'line';
        this.origin = [originX, originY];
        this.end = [endX, endY];
        this.middle = [originX + (endX - originX) / 2, originY + (endY - originY) / 2];
    }


    is_hovered(x: number, y: number): boolean {
        const distance = Math.sqrt(Math.pow(x - this.origin[0], 2) + Math.pow(y - this.origin[1], 2)) + Math.sqrt(Math.pow(x - this.end[0], 2) + Math.pow(y - this.end[1], 2));
        return distance <= Math.sqrt(Math.pow(this.end[0] - this.origin[0], 2) + Math.pow(this.end[1] - this.origin[1], 2)) + 1;
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
        const distanceSquared = Math.pow(x - this.origin[0], 2) + Math.pow(y - this.origin[1], 2);
        const max = Math.pow(this.radius + 1, 2)
        const min = Math.pow(this.radius - 1, 2)
        return (distanceSquared <= max && distanceSquared >= min)
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
        const distance = Math.sqrt(Math.pow(x - this.origin[0], 2) + Math.pow(y - this.origin[1], 2));
        return distance <= 1;
    }

    setPos(originX: number, originY: number, endX: number, endY: number): void {
        this.origin = [originX, originY];
    }

    copy(): Shape {
        return new Point(this.origin[0], this.origin[1]);
    }
}

export { Shape, Line, Circle, Point };