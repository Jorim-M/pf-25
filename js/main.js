import {
	Gradient
} from './Gradient.js'

// Create your instance
const gradient1 = new Gradient()

const gradient2 = new Gradient()

const gradient3 = new Gradient()

const gradient4 = new Gradient()

const gradient5 = new Gradient()

// Call `initGradient` with the selector to the canvas
gradient1.initGradient('.canvas-1');
gradient2.initGradient('.canvas-2');
gradient3.initGradient('.canvas-3');
gradient4.initGradient('.canvas-4');
gradient5.initGradient('.canvas-5');

export {
	Gradient
}