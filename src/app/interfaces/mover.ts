import { Couzin2002Model } from '../services/models/couzin2002/couzin2002.service';

/**
 * Mover class. Defines general properties
 */
export class Mover {
    id: number;
    sx: number;
    sy: number;
    theta: number;
    // tslint:disable-next-line: variable-name
    _body_size = 5;
    cid: number;


    constructor(id: number, sx: number, sy: number, cid: number, theta: number) {
        this.id = id;
        this.sx = sx;
        this.sy = sy;
        this.theta = theta;
        this.cid = cid;
        this.parameterSubscription();
    }

    /**
     * Subscribe to parameter controls
     */
    parameterSubscription() {
        Couzin2002Model.paramService.bodySizeSource$.subscribe(d => { this._body_size = d; });
    }

    /**
     * Movers body size
     */
    get bodySize() {
        return this._body_size;
    }
}
