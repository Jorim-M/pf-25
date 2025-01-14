// Importing utility functions from 'utils.js'
import { getPointerPos, getMouseDistance, lerp } from '../utils.js';
import { Image } from '../image.js';

// Initial declaration of mouse position variables with default values
let mousePos = {x: 0, y: 0}; // current mouse position
let cacheMousePos = {...mousePos}; // smoothed mouse position
let lastMousePos = {...mousePos}; // last mouse position at the time of image display

// This function will be used to handle both mouse and touch events
const handlePointerMove = (ev) => {
    // If it's a touch event, use the first touch point
    if (ev.touches) {
        mousePos = getPointerPos(ev.touches[0]);
    } else {
        // If it's a mouse event, use the event object
        mousePos = getPointerPos(ev);
    }
};

// Adding event listeners to update mouse position on mousemove or touchmove
window.addEventListener('mousemove', handlePointerMove);
window.addEventListener('touchmove', handlePointerMove);

export class ImageTrail {
    // Class properties initialization
    DOM = {el: null}; // Object to hold DOM elements
    images = []; // Array to store Image objects
    imagesTotal = 0; // Total number of images
    imgPosition = 0; // Position of the next image
    zIndexVal = 1; // z-index value for the next image
    activeImagesCount = 0; // Counter for active images
    isIdle = true; // Flag to check if all images are inactive
    threshold = 100; // Mouse distance threshold for displaying the next image

    /**
     * Constructor for the ImageTrail class.
     * Initializes the instance, sets up the DOM elements, creates Image objects, and starts rendering.
     * @param {HTMLElement} DOM_el - The parent DOM element containing all image elements.
     */
    constructor(DOM_el) {
        this.DOM.el = DOM_el;

        // Create and store Image objects for each image element within the parent element.
        this.images = [...this.DOM.el.querySelectorAll('.content__img')].map(img => new Image(img));
        
        this.imagesTotal = this.images.length; // Store total number of images

        const onPointerMoveEv = () => {
            cacheMousePos = {...mousePos}; // Initialize cacheMousePos with current mousePos
            requestAnimationFrame(() => this.render()); // Start rendering loop
            // Remove this listener after initialization
            window.removeEventListener('mousemove', onPointerMoveEv);
            window.removeEventListener('touchmove', onPointerMoveEv);
        };

        window.addEventListener('mousemove', onPointerMoveEv);
        window.addEventListener('touchmove', onPointerMoveEv);
    }

    /**
     * The `render` function updates images based on mouse movement in a loop.
     */
    render() {
        const distance = getMouseDistance(mousePos, lastMousePos); // Calculate mouse movement distance

        // Smoothly interpolate cached mouse position
        cacheMousePos.x = lerp(cacheMousePos.x || mousePos.x, mousePos.x, 0.1);
        cacheMousePos.y = lerp(cacheMousePos.y || mousePos.y, mousePos.y, 0.1);

        // Show the next image if the distance exceeds the threshold
        if (distance > this.threshold) {
            this.showNextImage();
            lastMousePos = {...mousePos};
        }

        // Reset zIndex if idle
        if (this.isIdle && this.zIndexVal !== 1) {
            this.zIndexVal = 1;
        }

        requestAnimationFrame(() => this.render()); // Continue rendering loop
    }

    /**
     * Displays and animates the next image in the sequence.
     */
    showNextImage() {
        ++this.zIndexVal; // Increment zIndex for the next image

        // Get the next image or loop back to the first image
        this.imgPosition = this.imgPosition < this.imagesTotal - 1 ? this.imgPosition + 1 : 0;
        const img = this.images[this.imgPosition];

        // Stop ongoing animations on the image
        gsap.killTweensOf(img.DOM.el);

        // Create GSAP animations
        img.timeline = gsap.timeline({
            onStart: () => this.onImageActivated(),
            onComplete: () => this.onImageDeactivated()
        })
        .fromTo(img.DOM.el, {
            opacity: 1,
            scale: 0,
            zIndex: this.zIndexVal,
            x: cacheMousePos.x - img.rect.width / 2,
            y: cacheMousePos.y - img.rect.height / 2
        }, {
            duration: 0.4,
            ease: 'power1',
            scale: 1,
            x: mousePos.x - img.rect.width / 2,
            y: mousePos.y - img.rect.height / 2
        })
        .fromTo(img.DOM.inner, {
            scale: 2.8,
            filter: 'brightness(250%)'
        }, {
            duration: 0.4,
            ease: 'power1',
            scale: 1,
            filter: 'brightness(100%)'
        }, 0)
        .to(img.DOM.el, {
            duration: 0.4,
            ease: 'power2',
            opacity: 0,
            scale: 0.2
        }, 0.45);
    }

    onImageActivated = () => {
        this.activeImagesCount++;
        this.isIdle = false;
    }

    onImageDeactivated = () => {
        this.activeImagesCount--;
        if (this.activeImagesCount === 0) {
            this.isIdle = true;
        }
    }
}
