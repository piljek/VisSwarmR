import * as d3 from 'd3';
import Couzin2002Parameters from '../../models/couzin2002/couzin2002.parameters';
import { Couzin2002Model } from '../../models/couzin2002/couzin2002.service';
import { Mover } from '../../../interfaces/mover';

/**
 * Mover class for zonal model (Couzin)
 */
export class ZonalMover extends Mover  {
    id: number;
    sx: number;
    sy: number;
    px: number;
    py: number;
    collides = false;
    theta: number;
    _tx: number;
    _ty: number;


    _zor?: number;
    _zoo?: number;
    _zoa?: number;
    thetaChange?: number;
    wantedx: number;
    wantedy: number;
    _perception_field: number;
    interacting: boolean;
    debug_perception: number;
    _perception_length: number;
    params: Couzin2002Parameters;
    _body_size: number;
    _turning_noise: number;
    _turning_rate: number;

    /**
     * Mover class for Couzin model
     * @param id Mover id
     * @param sx x-Position in arena coordinates
     * @param sy y-Position in arena coordinates
     */

    constructor(id: number, sx: number, sy: number, cid: number, theta: number) {
        super(id, sx, sy, cid, theta);
        this.thetaChange = theta;
        this.debug_perception = 0;

        // Couzin Parameter subscription
        this.parameterSubscription();

    }

    /**
     * Subscribe to parameter controls
     */
    parameterSubscription() {

        Couzin2002Model.paramService.zooSource$.subscribe(d => { this._zoo = d; });
        Couzin2002Model.paramService.zoaSource$.subscribe(d => { this._zoa = d; });
        Couzin2002Model.paramService.percFieldSource$.subscribe(d => { this._perception_field = d; });
        Couzin2002Model.paramService.percLengthSource$.subscribe(d => { this._perception_length = d; });
        Couzin2002Model.paramService.bodySizeSource$.subscribe(d => { this._body_size = d; });
        Couzin2002Model.paramService.turningNoiseSource$.subscribe(d => { this._turning_noise = d; });
        Couzin2002Model.paramService.maxTurnSource$.subscribe(d => { this._turning_rate = d; });
    }

    /**
     * x-position in arena coordinates
     */
    x(): number {
        return this.sx;
    }

    /**
     * x-position in arena coordinates
     */
    y() {
        return this.sy;
    }

    /**
     * Cluster color mover belongs to.
     */
    color() {
        if (this.cid < 0) { return 'black'; }
        return d3.schemeCategory10[this.cid % 10];
    }

    /**
     * Set boolean if mover collides with others
     */
    set collide(collides: boolean) {
        this.collides = collides;
    }

    /**
     * Zone of repulsion
     */
    get zor() {
        return Couzin2002Parameters.getZoR();
        return this._zor;
    }

    /**
     * Zone of orientation
     */
    get zoo() {
        // return Couzin2002Parameters.zoo
        return this._zoo;
    }
    /**
     * Zone of attraction
     */
    get zoa() {
        return this._zoa;
    }
    /**
     * Documented in paper as alpha: Blind spot = 360° - alpha <-- perception field.
     * Directly implemented as field of vision (alpha = field of perception)
     */
    get perception_field() {
        return this._perception_field;
    }

    /**
     * Visual perception length. Only used for visualization
     */
    get perception_length() {
        return this._perception_length;
    }

    /**
     * Set color to red if mover collides with others
     */
    get collisionColor() {
        if (this.collides) {
            return d3.schemeSet1[0];
        }
        return 'none';
    }

    /**
     * Set color for movers within zoo
     */
    get orientationColor() {
        if (this.collides) {
            return 'none'; // d3.schemeSet1[1];
        }
        return 'none';
    }

    /**
     * Set color for movers within zoa
     */
    get attractionColor() {
        if (this.collides) {
            return 'none'; // d3.schemeSet1[2];
        }
        return 'none';
    }

    /**
     * Translates x-coordinate using orientation angle theta
     */
    public tx() {
        this._tx = Math.cos(this.theta * Math.PI / 180);
        // console.log(this.id + " has tx " + this._tx)
        return this._tx;
    }

    /**
     * Translates y-coordinate using orientation angle theta
     */
    public ty() {
        this._ty = Math.sin(this.theta * Math.PI / 180);
        return this._ty;
    }

    /**
     * Movers body size
     */
    get bodySize() {
        return this._body_size;
    }

}
