import { Line, Circle, Arc, Rectangle, Point, Polygon, LinearPattern, CircularPattern, Mirror } from '../scripts/DXF/dxf';
import Canvas from '../components/Canvas';

class CAD {
	private Canvas: Canvas;
	constructor(canvasId: string) {
		this.Canvas = new Canvas(document.getElementById(canvasId) as HTMLCanvasElement);
	}
}
	
export default CAD;

