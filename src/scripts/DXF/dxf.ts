let ID = () => { return Math.random().toString(36).substr(2, 9) }
class Point {
	constructor(public x: number, public y: number, public id = ID()) { }

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

	toCTX(ctx: CanvasRenderingContext2D) {
		ctx.beginPath();
		ctx.arc(this.x, this.y, 3, 0, Math.PI * 2);
		ctx.fillStyle = 'black';
		ctx.fill();
	}
}

class Line {
	constructor(public x1: number, public y1: number, public x2: number, public y2: number, public id = ID()) { }

	toDXF(): string {
		return `
0
LINE
8
0
10
${this.x1}
20
${this.y1}
11
${this.x2}
21
${this.y2}`;
	}

	toCTX(ctx: CanvasRenderingContext2D) {
		ctx.beginPath();
		ctx.moveTo(this.x1, this.y1);
		ctx.lineTo(this.x2, this.y2);
		ctx.strokeStyle = 'black';
		ctx.stroke();
	}
}

class Circle {
	constructor(public centerX: number, public centerY: number, public radius: number, public id = ID()) { }

	toDXF(): string {
		return `
0
CIRCLE
8
0
10
${this.centerX}
20
${this.centerY}
40
${this.radius}`;
	}

	toCTX(ctx: CanvasRenderingContext2D) {
		ctx.beginPath();
		ctx.arc(this.centerX, this.centerY, this.radius, 0, Math.PI * 2);
		ctx.strokeStyle = 'black';
		ctx.stroke();
	}
}

class Arc {
	constructor(public centerX: number, public centerY: number, public radius: number, public startAngle: number, public endAngle: number, public id = ID()) { }

	toDXF(): string {
		return `
0
ARC
8
0
10
${this.centerX}
20
${this.centerY}
40
${this.radius}
50
${this.startAngle}
51
${this.endAngle}`;
	}

	toCTX(ctx: CanvasRenderingContext2D) {
		ctx.beginPath();
		ctx.arc(this.centerX, this.centerY, this.radius, this.startAngle, this.endAngle);
		ctx.strokeStyle = 'black';
		ctx.stroke();
	}
}

class Rectangle {
	constructor(public x: number, public y: number, public width: number, public height: number, public id = ID()) { }

	toDXF(): string {
		const x1 = this.x;
		const y1 = this.y;
		const x2 = this.x + this.width;
		const y2 = this.y;
		const x3 = this.x + this.width;
		const y3 = this.y + this.height;
		const x4 = this.x;
		const y4 = this.y + this.height;

		const line1 = new Line(x1, y1, x2, y2).toDXF();
		const line2 = new Line(x2, y2, x3, y3).toDXF();
		const line3 = new Line(x3, y3, x4, y4).toDXF();
		const line4 = new Line(x4, y4, x1, y1).toDXF();

		return line1 + line2 + line3 + line4;
	}

	toCTX(ctx: CanvasRenderingContext2D) {
		ctx.beginPath();
		ctx.rect(this.x, this.y, this.width, this.height);
		ctx.strokeStyle = 'black';
		ctx.stroke();
	}
}

class Polygon {
	constructor(public points: Point[], public id = ID()) { }

	toDXF(): string {
		let dxfString = '';

		for (let i = 0; i < this.points.length - 1; i++) {
			const line = new Line(this.points[i].x, this.points[i].y, this.points[i + 1].x, this.points[i + 1].y).toDXF();
			dxfString += line;
		}

		// Close the polygon
		const lastLine = new Line(
			this.points[this.points.length - 1].x,
			this.points[this.points.length - 1].y,
			this.points[0].x,
			this.points[0].y
		).toDXF();
		dxfString += lastLine;

		return dxfString;
	}

	toCTX(ctx: CanvasRenderingContext2D) {
		ctx.beginPath();
		ctx.moveTo(this.points[0].x, this.points[0].y);
		for (let i = 1; i < this.points.length; i++) {
			ctx.lineTo(this.points[i].x, this.points[i].y);
		}
		ctx.closePath();
		ctx.strokeStyle = 'black';
		ctx.stroke();
	}
}

class LinearPattern {
	constructor(public entities: (Line | Circle | Arc | Rectangle | Point | Polygon)[], public xOffset: number, public yOffset: number, public count: number, public id = ID()) { }

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
			return new Line(entity.x1 + xOffset, entity.y1 + yOffset, entity.x2 + xOffset, entity.y2 + yOffset);
		} else if (entity instanceof Circle) {
			return new Circle(entity.centerX + xOffset, entity.centerY + yOffset, entity.radius);
		} else if (entity instanceof Arc) {
			return new Arc(entity.centerX + xOffset, entity.centerY + yOffset, entity.radius, entity.startAngle, entity.endAngle);
		} else if (entity instanceof Rectangle) {
			return new Rectangle(entity.x + xOffset, entity.y + yOffset, entity.width, entity.height);
		} else if (entity instanceof Point) {
			return new Point(entity.x + xOffset, entity.y + yOffset);
		} else if (entity instanceof Polygon) {
			const translatedPoints = entity.points.map(point => new Point(point.x + xOffset, point.y + yOffset));
			return new Polygon(translatedPoints);
		} else {
			throw new Error('Unsupported entity type');
		}
	}

	toCTX(ctx: CanvasRenderingContext2D) {
		this.entities.forEach(entity => entity.toCTX(ctx));
	}
}

class CircularPattern {
	constructor(public entities: (Line | Circle | Arc | Rectangle | Point | Polygon)[], public centerX: number, public centerY: number, public count: number, public angleIncrement: number, public id = ID()) { }

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
			const x1 = centerX + (entity.x1 - centerX) * cosAngle - (entity.y1 - centerY) * sinAngle;
			const y1 = centerY + (entity.x1 - centerX) * sinAngle + (entity.y1 - centerY) * cosAngle;
			const x2 = centerX + (entity.x2 - centerX) * cosAngle - (entity.y2 - centerY) * sinAngle;
			const y2 = centerY + (entity.x2 - centerX) * sinAngle + (entity.y2 - centerY) * cosAngle;
			return new Line(x1, y1, x2, y2);
		} else if (entity instanceof Circle) {
			const x = centerX + (entity.centerX - centerX) * cosAngle - (entity.centerY - centerY) * sinAngle;
			const y = centerY + (entity.centerX - centerX) * sinAngle + (entity.centerY - centerY) * cosAngle;
			return new Circle(x, y, entity.radius);
		} else if (entity instanceof Arc) {
			const x = centerX + (entity.centerX - centerX) * cosAngle - (entity.centerY - centerY) * sinAngle;
			const y = centerY + (entity.centerX - centerX) * sinAngle + (entity.centerY - centerY) * cosAngle;
			return new Arc(x, y, entity.radius, entity.startAngle, entity.endAngle);
		} else if (entity instanceof Rectangle) {
			const x = centerX + (entity.x - centerX) * cosAngle - (entity.y - centerY) * sinAngle;
			const y = centerY + (entity.x - centerX) * sinAngle + (entity.y - centerY) * cosAngle;
			return new Rectangle(x, y, entity.width, entity.height);
		} else if (entity instanceof Point) {
			const x = centerX + (entity.x - centerX) * cosAngle - (entity.y - centerY) * sinAngle;
			const y = centerY + (entity.x - centerX) * sinAngle + (entity.y - centerY) * cosAngle;
			return new Point(x, y);
		} else if (entity instanceof Polygon) {
			const rotatedPoints = entity.points.map(point => {
				const x = centerX + (point.x - centerX) * cosAngle - (point.y - centerY) * sinAngle;
				const y = centerY + (point.x - centerX) * sinAngle + (point.y - centerY) * cosAngle;
				return new Point(x, y);
			});
			return new Polygon(rotatedPoints);
		} else {
			throw new Error('Unsupported entity type');
		}
	}

	toCTX(ctx: CanvasRenderingContext2D) {
		this.entities.forEach(entity => entity.toCTX(ctx));
	}
}

class Mirror {
	constructor(public entities: (Line | Circle | Arc | Rectangle | Point | Polygon)[], public mirrorAxis: 'x' | 'y', public mirrorPosition: number, public id = ID()) { }

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
				return new Line(entity.x1, 2 * mirrorPosition - entity.y1, entity.x2, 2 * mirrorPosition - entity.y2);
			} else if (entity instanceof Circle) {
				return new Circle(entity.centerX, 2 * mirrorPosition - entity.centerY, entity.radius);
			} else if (entity instanceof Arc) {
				return new Arc(entity.centerX, 2 * mirrorPosition - entity.centerY, entity.radius, entity.startAngle, entity.endAngle);
			} else if (entity instanceof Rectangle) {
				return new Rectangle(entity.x, 2 * mirrorPosition - entity.y, entity.width, entity.height);
			} else if (entity instanceof Point) {
				return new Point(entity.x, 2 * mirrorPosition - entity.y);
			} else if (entity instanceof Polygon) {
				const mirroredPoints = entity.points.map(point => new Point(point.x, 2 * mirrorPosition - point.y));
				return new Polygon(mirroredPoints);
			} else {
				throw new Error('Unsupported entity type');
			}
		} else if (mirrorAxis === 'y') {
			if (entity instanceof Line) {
				return new Line(2 * mirrorPosition - entity.x1, entity.y1, 2 * mirrorPosition - entity.x2, entity.y2);
			} else if (entity instanceof Circle) {
				return new Circle(2 * mirrorPosition - entity.centerX, entity.centerY, entity.radius);
			} else if (entity instanceof Arc) {
				return new Arc(2 * mirrorPosition - entity.centerX, entity.centerY, entity.radius, entity.startAngle, entity.endAngle);
			} else if (entity instanceof Rectangle) {
				return new Rectangle(2 * mirrorPosition - entity.x, entity.y, entity.width, entity.height);
			} else if (entity instanceof Point) {
				return new Point(2 * mirrorPosition - entity.x, entity.y);
			} else if (entity instanceof Polygon) {
				const mirroredPoints = entity.points.map(point => new Point(2 * mirrorPosition - point.x, point.y));
				return new Polygon(mirroredPoints);
			} else {
				throw new Error('Unsupported entity type');
			}
		} else {
			throw new Error('Invalid mirror axis');
		}
	}

	toCTX(ctx: CanvasRenderingContext2D) {
		this.entities.forEach(entity => entity.toCTX(ctx));
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

	toCTX(ctx: CanvasRenderingContext2D) {
		this.entities.forEach(entity => entity.toCTX(ctx));
	}
}

class DXF_MAKER {
	private static DXFDocument: DXFDocument;
	private static Shapes: (Line | Circle | Arc | Rectangle | Point | Polygon | LinearPattern | CircularPattern | Mirror)[];
	constructor() {
		let that = DXF_MAKER;
		that.DXFDocument = new DXFDocument()
		that.Shapes = [];
	}

	static addShape(shape: Line | Circle | Arc | Rectangle | Point | Polygon | LinearPattern | CircularPattern | Mirror): void {
		let that = DXF_MAKER;
		that.Shapes.push(shape);
		that.bindShapesWithDocument();
	}

	static getShapes(): (Line | Circle | Arc | Rectangle | Point | Polygon | LinearPattern | CircularPattern | Mirror)[] {
		let that = DXF_MAKER;
		return that.Shapes;
	}

	static deleteShape(id: string): void {
		let that = DXF_MAKER;
		that.Shapes = that.Shapes.filter(shape => shape.id !== id);
	}


	private static bindShapesWithDocument(): void {
		let that = DXF_MAKER;
		that.DXFDocument = new DXFDocument();
		that.Shapes.forEach(shape => that.DXFDocument.addShape(shape));
	}

	static clearShapes(): void {
		let that = DXF_MAKER;
		that.DXFDocument = new DXFDocument();
		that.Shapes = [];
	}

	// shapes adder
	static addLine(x1: number, y1: number, x2: number, y2: number): void {
		let that = DXF_MAKER;
		that.DXFDocument.addShape(new Line(x1, y1, x2, y2));
	}

	static addCircle(centerX: number, centerY: number, radius: number): void {
		let that = DXF_MAKER;
		that.DXFDocument.addShape(new Circle(centerX, centerY, radius));
	}

	static addArc(centerX: number, centerY: number, radius: number, startAngle: number, endAngle: number): void {
		let that = DXF_MAKER;
		that.DXFDocument.addShape(new Arc(centerX, centerY, radius, startAngle, endAngle));
	}

	static addRectangle(x: number, y: number, width: number, height: number): void {
		let that = DXF_MAKER;
		that.DXFDocument.addShape(new Rectangle(x, y, width, height));
	}

	static addPoint(x: number, y: number): void {
		let that = DXF_MAKER;
		that.DXFDocument.addShape(new Point(x, y));
	}

	static addPolygon(points: Point[]): void {
		let that = DXF_MAKER;
		that.DXFDocument.addShape(new Polygon(points));
	}

	// patterns adder
	static addLinearPattern(entities: (Line | Circle | Arc | Rectangle | Point | Polygon)[], xOffset: number, yOffset: number, count: number): void {
		let that = DXF_MAKER;
		that.DXFDocument.addShape(new LinearPattern(entities, xOffset, yOffset, count));
	}

	static addCircularPattern(entities: (Line | Circle | Arc | Rectangle | Point | Polygon)[], centerX: number, centerY: number, count: number, angleIncrement: number): void {
		let that = DXF_MAKER;
		that.DXFDocument.addShape(new CircularPattern(entities, centerX, centerY, count, angleIncrement));
	}

	// mirror adder
	static addMirror(entities: (Line | Circle | Arc | Rectangle | Point | Polygon)[], mirrorAxis: 'x' | 'y', mirrorPosition: number): void {
		let that = DXF_MAKER;
		that.DXFDocument.addShape(new Mirror(entities, mirrorAxis, mirrorPosition));
	}

	// generate dxf
	static generateDXF(): string {
		let that = DXF_MAKER;
		return that.DXFDocument.generateDXF();
	}

	static toCTX(ctx: CanvasRenderingContext2D) {
		this.Shapes.forEach(shape => shape.toCTX(ctx));
	}
}

export default DXF_MAKER;

export { Point, Line, Circle, Arc, Rectangle, Polygon, LinearPattern, CircularPattern, Mirror, DXFDocument };
