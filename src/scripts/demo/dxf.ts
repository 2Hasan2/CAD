import * as fs from 'fs';

class Point {
	constructor(public x: number, public y: number) { }

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
}

class Line {
	constructor(public x1: number, public y1: number, public x2: number, public y2: number) { }

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
}

class Circle {
	constructor(public centerX: number, public centerY: number, public radius: number) { }

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
}

class Arc {
	constructor(public centerX: number, public centerY: number, public radius: number, public startAngle: number, public endAngle: number) { }

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
}

class Rectangle {
	constructor(public x: number, public y: number, public width: number, public height: number) { }

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
}

class Polygon {
	constructor(public points: Point[]) { }

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
}

class LinearPattern {
	constructor(public entities: (Line | Circle | Arc | Rectangle | Point | Polygon)[], public xOffset: number, public yOffset: number, public count: number) { }

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
}

class CircularPattern {
	constructor(public entities: (Line | Circle | Arc | Rectangle | Point | Polygon)[], public centerX: number, public centerY: number, public count: number, public angleIncrement: number) { }

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
			// coming soon
			return entity;
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
}

class Mirror {
	constructor(public entities: (Line | Circle | Arc | Rectangle | Point | Polygon)[], public mirrorAxis: 'x' | 'y', public mirrorPosition: number) { }

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
				// coming soon
				return entity;
			} else if (entity instanceof Rectangle) {
				// coming soon
				return entity;
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
				// coming soon
				return entity;
			} else if (entity instanceof Rectangle) {
				// coming soon
				return entity;
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
}

class Group {
	constructor(public entities: (Line | Circle | Arc | Rectangle | Point | Polygon | LinearPattern | CircularPattern | Mirror)[]) { }

	toDXF(): string {
		let dxfString = `
0
INSERT
8
0`;

		this.entities.forEach(entity => {
			dxfString += `
2
${entity.constructor.name.toUpperCase()}`;
			if (!(entity instanceof Mirror)) {
				dxfString += `
10
${entity instanceof Point ? entity.x : (entity as Line).x1}
20
${entity instanceof Point ? entity.y : (entity as Line).y1}`;
			}
		});

		return dxfString;
	}
}

class DXFDocument {
	private entities: (Line | Circle | Arc | Rectangle | Point | Polygon | LinearPattern | CircularPattern | Mirror | Group)[] = [];

	addShape(shape: Line | Circle | Arc | Rectangle | Point | Polygon | LinearPattern | CircularPattern | Mirror | Group): void {
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
			if (entity instanceof Group) {
				dxfString += entity.toDXF();
			} else {
				dxfString += entity.toDXF();
			}
		});

		dxfString += `
0
ENDSEC
0
EOF`;

		return dxfString;
	}
}

// Usage example:
const line = new Line(0, 0, 30, 70);
const circle = new Circle(30, 70, 25);
const point = new Point(10, 20);
const arc = new Arc(75, 75, 50, 45, 135);
const rectangle = new Rectangle(100, 100, 50, 30);
const polygon = new Polygon([
	new Point(200, 200),
	new Point(250, 250),
	new Point(300, 200),
	new Point(250, 150),
]);

const linearPattern = new LinearPattern([line, circle], 20, 20, 10);
const circularPattern = new CircularPattern([line, circle, arc], 0, 0, 5, 1);
const mirrorX = new Mirror([line, circle], 'x', 0);
const mirrorY = new Mirror([line, circle], 'y', 0);

// const group = new Group([line, circle, point, arc, rectangle, polygon, linearPattern, circularPattern, mirrorX, mirrorY]);

const dxfDoc = new DXFDocument();
//* dxfDoc.addShape(circle); test is done
//* dxfDoc.addShape(line); test is done
//* dxfDoc.addShape(point); test is done
//* dxfDoc.addShape(arc); test is done
//* dxfDoc.addShape(rectangle); test is done
//* dxfDoc.addShape(polygon); test is done
//* dxfDoc.addShape(linearPattern); test is done
dxfDoc.addShape(circularPattern); //? test is done in [ Circle , Line , arc]
//? dxfDoc.addShape(mirrorX); 
//? dxfDoc.addShape(mirrorY);
//? dxfDoc.addShape(group);

const dxfContent = dxfDoc.generateDXF();

fs.writeFileSync('output.dxf', dxfContent);