//imports
//consts
var PARTICLE_QUANTITY = 10;
var MAX_LOOP_ITERACTIONS = 1000;
var WEIGHT_INDEX = 0;
var VALUE_INDEX = 1;
var COGNITIVE_IMPORTANCE = 1;
var SOCIAL_IMPORTANCE = 2;
var INERTIA_IMPORTANCE = 1;
//classes
var Swarm = /** @class */ (function () {
    function Swarm() {
        var _this = this;
        this.currentLoopIteraction = 0;
        this.particles = [];
        this.loadInput = function () {
            var input = require('./arquivo_entrada_mochila.json');
            var filter = input.filter(function (r) { return r.item == 'knapsack'; })[0];
            _this.maxWeight = input.splice(input.indexOf(filter), 1)[0].weight;
            _this.possibleItems = input;
        };
        this.newParticleVelocity = function (particle) {
            var inertia = [INERTIA_IMPORTANCE * particle.velocity[VALUE_INDEX], INERTIA_IMPORTANCE * particle.velocity[WEIGHT_INDEX]];
            var cognitive = [COGNITIVE_IMPORTANCE * _this.r1 * particle.position[VALUE_INDEX], COGNITIVE_IMPORTANCE * _this.r1 * particle.position[WEIGHT_INDEX]];
            var social = [SOCIAL_IMPORTANCE * _this.r2 * particle.position[VALUE_INDEX], SOCIAL_IMPORTANCE * _this.r2 * particle.position[WEIGHT_INDEX]];
            var newVelocity = [inertia[VALUE_INDEX] + cognitive[VALUE_INDEX] + social[VALUE_INDEX], inertia[WEIGHT_INDEX] + cognitive[WEIGHT_INDEX] + social[WEIGHT_INDEX]];
            particle.velocity = newVelocity;
        };
        this.newParticlePosition = function (particle) {
            _this.newParticleVelocity(particle);
            particle.position = particle.position = particle.velocity;
        };
        this.newRandoms = function () {
            _this.r1 = Math.random();
            _this.r2 = Math.random();
        };
        this.calculateMaxValue = function () {
            var maxValue = 0;
            _this.possibleItems.forEach(function (r) {
                maxValue = maxValue + r.value;
            });
            _this.maxValue = maxValue;
        };
        this.getInicialPosition = function () {
            var possibleItems = _this.possibleItems;
            var knapsack = [];
            var _loop_1 = function () {
                var choice = possibleItems[Math.floor(Math.random() * possibleItems.length)];
                var item = possibleItems.splice(possibleItems.indexOf(choice), 1)[0];
                knapsack.push(item);
                var _loop_2 = function () {
                    var minValue = _this.maxValue;
                    knapsack.forEach(function (r) { return minValue = r.value < minValue ? r.value : minValue; });
                    possibleItems.push(knapsack.slice(knapsack.indexOf(knapsack.filter(function (r) { return r.value == minValue; })[0]), 1)[0]);
                };
                while (_this.getKnapsackWeight(knapsack) > _this.maxWeight) {
                    _loop_2();
                }
                var stillHavePossibleItems = false;
                possibleItems.forEach(function (x) {
                    if (x.weight <= _this.maxWeight - _this.getKnapsackWeight(knapsack))
                        stillHavePossibleItems = true;
                    else
                        possibleItems.splice(possibleItems.indexOf(x), 1);
                });
                if (!stillHavePossibleItems)
                    return { value: [_this.getKnapsackWeight(knapsack), _this.getKnapsackValue(knapsack)] };
            };
            while (_this.getKnapsackWeight(knapsack) < _this.maxWeight) {
                var state_1 = _loop_1();
                if (typeof state_1 === "object")
                    return state_1.value;
            }
        };
        this.getKnapsackWeight = function (knapsack) {
            if (knapsack.length == 0)
                return 0;
            var weights = knapsack.map(function (r) { return r.weight; });
            var total = weights.reduce(function (a, b) { return a + b; });
            return total;
        };
        this.getKnapsackValue = function (knapsack) {
            if (knapsack.length == 0)
                return 0;
            var values = knapsack.map(function (r) { return r.value; });
            var total = values.reduce(function (a, b) { return a + b; });
            return total;
        };
        this.populateParticles = function () {
            for (var x = 0; x < PARTICLE_QUANTITY; x++) {
                var particle = {
                    position: _this.getInicialPosition(),
                    velocity: [0, 0]
                };
                particle.cognitiveBestPosition = particle.position;
                if (x == 0)
                    _this.socialBestPosition = particle.position;
                _this.particles.push(particle);
            }
        };
        this.mainLoop = function () {
            _this.newRandoms();
            _this.particles.forEach(function (particle) {
                _this.newParticlePosition(particle);
                if (particle.position[VALUE_INDEX] > particle.cognitiveBestPosition[VALUE_INDEX]) {
                    particle.cognitiveBestPosition = particle.position;
                    if (particle.position[VALUE_INDEX] > _this.socialBestPosition[VALUE_INDEX]) {
                        _this.socialBestPosition = particle.position;
                    }
                }
            });
            var isLoopInRange = _this.currentLoopIteraction < MAX_LOOP_ITERACTIONS;
            var isGlobalValuePerfect = _this.socialBestPosition[VALUE_INDEX] < _this.maxValue;
            if (isLoopInRange && isGlobalValuePerfect) {
                _this.currentLoopIteraction++;
                _this.mainLoop();
            }
            else {
                var response = "Melhor solu\u00E7\u00E3o encontrada:\n\tPeso: " + _this.socialBestPosition[WEIGHT_INDEX] + "\n\tValor: " + _this.socialBestPosition[VALUE_INDEX];
                console.log(response);
            }
        };
        this.loadInput();
        this.calculateMaxValue();
        this.populateParticles();
        this.mainLoop();
    }
    return Swarm;
}());
let x = new Swarm()