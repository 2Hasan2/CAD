import './styles/main.scss';
import CADGrid from './scripts/interfaces/grid';

// event listeners
import { Keyboard } from './scripts/events/KeyBoard';
import { Mouse } from './scripts/events/Mouse';
import {Window} from './scripts/events/Window';

// shapes
import {Circle, Line, Point, Shape} from './scripts/shapes/Shapes';

const cadGrid = new CADGrid('canvas');



let pos= {x: 0, y: 0};
let is_first= true;
let shape : Shape | null = null;


Mouse.click((event) => {
	if (!shape) return;
	if(is_first){
		console.log('start drawing shape');
		pos= cadGrid.getMousePosition(event);
		shape.setPos(pos.x, pos.y, pos.x, pos.y);
		cadGrid.demoShape = shape;
		is_first= false;
	}else{
		const end_pos= cadGrid.getMousePosition(event);
		shape.setPos(pos.x, pos.y, end_pos.x, end_pos.y);
		pos = end_pos
		cadGrid.addShape(shape);
		console.log("added shape");
		
	}
})

Mouse.move((event)=>{
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