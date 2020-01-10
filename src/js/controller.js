import { slurpPoint, loop, slurp, clamp } from "./util";

const SIDE = 20;
const HEIGHT = 2 * SIDE;
const WIDTH = Math.sqrt(3) * SIDE;

export default class Controller {

	constructor() {
		this.animAmt = 0;
		this.period = 10;
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
		context.strokeStyle = 'black';
		context.lineWidth = 1;
		this.renderAllPatterns(context, this.animAmt + 0.5);
		context.strokeStyle = 'white';
		context.lineWidth = 3;
		this.renderAllPatterns(context, this.animAmt);
		context.strokeStyle = 'black';
		context.lineWidth = 1;
		this.renderAllPatterns(context, this.animAmt - 0.5);
	}

	/**
	 * @param {!CanvasRenderingContext2D} context
	 */
	renderAllPatterns(context, animAmt) {
		const patternRepeatRadius = 2 * WIDTH;
		const sides = 6;
		const layers = 9;
		for (var l = 0; l < layers; l++) {

			const localAnimAmt = 20 * animAmt - 3 * l;

			for (let s = 0; s < sides; s++) {
				const angle = 2 * Math.PI * s / sides;
				const nextAngle = 2 * Math.PI * (s + 1) / sides;

				const shapesPerLayer = l == 0 ? 1 : l;
				for (let i = 0; i < shapesPerLayer; i++) {
					const amt = i / shapesPerLayer;
					
					const x = l * patternRepeatRadius * slurp(Math.cos(angle), Math.cos(nextAngle), amt);
					const y = l * patternRepeatRadius * slurp(Math.sin(angle), Math.sin(nextAngle), amt);

					context.save();
					context.translate(x, y);
					this.renderStarPatternThing(context, 2 + s, 2 + s, localAnimAmt);
					context.restore();
				}
			}
		}
	}

	/**
	 * @param {!CanvasRenderingContext2D} context
	 */
	renderStarPatternThing(context, startI, endI, animAmt) {
		for (let i = startI; i <= endI; i++) {
			context.save();
			context.rotate(i * 2 * Math.PI / 6);
			this.renderZigZags(context, animAmt);
			context.restore();
		}
	}

	/**
	 * @param {!CanvasRenderingContext2D} context
	 */
	renderZigZags(context, animAmt) {
		this.renderZigZag(context, animAmt, 1);
		this.renderZigZag(context, animAmt, -1);
	}

	/**
	 * @param {!CanvasRenderingContext2D} context
	 */
	renderZigZag(context, animAmt, direction = 1) {
		const points = [
			{
				x: -WIDTH / 2,
				y: -HEIGHT / 4,
			},
		];

		const lines = [
			{
				x: 0,
				y: -SIDE * 2,
			},
			{
				x: WIDTH,
				y: -SIDE,
			},
		]

		let lineIndex = direction == 1 ? 0 : 1;

		for (let i = 0; i < Math.ceil(animAmt); i++) {
			const line = lines[lineIndex];
			lineIndex = 1 - lineIndex;
			const lastPoint = points[points.length - 1];
			const newPoint = {
				x: lastPoint.x + direction * line.x,
				y: lastPoint.y + direction * line.y,
			}
			points.push(newPoint);
		}

		context.beginPath();
		context.moveTo(points[0].x, points[0].y);

		let remainingLength = animAmt;
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
