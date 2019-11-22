//imports
import { PARTICLE_QUANTITY, MAX_LOOP_ITERACTIONS, COGNITIVE_IMPORTANCE, SOCIAL_IMPORTANCE, ORDER_BY } from "./constants";
import { IKnapsackItem, IParticle } from "./interfaces";

//classes
class Swarm {
    private maxWeight: number;
    private maxValue: number;
    private possibleItems: IKnapsackItem[];
    private currentLoopIteraction: number = 0
    private socialBestSolution: IKnapsackItem[] = [];
    private particles: IParticle[] = [];

    constructor() {
        this.loadInput();
        this.calculateMaxValue();

        this.logConfigs();

        this.populateParticles();
        this.mainLoop();
    }

    private logConfigs = () => {
        let systemConfig = `-- Configurações utilizadas --\n`
        let quantParticulasUsadas = `\tQuantidade de partículas utilizadas: ${PARTICLE_QUANTITY}\n`;
        let maxLoopIteractions = `\tQuantidade máxima de iterações do loop: ${MAX_LOOP_ITERACTIONS}\n`;
        let maxKnapsackWeight = `\tPeso máximo: ${this.maxWeight}\n`;
        let maxKnapsackValue = `\tMaior valor possivel: ${this.maxValue}\n`;
        let sortType = `\tTipo de ordenação: ${ORDER_BY}\n`;
        let bagItemsQuantity = `\tQuantidade de itens na mochila: ${this.possibleItems.length}\n\n`;

        console.log(systemConfig + quantParticulasUsadas + maxLoopIteractions + maxKnapsackWeight + maxKnapsackValue + sortType + bagItemsQuantity);

        console.log("Itens de entrada:\n");
        console.table(this.sortKnapsack(this.possibleItems));
    }

    private loadInput = () => {
        let input: IKnapsackItem[] = require('./arquivo_entrada_mochila.json');
        let filter: IKnapsackItem = input.filter((r: IKnapsackItem) => r.item == 'knapsack')[0];

        this.maxWeight = input.splice(input.indexOf(filter), 1)[0].weight;

        let insertCostBenefit = input.map(r => {
            return {
                item: r.item,
                weight: r.weight,
                value: r.value,
                costBenefit: (r.value / r.weight).toFixed(2)
            };
        });

        this.possibleItems = insertCostBenefit;
    }

    private newKnapsack = (particle?: IParticle): IKnapsackItem[] => {
        let newKnapsack: IKnapsackItem[] = [];
        let possibleItems = [...this.possibleItems];
        let knapsackReady = false;

        if (particle) {
            let socialBestSolution = [...this.socialBestSolution];
            let cognitiveBestSolution = [...particle.cognitiveBestSolution]
            let quantFromSocial = 0;
            let quantFromCognitive = 0;

            while (!knapsackReady) {
                let item: IKnapsackItem;

                let filterPossibleItems = possibleItems.filter(r => {
                    return this.getKnapsackWeight(newKnapsack) + r.weight <= this.maxWeight && (!newKnapsack.includes(r))
                });

                if (filterPossibleItems.length) {
                    if (quantFromSocial < SOCIAL_IMPORTANCE) {
                        let filterSocial = socialBestSolution.filter(r => {
                            return this.getKnapsackWeight(newKnapsack) + r.weight <= this.maxWeight && (!newKnapsack.includes(r))
                        });

                        item = filterSocial.splice(this.choice(0, filterSocial.length), 1)[0];

                        quantFromSocial++;
                    }
                    else if (quantFromCognitive < COGNITIVE_IMPORTANCE) {
                        let filterCognitive = cognitiveBestSolution.filter(r => {
                            return this.getKnapsackWeight(newKnapsack) + r.weight <= this.maxWeight && (!newKnapsack.includes(r))
                        });

                        item = filterCognitive.splice(this.choice(0, filterCognitive.length), 1)[0];

                        quantFromCognitive++;
                    }
                    else
                        item = filterPossibleItems.splice(this.choice(0, filterPossibleItems.length), 1)[0];

                    newKnapsack.push(item);
                }
                else {
                    knapsackReady = true;
                }
            }
        }
        else {
            while (!knapsackReady) {
                let filter = possibleItems.filter(r => this.getKnapsackWeight(newKnapsack) + r.weight <= this.maxWeight);

                if (filter.length) {
                    let item: IKnapsackItem = possibleItems.splice(this.choice(0, filter.length), 1)[0];
                    newKnapsack.push(item);
                }
                else {
                    knapsackReady = true;
                }
            }
        }

        return newKnapsack;
    }

    private choice = (min: number = 0, max: number = 1): number => {
        let choice = Math.floor(Math.random() * max) + min;
        return choice;
    }

    private calculateMaxValue = () => {
        let maxValue = 0

        this.possibleItems.forEach(r => {
            maxValue = maxValue + r.value;
        })

        this.maxValue = maxValue;
    }

    private getKnapsackWeight = (knapsack: IKnapsackItem[]): number => {
        if (knapsack.length == 0)
            return 0;

        let weights = knapsack.map(r => r.weight);
        let total = weights.reduce((a, b) => a + b);

        return total;
    }

    private getKnapsackValue = (knapsack: IKnapsackItem[]): number => {
        if (knapsack.length == 0)
            return 0;

        let values = knapsack.map(r => r.value);
        let total = values.reduce((a, b) => a + b);

        return total;
    }

    private populateParticles = () => {
        for (let x = 0; x < PARTICLE_QUANTITY; x++) {
            let particle: IParticle = {
                knapsack: this.newKnapsack()
            }

            particle.cognitiveBestSolution = particle.knapsack;

            if (x == 0)
                this.socialBestSolution = particle.knapsack;

            this.particles.push(particle)
        }
    }

    private sortKnapsack = (list: IKnapsackItem[]): IKnapsackItem[] => {
        let sortedList;

        switch (ORDER_BY) {
            case 'title':
                sortedList = list.sort();
                break;

            case 'weight':
                sortedList = list.sort((a, b) => {
                    if (a.weight > b.weight)
                        return 1;
                    if (a.weight < b.weight)
                        return -1;
                    return 0;
                });
                break;

            case 'value':
                sortedList = list.sort((a, b) => {
                    if (a.value > b.value)
                        return 1;
                    if (a.value < b.value)
                        return -1;
                    return 0;
                });
                break;

            case 'costBenefit':
                sortedList = list.sort((a, b) => {
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
    }

    private mainLoop = () => {
        this.particles.forEach(particle => {
            particle.knapsack = this.newKnapsack(particle);

            if (this.getKnapsackValue(particle.knapsack) > this.getKnapsackValue(particle.cognitiveBestSolution)) {
                particle.cognitiveBestSolution = particle.knapsack;

                if (this.getKnapsackValue(particle.knapsack) > this.getKnapsackValue(this.socialBestSolution)) {
                    this.socialBestSolution = particle.knapsack;
                }
            }

        })

        let isLoopInRange = this.currentLoopIteraction < MAX_LOOP_ITERACTIONS;
        let isGlobalValuePerfect = this.getKnapsackValue(this.socialBestSolution) < this.maxValue;
        if (isLoopInRange && isGlobalValuePerfect) {
            this.currentLoopIteraction++;
            this.mainLoop()
        }
        else {
            let quantIteracoes = `\tQuantidade total de iterações: ${this.currentLoopIteraction}\n`;
            let peso = `\tPeso: ${this.getKnapsackWeight(this.socialBestSolution)}\n`;
            let valor = `\tValor: ${this.getKnapsackValue(this.socialBestSolution)}\n`;
            let tamanhoMochila = `\tQuantidade de itens na mochila: ${this.socialBestSolution.length}\n`;

            console.log("Melhor solução encontrada:\n" + quantIteracoes + peso + valor + tamanhoMochila);

            console.log("Provavel mochila perfeita:\n");
            console.table(this.sortKnapsack(this.socialBestSolution));
        }
    }
}

let swarm = new Swarm();