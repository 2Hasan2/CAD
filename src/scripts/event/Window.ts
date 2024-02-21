// make class window to be for hanlding window events
export class Window {
  // make a static method to handle the window resize event
  static resize(callback: (event: Event) => void) {
	window.addEventListener('resize', callback);
  }
  // make a static method to handle the window scroll event
  static scroll(callback: (event: Event) => void) {
	window.addEventListener('scroll', callback);
  }
}