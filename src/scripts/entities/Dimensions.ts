import { Line, Circle, Point } from './Shapes'; // Importing the Line and Circle classes from the shapes module

interface Dimension {
	start: number[];
	end: number[];
	angle: number;
	len: number;
	dim: number[];
}



class DimensionTools {
	static p1: Point | undefined
	static p2: Point | undefined


	static setP1(p1: Point | undefined): void {
		DimensionTools.p1 = p1;
	}

	static setP2(p2: Point | undefined): void {
		DimensionTools.p2 = p2;
	}

	// Method to draw dimension point to point
	static DimTwoPoints(): Dimension {
		if (DimensionTools.p1 === undefined || DimensionTools.p2 === undefined) {
			return {
				start: [0, 0],
				end: [0, 0],
				angle: 0,
				len: 0,
				dim: [0, 0],
			};
		}
		const x1 = DimensionTools.p1.origin[0];
		const y1 = DimensionTools.p1.origin[1];
		const x2 = DimensionTools.p2.origin[0];
		const y2 = DimensionTools.p2.origin[1];

		const dx = x2 - x1;
		const dy = y2 - y1;
		// angle in degrees
		const angle = Math.atan2(dy, dx) * 180 / Math.PI;
		const len = Math.sqrt(dx * dx + dy * dy);

		const x3 = x1 + dx / 2;
		const y3 = y1 + dy / 2;

		return {
			start: [x1, y1],
			end: [x2, y2],
			angle,
			len,
			dim: [x3, y3],
		};
	}

	static convertDim(x1:number, y1:number, x2:number, y2:number,): Dimension {
		const dx = x2 - x1;
		const dy = y2 - y1;
		// angle in degrees
		const angle = Math.atan2(dy, dx) * 180 / Math.PI;
		const len = Math.sqrt(dx * dx + dy * dy);

		const x3 = x1 + dx / 2;
		const y3 = y1 + dy / 2;

		return {
			start: [x1, y1],
			end: [x2, y2],
			angle,
			len,
			dim: [x3, y3],
		};
	}


}

export { DimensionTools , Dimension};
