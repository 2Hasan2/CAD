<body>
    <h1>TypeScript DXF Generator</h1>
    <p>This TypeScript code allows you to programmatically generate DXF (Drawing Exchange Format) documents.</p>
    <h2>Usage</h2>
    <p>To use this code, follow these steps:</p>
    <ol>
        <li>Include the <code>DXF_MAKER</code> class in your TypeScript project.</li>
        <li>Use the provided classes to create geometric shapes, patterns, or perform mirror operations.</li>
        <li>Call the appropriate methods of the <code>DXF_MAKER</code> class to add shapes or patterns.</li>
        <li>Finally, call the <code>generateDXF</code> method of the <code>DXF_MAKER</code> class to generate the DXF
            document.</li>
    </ol>
    <h2>Classes</h2>
    <p>The following classes are available:</p>
    <ul>
        <li><code>Point</code>: Represents a point in 2D space.</li>
        <li><code>Line</code>: Represents a line segment.</li>
        <li><code>Circle</code>: Represents a circle.</li>
        <li><code>Arc</code>: Represents an arc.</li>
        <li><code>Rectangle</code>: Represents a rectangle.</li>
        <li><code>Polygon</code>: Represents a polygon defined by its vertices.</li>
        <li><code>LinearPattern</code>: Represents a linear pattern of entities.</li>
        <li><code>CircularPattern</code>: Represents a circular pattern of entities.</li>
        <li><code>Mirror</code>: Represents a mirror operation along the x-axis or y-axis.</li>
        <li><code>DXFDocument</code>: Represents a DXF document and manages the collection of shapes.</li>
        <li><code>DXF_MAKER</code>: Provides static methods for adding shapes, patterns, or mirrors, and for generating
            the DXF document.</li>
    </ul>
    <h2>Example</h2>
    <p>Here's a simple example of how to use the code:</p>
    <pre><code>
import DXF_MAKER from './DXF_MAKER';

// Create some shapes
DXF_MAKER.addCircle(0, 0, 10);
DXF_MAKER.addRectangle(20, 20, 30, 40);

// Generate the DXF document
const dxfString = DXF_MAKER.generateDXF();

console.log(dxfString);
</code></pre>
    <h2>Contributing</h2>
    <p>Contributions are welcome! Feel free to fork this repository and submit pull requests.</p>
    <h2>License</h2>
    <p>This code is licensed under the MIT License. See the <code>LICENSE</code> file for details.</p>
</body>
