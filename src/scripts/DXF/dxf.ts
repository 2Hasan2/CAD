let ID = () => { return Math.random().toString(36).substr(2, 9) }
interface entity {
	start: { x: number, y: number };
	end?: { x: number, y: number };
	radius?: number;
	ctx: CanvasRenderingContext2D;
	toDXF() : string;
	toCTX(): void;
}

class Point {
	id : string;
	type: string;
	constructor(public x: number, public y: number, public ctx: CanvasRenderingContext2D) {
		this.id = ID();
		this.type = "point";
		this.ctx = ctx;
	}
	toDXF(): string {
		return `
0
POINT
8
0
10
${this.x}
20
${this.y}`;
	}

	toCTX() {
		this.ctx.beginPath();
		this.ctx.arc(this.x, this.y, 1, 0, Math.PI * 2);
		this.ctx.fillStyle = 'black';
		this.ctx.fill();
	}
}
class Line implements entity {
	id: string;
	type: string;
	ctx: CanvasRenderingContext2D;
	constructor(public start: { x: number, y: number }, public end: { x: number, y: number }, ctx: CanvasRenderingContext2D) { 
		this.id = ID();
		this.type = "line";
		this.ctx = ctx;
	}

	toDXF(): string {
		return `
0
LINE
8
0
10
${this.start.x}
20
${this.start.y}
11
${this.end.x}
21
${this.end.y}`;
	}

	toCTX() {
		this.ctx.beginPath();
		this.ctx.moveTo(this.start.x, this.start.y);
		this.ctx.lineTo(this.end.x, this.end.y);
		this.ctx.strokeStyle = 'black';
		this.ctx.stroke();
	}

}

class Circle implements entity {
	id: string;
	type: string;
	ctx: CanvasRenderingContext2D;
	radius: number;

	constructor(public start: { x: number, y: number }, radius: number, ctx: CanvasRenderingContext2D) {
		this.id = ID();
		this.type = "circle";
		this.ctx = ctx;
		this.radius = radius;
	}
	toDXF(): string {
		return `
0
CIRCLE
8
0
10
${this.start.x}
20
${this.start.y}
40
${this.radius}`;
	}

	toCTX() {
		this.ctx.beginPath();
		this.ctx.arc(this.start.x, this.start.y, this.radius, 0, Math.PI * 2);
		this.ctx.strokeStyle = 'black';
		this.ctx.stroke();
	}

}

class Arc implements entity {
	id: string;
	type: string;
	ctx: CanvasRenderingContext2D;

 	constructor(public start: { x: number, y: number }, public radius: number, public angle: {start: number, end: number}, ctx: CanvasRenderingContext2D) {
		this.id = ID();
		this.type = "arc";
		this.ctx = ctx;
	}	
	toDXF(): string {
		return `
0
ARC
8
0
10
${this.start.x}
20
${this.start.y}
40
${this.radius}
50
${this.angle.start}
51
${this.angle.end}`;
	}

	toCTX() {
		this.ctx.beginPath();
		this.ctx.arc(this.start.x, this.start.y, this.radius, this.angle.start, this.angle.end);
		this.ctx.strokeStyle = 'black';
		this.ctx.stroke();
	}

}

class Rectangle implements entity {
	id: string;
	type: string;
	ctx: CanvasRenderingContext2D;

	constructor(public start: { x: number, y: number }, public end: { x: number, y: number }, ctx: CanvasRenderingContext2D) {
		this.id = ID();
		this.type = "rectangle";
		this.ctx = ctx;
	}
	toDXF(): string {
		const line1 = new Line({ x: this.start.x, y: this.start.y }, { x: this.end.x, y: this.start.y }, this.ctx).toDXF();
		const line2 = new Line({ x: this.end.x, y: this.start.y }, { x: this.end.x, y: this.end.y }, this.ctx).toDXF();
		const line3 = new Line({ x: this.end.x, y: this.end.y }, { x: this.start.x, y: this.end.y }, this.ctx).toDXF();
		const line4 = new Line({ x: this.start.x, y: this.end.y }, { x: this.start.x, y: this.start.y }, this.ctx).toDXF();
		return line1 + line2 + line3 + line4;
	}

	toCTX() {
		this.ctx.beginPath();
		this.ctx.moveTo(this.start.x, this.start.y);
		this.ctx.strokeStyle = 'black';
		this.ctx.stroke();
	}

}

class Polygon {
	id: string;
	type: string;

	constructor(public points: Point[], public ctx: CanvasRenderingContext2D) {
		this.id = ID();
		this.type = "polygon";
		this.ctx = ctx;
	}

	toDXF(): string {
		let dxfString = '';

		for (let i = 0; i < this.points.length - 1; i++) {
			const line = new Line({ x: this.points[i].x, y: this.points[i].y }, { x: this.points[i + 1].x, y: this.points[i + 1].y }, this.ctx).toDXF();
			dxfString += line;
		}

		// Close the polygon
		const lastLine = new Line({ x: this.points[this.points.length - 1].x, y: this.points[this.points.length - 1].y }, { x: this.points[0].x, y: this.points[0].y }, this.ctx).toDXF();
		dxfString += lastLine;

		return dxfString;
	}

	toCTX() {
		this.ctx.beginPath();
		this.ctx.moveTo(this.points[0].x, this.points[0].y);
		for (let i = 1; i < this.points.length; i++) {
			this.ctx.lineTo(this.points[i].x, this.points[i].y);
		}
		this.ctx.closePath();
		this.ctx.strokeStyle = 'black';
		this.ctx.stroke();
	}

}

class LinearPattern {
	constructor(public entities: (Line | Circle | Arc | Rectangle | Point | Polygon)[], public xOffset: number, public yOffset: number, public count: number, public id = ID(), public type = "linear") { }

	toDXF(): string {
		let dxfString = '';
		for (let i = 0; i < this.count; i++) {
			this.entities.forEach(entity => {
				const newEntity = this.translateEntity(entity, i * this.xOffset, i * this.yOffset);
				dxfString += newEntity.toDXF();
			});
		}
		return dxfString;
	}

	private translateEntity(entity: Line | Circle | Arc | Rectangle | Point | Polygon, xOffset: number, yOffset: number): Line | Circle | Arc | Rectangle | Point | Polygon {
		if (entity instanceof Line) {
			return new Line({ x: entity.start.x + xOffset, y: entity.start.y + yOffset }, { x: entity.end.x + xOffset, y: entity.end.y + yOffset }, entity.ctx);
		} else if (entity instanceof Circle) {
			return new Circle({ x: entity.start.x + xOffset, y: entity.start.y + yOffset }, entity.radius, entity.ctx);
		} else if (entity instanceof Arc) {
			return new Arc({ x: entity.start.x + xOffset, y: entity.start.y + yOffset }, entity.radius, entity.angle, entity.ctx);
		} else if (entity instanceof Rectangle) {
			return new Rectangle({ x: entity.start.x + xOffset, y: entity.start.y + yOffset }, { x: entity.end.x + xOffset, y: entity.end.y + yOffset }, entity.ctx);
		} else if (entity instanceof Point) {
			return new Point(entity.x + xOffset, entity.y + yOffset, entity.ctx);
		} else if (entity instanceof Polygon) {
			const translatedPoints = entity.points.map(point => new Point(point.x + xOffset, point.y + yOffset, entity.ctx));
			return new Polygon(translatedPoints, entity.ctx);
		} else {
			throw new Error('Unsupported entity type');
		}
	}

	toCTX() {
		this.entities.forEach(entity => entity.toCTX());
	}
}

class CircularPattern {
	constructor(public entities: (Line | Circle | Arc | Rectangle | Point | Polygon)[], public centerX: number, public centerY: number, public count: number, public angleIncrement: number, public id = ID(), public type = "circular") { }

	toDXF(): string {
		let dxfString = '';
		const angleStep = 360 / this.count;
		for (let i = 0; i < this.count; i++) {
			this.entities.forEach(entity => {
				const newEntity = this.rotateEntity(entity, this.centerX, this.centerY, i * angleStep * this.angleIncrement);
				dxfString += newEntity.toDXF();
			});
		}
		return dxfString;
	}

	private rotateEntity(entity: Line | Circle | Arc | Rectangle | Point | Polygon, centerX: number, centerY: number, angle: number): Line | Circle | Arc | Rectangle | Point | Polygon {
		const radians = (angle * Math.PI) / 180;
		const cosAngle = Math.cos(radians);
		const sinAngle = Math.sin(radians);

		if (entity instanceof Line) {
			const x1 = centerX + (entity.start.x - centerX) * cosAngle - (entity.start.y - centerY) * sinAngle;
			const y1 = centerY + (entity.start.x - centerX) * sinAngle + (entity.start.y - centerY) * cosAngle;
			const x2 = centerX + (entity.end.x - centerX) * cosAngle - (entity.end.y - centerY) * sinAngle;
			const y2 = centerY + (entity.end.x - centerX) * sinAngle + (entity.end.y - centerY) * cosAngle;
			return new Line({ x: x1, y: y1 }, { x: x2, y: y2 }, entity.ctx);
		} else if (entity instanceof Circle) {
			const x = centerX + (entity.start.x - centerX) * cosAngle - (entity.start.y - centerY) * sinAngle;
			const y = centerY + (entity.start.x - centerX) * sinAngle + (entity.start.y - centerY) * cosAngle;
			return new Circle({ x: x, y: y }, entity.radius, entity.ctx);
		} else if (entity instanceof Arc) {
			const x = centerX + (entity.start.x - centerX) * cosAngle - (entity.start.y - centerY) * sinAngle;
			const y = centerY + (entity.start.x - centerX) * sinAngle + (entity.start.y - centerY) * cosAngle;
			return new Arc({ x: x, y: y }, entity.radius, entity.angle, entity.ctx);
		} else if (entity instanceof Rectangle) {
			const x = centerX + (entity.start.x - centerX) * cosAngle - (entity.start.y - centerY) * sinAngle;
			const y = centerY + (entity.start.x - centerX) * sinAngle + (entity.start.y - centerY) * cosAngle;
			return new Rectangle({ x: x, y: y }, { x: entity.end.x, y: entity.end.y }, entity.ctx);
		} else if (entity instanceof Point) {
			const x = centerX + (entity.x - centerX) * cosAngle - (entity.y - centerY) * sinAngle;
			const y = centerY + (entity.x - centerX) * sinAngle + (entity.y - centerY) * cosAngle;
			return new Point(x, y, entity.ctx);
		} else if (entity instanceof Polygon) {
			const rotatedPoints = entity.points.map(point => {
				const x = centerX + (point.x - centerX) * cosAngle - (point.y - centerY) * sinAngle;
				const y = centerY + (point.x - centerX) * sinAngle + (point.y - centerY) * cosAngle;
				return new Point(x, y, entity.ctx);
			});
			return new Polygon(rotatedPoints, entity.ctx);
		} else {
			throw new Error('Unsupported entity type');
		}
	}

	toCTX() {
		this.entities.forEach(entity => entity.toCTX());
	}
}

class Mirror {
	constructor(public entities: (Line | Circle | Arc | Rectangle | Point | Polygon)[], public mirrorAxis: 'x' | 'y', public mirrorPosition: number, public id = ID(), public type = "mirror") { }

	toDXF(): string {
		let dxfString = '';
		this.entities.forEach(entity => {
			const newEntity = this.mirrorEntity(entity, this.mirrorAxis, this.mirrorPosition);
			dxfString += newEntity.toDXF();
		});
		return dxfString;
	}

	private mirrorEntity(entity: Line | Circle | Arc | Rectangle | Point | Polygon, mirrorAxis: 'x' | 'y', mirrorPosition: number): Line | Circle | Arc | Rectangle | Point | Polygon {
		if (mirrorAxis === 'x') {
			if (entity instanceof Line) {
				const x1 = entity.start.x;
				const y1 = 2 * mirrorPosition - entity.start.y;
				const x2 = entity.end.x;
				const y2 = 2 * mirrorPosition - entity.end.y;
				return new Line({ x: x1, y: y1 }, { x: x2, y: y2 }, entity.ctx);
			} else if (entity instanceof Circle) {
				const x = entity.start.x;
				const y = 2 * mirrorPosition - entity.start.y;
				return new Circle({ x: x, y: y }, entity.radius, entity.ctx);
			} else if (entity instanceof Arc) {
				const x = entity.start.x;
				const y = 2 * mirrorPosition - entity.start.y;
				return new Arc({ x: x, y: y }, entity.radius, entity.angle, entity.ctx);
			} else if (entity instanceof Rectangle) {
				const x1 = entity.start.x;
				const y1 = 2 * mirrorPosition - entity.start.y;
				const x2 = entity.end.x;
				const y2 = 2 * mirrorPosition - entity.end.y;
				return new Rectangle({ x: x1, y: y1 }, { x: x2, y: y2 }, entity.ctx);
			} else if (entity instanceof Point) {
				const x = entity.x;
				const y = 2 * mirrorPosition - entity.y;
				return new Point(x, y, entity.ctx);
			} else if (entity instanceof Polygon) {
				const mirroredPoints = entity.points.map(point => new Point(point.x, 2 * mirrorPosition - point.y, entity.ctx));
				return new Polygon(mirroredPoints, entity.ctx);
			} else {
				throw new Error('Unsupported entity type');
			}
		} else if (mirrorAxis === 'y') {
			if (entity instanceof Line) {
				const x1 = 2 * mirrorPosition - entity.start.x;
				const y1 = entity.start.y;
				const x2 = 2 * mirrorPosition - entity.end.x;
				const y2 = entity.end.y;
				return new Line({ x: x1, y: y1 }, { x: x2, y: y2 }, entity.ctx);
			} else if (entity instanceof Circle) {
				const x = 2 * mirrorPosition - entity.start.x;
				const y = entity.start.y;
				return new Circle({ x: x, y: y }, entity.radius, entity.ctx);
			} else if (entity instanceof Arc) {
				const x = 2 * mirrorPosition - entity.start.x;
				const y = entity.start.y;
				return new Arc({ x: x, y: y }, entity.radius, entity.angle, entity.ctx);
			} else if (entity instanceof Rectangle) {
				const x1 = 2 * mirrorPosition - entity.start.x;
				const y1 = entity.start.y;
				const x2 = 2 * mirrorPosition - entity.end.x;
				const y2 = entity.end.y;
				return new Rectangle({ x: x1, y: y1 }, { x: x2, y: y2 }, entity.ctx);
			} else if (entity instanceof Point) {
				const x = 2 * mirrorPosition - entity.x;
				const y = entity.y;
				return new Point(x, y, entity.ctx);
			} else if (entity instanceof Polygon) {
				const mirroredPoints = entity.points.map(point => new Point(2 * mirrorPosition - point.x, point.y, entity.ctx));
				return new Polygon(mirroredPoints, entity.ctx);
			} else {
				throw new Error('Unsupported entity type');
			}
		} else {
			throw new Error('Invalid mirror axis');
		}
	}

	toCTX() {
		this.entities.forEach(entity => entity.toCTX());
	}
}

class DXFDocument {
	private entities: (Line | Circle | Arc | Rectangle | Point | Polygon | LinearPattern | CircularPattern | Mirror)[] = [];

	addShape(shape: Line | Circle | Arc | Rectangle | Point | Polygon | LinearPattern | CircularPattern | Mirror): void {
		this.entities.push(shape);
	}

	generateDXF(): string {
		let dxfString: string = `
0
SECTION
2
HEADER
0
ENDSEC
0
SECTION
2
TABLES
0
TABLE
2
LAYER
0
ENDTAB
0
ENDSEC
0
SECTION
2
ENTITIES`;

		this.entities.forEach(entity => {
			dxfString += entity.toDXF();
		});

		dxfString += `
0
ENDSEC
0
EOF`;

		return dxfString;
	}

	toCTX() {
		this.entities.forEach(entity => entity.toCTX());
	}
}

class DXF_MAKER {
	private  DXFDocument: DXFDocument;
	private  Shapes: (Line | Circle | Arc | Rectangle | Point | Polygon | LinearPattern | CircularPattern | Mirror)[];
	constructor() {
		this.DXFDocument = new DXFDocument();
		this.Shapes = [];
	}

	 addShape(shape: Line | Circle | Arc | Rectangle | Point | Polygon | LinearPattern | CircularPattern | Mirror): void {
		this.Shapes.push(shape);
		this.bindShapesWithDocument();
	}

	 getShapes(): (Line | Circle | Arc | Rectangle | Point | Polygon | LinearPattern | CircularPattern | Mirror)[] {
		return this.Shapes;
	}

	 deleteShape(id: string): void {
		this.Shapes = this.Shapes.filter(shape => shape.id !== id);
	}


	private  bindShapesWithDocument(): void {
		this.DXFDocument = new DXFDocument();
		this.Shapes.forEach(shape => this.DXFDocument.addShape(shape));
	}

	 clearShapes(): void {
		this.DXFDocument = new DXFDocument();
		this.Shapes = [];
	}

	// shapes adder
	 addPoint(x: number, y: number, ctx: CanvasRenderingContext2D): void {
		this.addShape(new Point(x, y, ctx));
	}

	 addLine(start: { x: number, y: number }, end: { x: number, y: number }, ctx: CanvasRenderingContext2D): void {
		this.addShape(new Line(start, end, ctx));
	}

	 addCircle(start: { x: number, y: number }, radius: number, ctx: CanvasRenderingContext2D): void {
		this.addShape(new Circle(start, radius, ctx));
	}

	 addArc(start: { x: number, y: number }, radius: number, angle: {start: number, end: number}, ctx: CanvasRenderingContext2D): void {
		this.addShape(new Arc(start, radius, angle, ctx));
	}

	 addRectangle(start: { x: number, y: number }, end: { x: number, y: number }, ctx: CanvasRenderingContext2D): void {
		this.addShape(new Rectangle(start, end, ctx));
	}

	 addPolygon(points: Point[], ctx: CanvasRenderingContext2D): void {
		this.addShape(new Polygon(points, ctx));
	}

	 addLinearPattern(entities: (Line | Circle | Arc | Rectangle | Point | Polygon)[], xOffset: number, yOffset: number, count: number): void {
		this.addShape(new LinearPattern(entities, xOffset, yOffset, count));
	}

	 addCircularPattern(entities: (Line | Circle | Arc | Rectangle | Point | Polygon)[], centerX: number, centerY: number, count: number, angleIncrement: number): void {
		this.addShape(new CircularPattern(entities, centerX, centerY, count, angleIncrement));
	}

	 addMirror(entities: (Line | Circle | Arc | Rectangle | Point | Polygon)[], mirrorAxis: 'x' | 'y', mirrorPosition: number): void {
		this.addShape(new Mirror(entities, mirrorAxis, mirrorPosition));
	}

	// generate dxf
	 generateDXF(): string {
		return this.DXFDocument.generateDXF();
	}

	 toCTX() {
		this.Shapes.forEach(shape => shape.toCTX());
	}
	// even listener and animation
	 addEventListener(canvas: HTMLCanvasElement) {
		canvas.addEventListener('click', (e: MouseEvent) => {
			const x = e.clientX - canvas.getBoundingClientRect().left;
			const y = e.clientY - canvas.getBoundingClientRect().top;
			let ctx = canvas.getContext('2d');
			this.addPoint(x, y, ctx? ctx : new CanvasRenderingContext2D());
		});
	}


}

export default DXF_MAKER;
