import Canvas from '../components/Canvas';
import DXF_MAKER from '../scripts/DXF/dxf';

class CAD {
	private Canvas: Canvas;
	constructor(canvasId: string) {
		this.Canvas = new Canvas(document.getElementById(canvasId) as HTMLCanvasElement);
		// use dxf maker to create a dxf file
		let DXF = new DXF_MAKER();

		DXF.addLine({ x: 0, y: 15 }, { x: 20, y: 0 },this.Canvas.ctx)
		DXF.addCircle({x:0, y:0}, 40, this.Canvas.ctx)

		this.Canvas.BindDraws(DXF.getShapes())
	}
}
	
export default CAD;

