const CONFIG = {
    N: 50,                  // number of movers
    PLACEMENT: 'RANDOM',    // placement method: RANDOM or CLUSTER
    CLUSTER: 3,             // number of cluster
    ARENA_WIDTH: 1200,      // real world arena width
    ARENA_HEIGHT: 800,      // arena height
    SCREEN_WIDTH: 600,      // screen dimensions for intialization
    SCREEN_HEIGHT: 300,     // screen dimensions for intialization
    WALL_OFFSET: 50         // offset to avoid wall collision,e.g.start
                            // avoidance maneuver
};

export default CONFIG;
