import generateDXF from './functions/ToDXF';
import {Line,Circle,Arc,Shape} from './interfaces/Shapes';
import cadGrid from './grid';


interface group {
    id: string;
    name: string;
    tools: Tool[];
}

interface Tool {
    name: string;
    id: string;
    icon: string;
    action: () => void;
}


class ToolsBar{
    private groups: group[] = [];
    constructor() {
        // create tools
        // group 1
        const group1: group = {
            id: 'shapes',
            name: 'shapes',
            tools: [
                {
                    name:"line",
                    id:"line",
                    icon:"line",
                    action: () => {
                        cadGrid.setCurrShape('line');
                    }
                },
                {
                    name:"circle",
                    id:"circle",
                    icon:"circle",
                    action: () => {
                        cadGrid.setCurrShape('circle');
                    }
                },
                {
                    name:"arc",
                    id:"arc",
                    icon:"arc",
                    action: () => {
                        console.log('arc');
                    }
                }
            ]
        };
        // group 2
        const group2: group = {
            id: 'tools',
            name: 'tools',
            tools: [
                {
                    name:"eraser",
                    id:"eraser",
                    icon:"eraser",
                    action: () => {
                        console.log('eraser');
                    }
                }
            ]
        };
        // group 3
        const group3: group = {
            id: 'patterns',
            name: 'patterns',
            tools: [
                {
                    name:"circular",
                    id:"circular",
                    icon:"circular",
                    action: () => {
                        console.log('circular');
                    }
                },
                {
                    name:"linear",
                    id:"linear",
                    icon:"linear",
                    action: () => {
                        console.log('linear');
                    }
                }
  
            ]
        };
        // group 4
        const group4: group ={
            id: "hand",
            name: "hand",
            tools: [
                {
                    name:"move",
                    id:"move",
                    icon:"move",
                    action: () => {
                        const hand = document.getElementById('move');
                        cadGrid.toggleMoveHand();
                        if (hand !== null) {
                            hand.innerText === 'move' ? hand.innerText = 'stop' : hand.innerText = 'move';
                        }
                    }
                },
            ]
        }
        // group 5
        const group5: group ={
           id: "download",
            name: "download",
                tools: [
                    {
                        name:"download",
                        id:"download",
                        icon:"download",
                        action: () => {
                            let file_name = prompt("Please enter file name");
                            file_name = file_name? file_name : 'cad' ;
                            generateDXF(cadGrid.getShapes(), `${file_name}.dxf`);
                        }
                    }
                ]
        }
        // add groups
        this.groups.push(group1, group2, group3, group4, group5);

        this.render();
    }

    render() {
        const toolbar = document.createElement('div');
        toolbar.setAttribute('id', 'toolbar');
        toolbar.setAttribute('class', 'toolbar');
        const outputElement = document.getElementById('navbar');
        outputElement!.appendChild(toolbar);

        this.groups.forEach(group => {
            const groupEl = document.createElement('div');
            groupEl.setAttribute('id', group.id);
            groupEl.setAttribute('class', 'group');
            toolbar.appendChild(groupEl);

            const groupName = document.createElement('div');
            groupName.setAttribute('class', 'group-name');
            groupName.innerHTML = group.name;
            groupEl.appendChild(groupName);

            const tools = document.createElement('div');
            tools.setAttribute('class', 'tools');
            groupEl.appendChild(tools);

            group.tools.forEach(tool => {
                const toolEl = document.createElement('div');
                toolEl.setAttribute('id', tool.id);
                toolEl.setAttribute('class', 'tool');
                toolEl.innerHTML = tool.name;
                tools.appendChild(toolEl);
                toolEl.addEventListener('click', tool.action);
            });
        });
    }


    
}


const toolBar = new ToolsBar();

// style
// Path: src/styles/ToolBar.css
// toolbar.css
// -----------
