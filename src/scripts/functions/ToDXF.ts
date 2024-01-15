import * as makerjs from 'makerjs';

function generateDXF(shapes: any[], filename: string) {
	const pathObject: { [key: string]: any } = {};

	for (let i = 0; i < shapes.length; i++) {
		const shape = shapes[i];
		pathObject['shape' + i] = shape;
	}

	const model = { paths: pathObject };

	const dxf = makerjs.exporter.toDXF(fixY(model))

	// Create a Blob with the DXF content
	const blob = new Blob([dxf], { type: 'application/dxf' });

	// Create a link element
	const link = document.createElement('a');

	// Set the link's href attribute to the Blob URL
	link.href = window.URL.createObjectURL(blob);

	// Set the download attribute with the desired filename
	link.download = filename;

	// Append the link to the document
	document.body.appendChild(link);

	// Trigger a click on the link to start the download
	link.click();

	// Remove the link from the document after the download is complete
	document.body.removeChild(link);
}

export default generateDXF;


// multiple y axis in -1 because of the canvas coordinate system
function fixY(model : any) {
	let shapes=Object.keys(model.paths);
	for (let shape of shapes) {
		model.paths[shape].origin[1] = -model.paths[shape].origin[1];
		model.paths[shape].end[1] = -model.paths[shape].end[1];
		if (model.paths[shape].type == 'circle' || model.paths[shape].type == 'arc') {
			model.paths[shape].radius = -model.paths[shape].radius;
		} 
	}
	return model;
}