import { ParameterControlService } from '../../parameter-controls/parameter.service';
/**
 * Couzin paramaters to be used in zonal mover class.
 */
export default class Couzin2002Parameters {



    constructor(private readonly paramService: ParameterControlService) {
        this.paramService.zorSource$.subscribe(d => { Couzin2002Parameters._zor = d; });
        this.paramService.zooSource$.subscribe(d => { this._zoo = d; });
        this.paramService.zoaSource$.subscribe(d => { this._zoa = d; });
        this.paramService.maxTurnSource$.subscribe(d => { this._turningRate = d; });
        this.paramService.percFieldSource$.subscribe(d => { this._perception_field = d; });
        this.paramService.percLengthSource$.subscribe(d => { this._perception_length = d; });
        this.paramService.turningNoiseSource$.subscribe(d => { this._noise = d; });
        this.paramService.bodySizeSource$.subscribe(d => { this._body_size = d; });
        this.paramService.velocitySource$.subscribe(d => {this._velocity = d; });
    }

    //  _zor: number;
    static zoo: number;
    static zoa: number;
    static turningRate: number;
    static _zor: number;
    _velocity: number;
    _zoo: number;
    _zoa: number;
    _turningRate: number;
    _perception_field: number;
    _perception_length: number;
    _noise: number;
    _body_size: number;

    /**
     * Get zoo for debug visualization
     */
    static getZoR() {
        return this._zor;
    }

}
