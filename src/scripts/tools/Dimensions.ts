import { Line, Circle } from '../shapes/Shapes'; // Importing the Line and Circle classes from the shapes module

class DimensionTools {
	static ctx: CanvasRenderingContext2D; // Assuming ctx is set before using any drawing methods

	// Method to set the rendering context
	static setContext(ctx: CanvasRenderingContext2D): void {
		this.ctx = ctx;
	}

	// Method to draw dimension lines for a line
	static drawLineDimensions(line: Line): void {
		const { ctx } = this;
		ctx.beginPath();
		ctx.moveTo(line.origin[0], line.origin[1]);
		ctx.lineTo(line.end[0], line.end[1]);
		ctx.stroke();

		// Draw dimension lines
		const angle = Math.atan2(line.end[1] - line.origin[1], line.end[0] - line.origin[0]);
		const length = 10; // Length of the dimension lines
		const angleOffset = Math.PI / 2; // Offset angle for the dimension lines

		// Dimension line 1
		const dx1 = length * Math.cos(angle + angleOffset);
		const dy1 = length * Math.sin(angle + angleOffset);
		ctx.moveTo(line.origin[0] + dx1, line.origin[1] + dy1);
		ctx.lineTo(line.origin[0] + dx1 + (line.end[0] - line.origin[0]), line.origin[1] + dy1 + (line.end[1] - line.origin[1]));

		// Dimension line 2
		const dx2 = length * Math.cos(angle - angleOffset);
		const dy2 = length * Math.sin(angle - angleOffset);
		ctx.moveTo(line.origin[0] + dx2, line.origin[1] + dy2);
		ctx.lineTo(line.origin[0] + dx2 + (line.end[0] - line.origin[0]), line.origin[1] + dy2 + (line.end[1] - line.origin[1]));

		ctx.stroke();
	}

	// Method to draw dimension lines for a circle
	static drawCircleDimensions(circle: Circle): void {
		const { ctx } = this;
		ctx.beginPath();
		ctx.arc(circle.origin[0], circle.origin[1], circle.radius, 0, Math.PI * 2);
		ctx.stroke();

		// Draw dimension lines
		const length = 10; // Length of the dimension lines
		const radius = circle.radius;

		// Dimension line 1
		ctx.moveTo(circle.origin[0], circle.origin[1]);
		ctx.lineTo(circle.origin[0] + radius, circle.origin[1]);
		ctx.lineTo(circle.origin[0] + radius, circle.origin[1] - length);

		// Dimension line 2
		ctx.moveTo(circle.origin[0], circle.origin[1]);
		ctx.lineTo(circle.origin[0], circle.origin[1] - radius);
		ctx.lineTo(circle.origin[0] + length, circle.origin[1] - radius);

		ctx.stroke();
	}
}

export { DimensionTools };
