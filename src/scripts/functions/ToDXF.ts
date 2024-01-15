import * as makerjs from 'makerjs';

function generateDXF(shapes: any[], filename: string) {
	const pathObject: { [key: string]: any } = {};

	for (let i = 0; i < shapes.length; i++) {
		const shape = shapes[i];
		pathObject['shape' + i] = shape;
	}

	const model = { paths: pathObject };

	const dxf = makerjs.exporter.toDXF(model);

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


// Usage example
// const line = {
// 	type: 'line',
// 	origin: [0, 0],
// 	end: [50, 50]
// };

// const circle = {
// 	type: 'circle',
// 	origin: [0, 0],
// 	radius: 50
// };

// const circle2 = {
// 	type: 'circle',
// 	origin: [0, 0],
// 	radius: 25
// };

// const shapes = [line, circle, circle2];
// const filename = 'test.dxf';

// generateDXF(shapes, filename);
