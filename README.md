# VisSwarmR
VisSwarmR is a Visual Analytics tool for the generation of Collective Movement Datasets. In its current state, the program includes two movement models commonly used in behavioral ecology. VisSwarmR implements these models described below to include motion paths and movement patterns, as described by Dodge et al. [1], as well as dealing with a modeled environment, e.g. to avoid obstacles. The resulting prototype enables the user to interactively parametrize the models properties, to simulate and generate collective movement that can be exported as CSV-file. It assists users in tailoring the collective movement generation process to desired requirements and supports diverse group formations and polarized movement within groups. A more detailed documentation on VisSwarmRs features can be found in the [handbook](docs/docVisSwarmR.pdf).

## Employed Behavioral Models
Currently, VisSwarmR supports two standard models with different approaches to movement simulation:

* Reynolds modeled bird-like objects[2] (boids) that follow basic rules to avoid collisions with adjacent objects but adapt speed and velocity towards their neighbors to move collectively. The boid model was extended to describe the behavior of autonomous
characters[3] expressed by physical steering forces, which includes environmental behavior, such as path following and obstacle avoidance.

* The Couzin model[4] depict a more minimalistic approach and describes the motion of collectives in a rule-based zonal model. Based on the zones, movers avoid collisions within the repulsion zone by keeping
a minimum distance towards others or objects that resemble their motion to align within others in the zone
of alignment and inclining each other in the zone of attraction.

## Setup
VisSwarmR is a pure web project using Angular and d3.js. It does not require a server backend besides being served from a web server. All calculations are done on the client side, and generated data remains local only. To set up VisSwarmR, just clone the project and build using `npm install`. The contents of the built dist-folder can then be deployed on a web server. 

## License information
The prototype is licensed under [Apache License 2.0](https://www.apache.org/licenses/LICENSE-2.0). If you would like to use it for any kind of projects, I would be happy to hear about it! You can contact me on twitter under https://twitter.com/IsaMaunzt

## Related works
* [1] Dodge, Somayeh, Robert Weibel, and Anna-Katharina Lautenschütz. "Towards a taxonomy of movement patterns." Information visualization 7.3-4 (2008): 240-252.
* [2] Reynolds, Craig W. "Flocks, herds and schools: A distributed behavioral model." Proceedings of the 14th annual conference on Computer graphics and interactive techniques. 1987.
* [3] Reynolds, Craig W. "Steering behaviors for autonomous characters." Game developers conference. Vol. 1999. 1999.
* [4] Couzin, Iain D., et al. "Collective memory and spatial sorting in animal groups." Journal of theoretical biology 218.1 (2002): 1-12.

Inspirations taken from:
* [Nature of Code](https://natureofcode.com/) by Daniel Shiffman
* [Flock'n Roll](https://www.complexity-explorables.org/explorables/flockn-roll/) by Orli Sprecher, Dirk Brockmann
