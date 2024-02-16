class Mouse {
	  // make a static method to handle the mouse move event
  static move(callback: (event: MouseEvent) => void) {
	window.addEventListener('mousemove', (event) => callback(event));
  }
  // make a static method to handle the mouse down event
  static down(callback: (event: MouseEvent) => void) {
	window.addEventListener('mousedown', (event) => callback(event));
  }
  // make a static method to handle the mouse up event
  static up(callback: (event: MouseEvent) => void) {
	window.addEventListener('mouseup', (event) => callback(event));
  }

  static click(callback: (event: MouseEvent) => void) {
    window.addEventListener('click', (event) => callback(event));
  }

  static leave(callback: (event: MouseEvent) => void) {
    window.addEventListener('mouseleave', (event) => callback(event));
  }

}

export { Mouse };
