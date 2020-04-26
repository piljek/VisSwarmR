export const MODELS = {
    MODEL_COUZIN_2002: {
        id: 'Couzin (2002)',        // model id
        zor: 5,                     // zone of repulsion: collision avoidance behavior
        zoo: 30,                    // zone of alignment: coordinated polarized group movement
        zoa: 50,                    // zone of attraction: attraction behavior
        perception_field: 270,      // field of vision ranging from 0-360°
        perception_length: 50,      // length of perception: code related to zoa
        velocity: 2,                // mover's velocity
        speed: 1.2,                 // agent speed
        turning_rate: 20,           // animal ability to turn in degrees (0-360°)
        turning_noise: 5,           // adds noise to turning_rate (+- noise)
        body_size: 5                // spatial extent of mover
    },
    MODEL_REYNOLDS_1999: {
        id: 'Reynolds (1999)',      // model id
        mass: 20,                   // boid mass
        velocity: 3,                // agent velocity
        max_force: .1,              // limitation of steering force
        max_speed: 2,               // maximum speed of mover
        neighborhood_radius: 10,    // collision radius

        // wander behavior
        wanderRadius: 25,           // variation of desired direction
        wanderDist: 10,             // step size for predicted movement step in next iteration
        wanderChange: 10,           // noise to resulting desired direction

        // flocking
        alignment_radius: 50,       // alignment radius for coordinated movement in flocking
        cohesion_radius: 100,       // cohesion radius in which neighbours are attracted

        // forces
        separationForce: 1,         // weigthing separation force --> multiplication of force
        borderForce: 1.5,           // weighting force to flee from walls
        obstacleForce: 1.5,         // weighting obstacle avoidance force
        wanderForce: 0,             // disabling wander force due to unrealistic behavior
        arriveForce: 1              // weighting arrival force when boid approaches wall
    }
};
