import Point from './Point.js';
export default abstract class GraphElement {
    abstract isEqual(element: GraphElement): boolean;
    abstract orthoProjection(P: Point): Point;
    distance(P: Point): number;
}
