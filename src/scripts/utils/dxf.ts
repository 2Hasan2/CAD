import { DxfWriter,Units, point3d} from "@tarikjabiri/dxf";
import { Circle, Line, Point } from "../entities/Shapes";


let dxf = new DxfWriter();
Init();

function Save(Shapes : any[] ){
	Clear();
	Shapes.forEach(shape => {
		if (shape.type === 'line') {
			dxf.addLine(point3d(shape.origin[0], shape.origin[1]), point3d(shape.end[0], shape.end[1]));
		} else if (shape.type === 'circle') {
			dxf.addCircle(point3d(shape.origin[0], shape.origin[1]), shape.radius);
		} else if (shape.type === 'point') {
			dxf.addPoint(shape.origin[0], shape.origin[1], 0);
		}
	});
}

function Init(){
	dxf.setUnits(Units.Millimeters);
	dxf.addLType("AXES", "____ _ ", [4, -1, 1, -1]);
	dxf.tables.addAppId("TEST_APPID");
}

function Clear(){
	dxf = new DxfWriter();
	Init();
}

function Download(filename: string = 'drawing'){
	const dxfString = dxf.stringify();
	const blob = new Blob([dxfString], { type: 'text/plain' });
	const url = window.URL.createObjectURL(blob);
	const a = document.createElement('a');
	a.href = url;
	a.download = `${filename}.dxf`;
	a.click();
}

const DXF = {
	Download,
	Save,
}

export default DXF;
