import './styles/main.scss';
import CADGrid from './scripts/interfaces/grid';
import ToolBoard from './scripts/interfaces/ToolBoard';

// event listeners
import { Keyboard } from './scripts/events/KeyBoard';
import { Mouse } from './scripts/events/Mouse';

// shapes
import {Circle, Line, Point, Shape} from './scripts/entities/Shapes';


// dxf writer
import DXF from './scripts/utils/dxf';


const cadGrid = new CADGrid('canvas');
const toolBoard = new ToolBoard();

let pos= {x: 0, y: 0};
let is_first= true;
let shape : Shape | null = null;


Mouse.click((event) => {
	if(!(event.target instanceof HTMLCanvasElement)) return;
	
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
		cadGrid.hoverShape(event);
		if (is_first || !shape) return;
		const end_pos= cadGrid.getMousePosition(event);
		shape.setPos(pos.x, pos.y, end_pos.x, end_pos.y);
		cadGrid.demoShape = shape;
		cadGrid.drawGrid();
})

Keyboard.click((event)=>{
	if(event.key === 'Escape'){
		is_first= true;
		cadGrid.demoShape = null;
		shape = null;
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
document.getElementById('download-dxf')?.addEventListener('click', ()=>{
	DXF.Save(cadGrid.copyShapes());
	DXF.Download();
})