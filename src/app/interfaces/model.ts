/**
 * Model interface
 */
export interface Model {
    /**
     * Execute model. Move agents.
     * @param movers List<Mover>
     */
    move(movers: any[]): any[];

    /**
     * Model name
     */
    name(): string;

}

