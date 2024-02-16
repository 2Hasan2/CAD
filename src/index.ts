import './styles/main.scss';
import CADGrid from './scripts/interfaces/grid';
import ToolBoard from './scripts/interfaces/ToolBoard';

// event listeners
import { Keyboard } from './scripts/events/KeyBoard';
import { Mouse } from './scripts/events/Mouse';

// dimension tool
import { DimensionTools } from './scripts/entities/Dimensions';

// shapes
import {Circle, Line, Point, Shape} from './scripts/entities/Shapes';

// dxf writer
import DXF from './scripts/utils/dxf';

const cadGrid = new CADGrid('canvas');
const toolBoard = new ToolBoard();

let pos= {x: 0, y: 0};
let is_first= true;
let shape : Shape | null = null;

// watch for the tool change use proxy
let handler = {
	set: function (obj: any, prop: string, value: any) {
		obj[prop] = value;
		if (prop === "tool") {
			if (value === "dimension") {
			}
		}
		return true;
	}
}



let tool = new Proxy({tool: ""}, handler);


Mouse.click((event) => {
	if(!(event.target instanceof HTMLCanvasElement)) return;

	if(tool.tool === "dimension"){
		if(DimensionTools.p1 === undefined){
			if (cadGrid.hoverShape(event)){
				DimensionTools.setP1(cadGrid.hoverShape(event) as Point);
			}
		} else if(DimensionTools.p2 === undefined){
			if (cadGrid.hoverShape(event)) {
				DimensionTools.setP2(cadGrid.hoverShape(event) as Point);
				const dim = DimensionTools.DimTwoPoints();
				cadGrid.addDims(dim);
				DimensionTools.p1 = undefined;
				DimensionTools.p2 = undefined;
				tool.tool = "";
			}
		}
		return;
		
	}
	
	if (!shape) return;
	if(is_first && shape.type !== 'point'){
		pos= cadGrid.getMousePosition(event);
		shape.setPos(pos.x, pos.y, pos.x, pos.y);
		cadGrid.demoShape = shape;
		is_first= false;
	} else if (shape.type === 'point'){
		pos= cadGrid.getMousePosition(event);
		shape.setPos(pos.x, pos.y, pos.x, pos.y);
		cadGrid.addShape(shape);
		is_first= true;
	} else {
		const end_pos = cadGrid.getMousePosition(event);
		shape.setPos(pos.x, pos.y, end_pos.x, end_pos.y);
		pos = end_pos
		cadGrid.addShape(shape);
	}
})


Mouse.move((event)=>{
	
		if (tool.tool === "dimension" && DimensionTools.p1 !== undefined && DimensionTools.p2 === undefined) {
			const dim = DimensionTools.convertDim(DimensionTools.p1.origin[0], DimensionTools.p1.origin[1], cadGrid.getMousePosition(event).x, cadGrid.getMousePosition(event).y);
			console.log('from' , dim.start, 'to', dim.end, 'dim', dim.dim);
			
			cadGrid.drawDims(dim);
		} else{
			if (is_first || !shape) return;
			const end_pos= cadGrid.getMousePosition(event);
			shape.setPos(pos.x, pos.y, end_pos.x, end_pos.y);
			cadGrid.demoShape = shape;
		}
		
		cadGrid.drawGrid();
})

Keyboard.click((event)=>{
	if(event.key === 'Escape'){
		is_first= true;
		cadGrid.demoShape = undefined
		shape = null;
		tool.tool = ""
		cadGrid.drawGrid();
	}
})

Keyboard.click((event)=>{
		if (event.code === 'Digit1'){
			shape = new Line(pos.x, pos.y, pos.x, pos.y);
		} else if (event.code === 'Digit2'){
			shape = new Circle(pos.x, pos.y, pos.x, pos.y);
		} else if (event.code === 'Digit3'){
			shape = new Point(pos.x, pos.y);
		}
		cadGrid.drawGrid();
})

toolBoard.click((event)=>{
		if(toolBoard.getTool()==="line"){
			shape = new Line(pos.x, pos.y, pos.x, pos.y);
		} else if(toolBoard.getTool()==="circle"){
			shape = new Circle(pos.x, pos.y, pos.x, pos.y);
		} else if(toolBoard.getTool()==="point"){
			shape = new Point(pos.x, pos.y);
		}
})


// when click on download-dxf
document.getElementById('dxf')?.addEventListener('click', ()=>{
	tool.tool = "dxf";
	DXF.Save(cadGrid.copyShapes());
	DXF.Download();
})

// handle dimension
document.getElementById('dimension')?.addEventListener('click', (event)=>{
	tool.tool = "dimension";
})
