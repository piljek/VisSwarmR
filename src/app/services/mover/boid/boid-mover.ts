import * as d3 from 'd3';
import Vector from 'ts-vector';
import { LinA } from 'src/app/shared/lin-alg';
import { Mover } from '../../../interfaces/mover';
import { Reynolds1999Model } from '../../models/reynolds1999/reynolds1999.service';
import { Injector } from '@angular/core';

/**
 * Boid object inherits mover. Mover class according to Reynolds model
 */
export default class Boid extends Mover {


    // params: Reynolds1999Parameters;
    id: number;
    mass: number;

    location: Vector;
    velocity: Vector = new Vector(0, 0);
    acceleration: Vector;
    // steer: Vector;

    sx: number;
    sy: number;
    // theta: number;

    max_speed: number;
    max_force: number;
    neighborhood_radius: number;
    theta: number;
    target = new Vector(300, 75);

    // wandering
    r = 6;
    wanderTheta = 0;
    thetaChange: number;
    wanderR = 25;
    wanderD = 40;
    change = 10;
    wanderTarget: Vector;
    meanTarget: Vector;
    borderDistance = 50;

    t: number;
    collides = false;
    arenaWidth = 100;
    arenaHeight = 100;
    circleLoc: Vector;

    tooFar = false;
    pathTarget: Vector;

    // path following
    pathId = 0;
    normalPoint: Vector = new Vector(0, 0);
    // nextStep = predicted move towards movement direction without adding to boid location
    nextStep: Vector = new Vector(0, 0);
    futurePosition: Vector = new Vector(0, 0);

    // current segment
    currentSegmentId = 0;
    // path direction: when end is reached, travel backwards
    pathDirection = 1;
    // passed segment start
    passedStart = false;
    passedEnd = false;



    // force weighting
    separationForceWeight: number;
    wanderForceWeight: number;
    arriveForceWeight: number;

    wallOffset: number;

    constructor(id: number, sx: number, sy: number, cid: number, theta: number) {
        super(id, sx, sy, cid, theta);
        this.location = new Vector(sx, sy);

        this.velocity = new Vector(LinA.tx(this.theta), LinA.ty(this.theta));
        this.acceleration = new Vector(0, 0);
        this.t = 0;
        this.parameterSubscription();
    }

    /**
     * Subscribe to paramter controls and Reynolds Model Service
     */
    parameterSubscription() {
        Reynolds1999Model.paramService.maxForceSource$.subscribe(d => {
            this.max_force = d;
            // console.log("reynolds force parameter: " + this.max_force)
        });
        Reynolds1999Model.paramService.maxSpeedSource$.subscribe(d => {
            this.max_speed = d;
            // console.log("reynolds speed parameter: " + this.max_speed)
        });

        Reynolds1999Model.paramService.neighborhoodSource$.subscribe(d => {
            this.neighborhood_radius = d;
            // console.log("reynolds neighboorhood parameter: " + this.neighborhood_radius)
        });

        Reynolds1999Model.paramService.borderOffsetSource$.subscribe(d => { this.wallOffset = d * .25; });


        Reynolds1999Model.paramService.wanderRadiusSource$.subscribe(d => { this.wanderR = d; });
        Reynolds1999Model.paramService.wanderDistSource$.subscribe(d => { this.wanderD = d; });
        Reynolds1999Model.paramService.wanderChangeSource$.subscribe(d => { this.change = d; });


        Reynolds1999Model.paramService.separationForce$.subscribe(d => {
            this.separationForceWeight = d;
        });
        Reynolds1999Model.paramService.wanderForce$.subscribe(d => { this.wanderForceWeight = d; });
        Reynolds1999Model.paramService.arriveForce$.subscribe(d => { this.arriveForceWeight = d; });

    }

    /**
     * Set wall border
     */
    border() {
        const borderForce = this.arriveAtWall();
        this.applyForce(borderForce);
        this.update();
    }


    /**
     * Seeks the desired target.
     * @param target desired target
     */
    seek(target: Vector) {

        const desired = target.subtract(this.location);
        desired.normalizeVector();
        desired.multiplySelf(this.max_speed);

        const steer = desired.subtract(this.velocity);
        steer.multiplySelf(this.limit(steer, this.max_force));

        return steer;
    }

    /**
     * Flees from the target. Opposite pattern to seek
     * @param target target to evade
     */
    flee(target: Vector) {
        const steer = this.seek(target).multiply(-1);
        return steer;
    }



    /**
     * Limits a vector's magnitude' by a value. Returns the minimum of these two values.
     * @param v Vector to be limited
     * @param m limitation
     */
    limit(v: Vector, m: number): number {
        // return Math.min(m, v.magnitude());
        return (v.magnitude() < m) ? v.magnitude() : m;
    }

    /**
     * Natural casual movement behavior. Based on step in future, wander radius and noise the wander target
     * is defined. Target gives the desired direction.
     * @param target wander target
     */
    wander(target: Vector) {
        // Wander radius
        // this.target = target;
        // distance to wander

        // change in degrees
        this.t += Math.random() * this.change * 2 - this.change;
        this.thetaChange = LinA.posDegree(this.theta + this.t);
        // console.log(`regular theta: ${this.theta}, new theta: ${this.thetaChange}`)

        // let circleLoc = this.velocity.copy();
        const circleLoc = this.velocity.copy();
        circleLoc.normalizeVector().multiplySelf(this.wanderD).addSelf(this.location);

        this.circleLoc = circleLoc;

        const circleOffset = new Vector(this.wanderR * LinA.tx(this.thetaChange), this.wanderR * LinA.ty(this.thetaChange));
        target = this.circleLoc.add(circleOffset);
        this.wanderTheta = LinA.rad2deg(LinA.targetDirection(LinA.tx(this.thetaChange), LinA.ty(this.thetaChange)));
        // console.log(`neues theta: ${this.wanderTheta}`)
        this.wanderTarget = target;
        // let steer = this.seek(target);
        // return steer;
    }

    /**
     * Separate from other boids to avoid collisions
     * @param boids other boids
     */
    separate(boids: Boid[]) {
        let count = 0;
        const separationForce = new Vector(0, 0);
        this.collides = false;

        boids.forEach(boid => {

            const dist = LinA.euclideanDist(this.location[0], boid.location[0], this.location[1], boid.location[1]);
            if (dist > 0 && dist < this.neighborhood_radius && this.id !== boid.id) {
                this.collides = true;
                // Apply weight to distance -->  the closer other boid is, the more is the fleeing force
                const diffLocation = this.location.subtract(boid.location).normalizeVector();

                diffLocation.divideSelf(dist);
                separationForce.addSelf(diffLocation);

                // console.log(`diffLocation ${diffLocation}, wDists ${wDists}`);
                count++;
            }

        });
        if (count > 0) {

            separationForce.divideSelf(count).normalizeVector();
            separationForce.multiplySelf(this.max_speed);
            separationForce.subtractSelf(this.velocity);

            separationForce.multiplySelf(this.limit(separationForce, this.max_force));
        }

        return separationForce;


    }

    /**
     * Sets the world dimensions
     * @param arenaWidth world width
     * @param arenaHeight world height
     */
    setBorders(arenaWidth: number, arenaHeight: number) {
        this.arenaWidth = arenaWidth;
        this.arenaHeight = arenaHeight;
    }



    /**
     * Collision avoidance with wall borders
     */
    arriveAtWall() {
        // current heading direction
        const x = this.location[0];
        const y = this.location[1];
        let desired = null;

        const d = this.wallOffset;

        // check for x boundary
        if (x < d) {
            desired = new Vector(this.max_speed, this.velocity[1]);
        } else if (x > (this.arenaWidth - d)) {
            desired = new Vector(-this.max_speed, this.velocity[1]);
        }

        if (y < d) {
            desired = new Vector(this.velocity[0], this.max_speed);
        } else if (y > (this.arenaHeight - d)) {
            desired = new Vector(this.velocity[0], -this.max_speed);
        }

        // check for y boundary
        if (desired !== null) {
            desired.normalizeVector();
            desired.multiplySelf(this.max_speed);
            const steer = desired.subtract(this.velocity);
            const mag = this.limit(steer, this.max_force);
            steer.normalizeVector().multiply(mag);

            return steer;
            // this.applyForce(steer)
            // this.acceleration = steer;
            // this.update();
        }
        return this.velocity;

    }

    /**
     * Updates boid position and velocity.
     */
    update() {
        // console.log(`update --------------------------`)
        // console.log(`acceleration + velocity --> ${this.acceleration} + ${this.velocity}`)

        this.velocity.addSelf(this.acceleration);
        // console.log(`new velocity ${this.velocity}`);
        const mag = this.limit(this.velocity, this.max_speed);

        this.velocity.normalizeVector().multiplySelf(mag);
        // console.log(`final velocity ${this.velocity}`)

        this.location.addSelf(this.velocity);
        // console.log(`new location ${this.location}`)
        this.acceleration.multiplySelf(0);

    }



    /**
     * Sets boids spatial position and global orientation
     */
    render() {
        // console.log(`new acceleration ${this.acceleration}`)
        this.sx = this.location[0];
        this.sy = this.location[1];

        this.theta = LinA.rad2deg(LinA.targetDirection(this.velocity[0], this.velocity[1]));
    }

    /**
     * Add resulting pattern forces to acceleration.
     */
    applyForce(force: Vector) {
        if (!isNaN(force[0]) && !isNaN(force[1])) {
        } else {
            console.log(`but why`);
        }
        this.acceleration.addSelf(force);
    }


    /**
     * x-coordinate
     */
    x(): number {
        return this.sx;
    }


    /**
     * y-coordinate
     */
    y() {
        return this.sy;
    }


    /**
     * mover color
     */
    color() {
        if (this.cid < 0) { return 'black'; }
        return d3.schemeCategory10[this.cid % 10];
    }


    /**
     * collionColor: red when collision with others occurs
     */
    get collisionColor() {
        if (this.collides) {
            return d3.schemeSet1[0];
        }
        return 'none';
    }

}
