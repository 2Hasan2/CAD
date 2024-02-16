// make class Keyboard to be for handling keyboard events
class Keyboard {
	static press(callback: (event: KeyboardEvent) => void) {
		window.addEventListener("keypress", (event) => {
			event.preventDefault();
			callback(event);
		});
	}

	static click(callback: (event: KeyboardEvent) => void) {
		window.addEventListener("keydown", (event) => {
			event.preventDefault();
			callback(event);
		});
	}

}

export { Keyboard };
