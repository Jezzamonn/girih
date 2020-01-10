import { slurpPoint, loop } from "./util";

const SIDE = 20;
const HEIGHT = 2 * SIDE;
const WIDTH = Math.sqrt(3) * SIDE;

export default class Controller {

	constructor() {
		this.animAmt = 0;
		this.period = 3;
	}

	/**
	 * Simulate time passing.
	 *
	 * @param {number} dt Time since the last frame, in seconds 
	 */
	update(dt) {
		this.animAmt += dt / this.period;
		this.animAmt %= 1;
	}

	/**
	 * Render the current state of the controller.
	 *
	 * @param {!CanvasRenderingContext2D} context
	 */
	render(context) {
		for (let i = 0; i < 6; i++) {
			this.renderZigZag(context, this.animAmt);
			context.rotate(2 * Math.PI / 6);
		}
	}

	/**
	 * @param {!CanvasRenderingContext2D} context
	 */
	renderZigZag(context, amt) {
		const points = [
			{
				x: -WIDTH / 2,
				y: HEIGHT / 4,
			},
		];

		for (let i = 0; i < 5; i++) {
			{
				const lastPoint = points[points.length - 1];
				const newPoint = {
					x: lastPoint.x,
					y: lastPoint.y - SIDE * 2,
				}
				points.push(newPoint);
			}
			{
				const lastPoint = points[points.length - 1];
				const newPoint = {
					x: lastPoint.x + WIDTH,
					y: lastPoint.y - SIDE,
				}
				points.push(newPoint);
			}
		}

		context.beginPath();
		context.strokeStyle = 'black';
		context.moveTo(points[0].x, points[0].y);

		const totalLength = points.length - 1;
		let remainingLength = amt * totalLength;
		for (let i = 1; i < points.length && remainingLength > 0; i++) { 
			let point = points[i];
			if (remainingLength < 1) {
				point = slurpPoint(points[i - 1], points[i], remainingLength);
			}
			context.lineTo(point.x, point.y);
			remainingLength --;
		}
		context.stroke();
	}

}
