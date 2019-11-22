"use strict";
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
exports.__esModule = true;
//imports
var constants_1 = require("./constants");
//classes
var Swarm = /** @class */ (function () {
    function Swarm() {
        var _this = this;
        this.currentLoopIteraction = 0;
        this.socialBestSolution = [];
        this.particles = [];
        this.logConfigs = function () {
            var systemConfig = "-- Configura\u00E7\u00F5es utilizadas --\n";
            var quantParticulasUsadas = "\tQuantidade de part\u00EDculas utilizadas: " + constants_1.PARTICLE_QUANTITY + "\n";
            var maxLoopIteractions = "\tQuantidade m\u00E1xima de itera\u00E7\u00F5es do loop: " + constants_1.MAX_LOOP_ITERACTIONS + "\n";
            var maxKnapsackWeight = "\tPeso m\u00E1ximo: " + _this.maxWeight + "\n";
            var maxKnapsackValue = "\tMaior valor possivel: " + _this.maxValue + "\n";
            var sortType = "\tTipo de ordena\u00E7\u00E3o: " + constants_1.ORDER_BY + "\n";
            var bagItemsQuantity = "\tQuantidade de itens na mochila: " + _this.possibleItems.length + "\n\n";
            console.log(systemConfig + quantParticulasUsadas + maxLoopIteractions + maxKnapsackWeight + maxKnapsackValue + sortType + bagItemsQuantity);
            console.log("Itens de entrada:\n");
            console.table(_this.sortKnapsack(_this.possibleItems));
        };
        this.loadInput = function () {
            var input = require('../arquivo_entrada_mochila.json');
            var filter = input.filter(function (r) { return r.item == 'knapsack'; })[0];
            _this.maxWeight = input.splice(input.indexOf(filter), 1)[0].weight;
            var insertCostBenefit = input.map(function (r) {
                return {
                    item: r.item,
                    weight: r.weight,
                    value: r.value,
                    costBenefit: (r.value / r.weight).toFixed(2)
                };
            });
            _this.possibleItems = insertCostBenefit;
        };
        this.newKnapsack = function (particle) {
            var newKnapsack = [];
            var possibleItems = __spreadArrays(_this.possibleItems);
            var knapsackReady = false;
            if (particle) {
                var socialBestSolution = __spreadArrays(_this.socialBestSolution);
                var cognitiveBestSolution = __spreadArrays(particle.cognitiveBestSolution);
                var quantFromSocial = 0;
                var quantFromCognitive = 0;
                while (!knapsackReady) {
                    var item = void 0;
                    var filterPossibleItems = possibleItems.filter(function (r) {
                        return _this.getKnapsackWeight(newKnapsack) + r.weight <= _this.maxWeight && (!newKnapsack.includes(r));
                    });
                    if (filterPossibleItems.length) {
                        if (quantFromSocial < constants_1.SOCIAL_IMPORTANCE) {
                            var filterSocial = socialBestSolution.filter(function (r) {
                                return _this.getKnapsackWeight(newKnapsack) + r.weight <= _this.maxWeight && (!newKnapsack.includes(r));
                            });
                            item = filterSocial.splice(_this.choice(0, filterSocial.length), 1)[0];
                            quantFromSocial++;
                        }
                        else if (quantFromCognitive < constants_1.COGNITIVE_IMPORTANCE) {
                            var filterCognitive = cognitiveBestSolution.filter(function (r) {
                                return _this.getKnapsackWeight(newKnapsack) + r.weight <= _this.maxWeight && (!newKnapsack.includes(r));
                            });
                            item = filterCognitive.splice(_this.choice(0, filterCognitive.length), 1)[0];
                            quantFromCognitive++;
                        }
                        else
                            item = filterPossibleItems.splice(_this.choice(0, filterPossibleItems.length), 1)[0];
                        newKnapsack.push(item);
                    }
                    else {
                        knapsackReady = true;
                    }
                }
            }
            else {
                while (!knapsackReady) {
                    var filter = possibleItems.filter(function (r) { return _this.getKnapsackWeight(newKnapsack) + r.weight <= _this.maxWeight; });
                    if (filter.length) {
                        var item = possibleItems.splice(_this.choice(0, filter.length), 1)[0];
                        newKnapsack.push(item);
                    }
                    else {
                        knapsackReady = true;
                    }
                }
            }
            return newKnapsack;
        };
        this.choice = function (min, max) {
            if (min === void 0) { min = 0; }
            if (max === void 0) { max = 1; }
            var choice = Math.floor(Math.random() * max) + min;
            return choice;
        };
        this.calculateMaxValue = function () {
            var maxValue = 0;
            _this.possibleItems.forEach(function (r) {
                maxValue = maxValue + r.value;
            });
            _this.maxValue = maxValue;
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
            for (var x = 0; x < constants_1.PARTICLE_QUANTITY; x++) {
                var particle = {
                    knapsack: _this.newKnapsack()
                };
                particle.cognitiveBestSolution = particle.knapsack;
                if (x == 0)
                    _this.socialBestSolution = particle.knapsack;
                _this.particles.push(particle);
            }
        };
        this.sortKnapsack = function (list) {
            var sortedList;
            switch (constants_1.ORDER_BY) {
                case 'title':
                    sortedList = list.sort();
                    break;
                case 'weight':
                    sortedList = list.sort(function (a, b) {
                        if (a.weight > b.weight)
                            return 1;
                        if (a.weight < b.weight)
                            return -1;
                        return 0;
                    });
                    break;
                case 'value':
                    sortedList = list.sort(function (a, b) {
                        if (a.value > b.value)
                            return 1;
                        if (a.value < b.value)
                            return -1;
                        return 0;
                    });
                    break;
                case 'costBenefit':
                    sortedList = list.sort(function (a, b) {
                        if (Number(a.costBenefit) > Number(b.costBenefit))
                            return 1;
                        if (Number(a.costBenefit) < Number(b.costBenefit))
                            return -1;
                        return 0;
                    });
                    break;
                case 'noSort':
                    sortedList = list;
                    break;
                default:
                    sortedList = list.sort();
                    break;
            }
            return sortedList;
        };
        this.mainLoop = function () {
            _this.particles.forEach(function (particle) {
                particle.knapsack = _this.newKnapsack(particle);
                if (_this.getKnapsackValue(particle.knapsack) > _this.getKnapsackValue(particle.cognitiveBestSolution)) {
                    particle.cognitiveBestSolution = particle.knapsack;
                    if (_this.getKnapsackValue(particle.knapsack) > _this.getKnapsackValue(_this.socialBestSolution)) {
                        _this.socialBestSolution = particle.knapsack;
                    }
                }
            });
            var isLoopInRange = _this.currentLoopIteraction < constants_1.MAX_LOOP_ITERACTIONS;
            var isGlobalValuePerfect = _this.getKnapsackValue(_this.socialBestSolution) < _this.maxValue;
            if (isLoopInRange && isGlobalValuePerfect) {
                _this.currentLoopIteraction++;
                _this.mainLoop();
            }
            else {
                var quantIteracoes = "\tQuantidade total de itera\u00E7\u00F5es: " + _this.currentLoopIteraction + "\n";
                var peso = "\tPeso: " + _this.getKnapsackWeight(_this.socialBestSolution) + "\n";
                var valor = "\tValor: " + _this.getKnapsackValue(_this.socialBestSolution) + "\n";
                var tamanhoMochila = "\tQuantidade de itens na mochila: " + _this.socialBestSolution.length + "\n";
                console.log("Melhor solução encontrada:\n" + quantIteracoes + peso + valor + tamanhoMochila);
                console.log("Provavel mochila perfeita:\n");
                console.table(_this.sortKnapsack(_this.socialBestSolution));
            }
        };
        this.loadInput();
        this.calculateMaxValue();
        this.logConfigs();
        this.populateParticles();
        this.mainLoop();
    }
    return Swarm;
}());
var swarm = new Swarm();
