//imports

//consts
const PARTICLE_QUANTITY = 10
const MAX_LOOP_ITERACTIONS = 1000
const WEIGHT_INDEX = 0
const VALUE_INDEX = 1
const COGNITIVE_IMPORTANCE = 1
const SOCIAL_IMPORTANCE = 2
const INERTIA_IMPORTANCE = 1

//interfaces
interface IParticle {
    position: number[],
    velocity: number[],
    cognitiveBestPosition?: number[]
}

interface IKapsackItem {
    item: string,
    weight: number,
    value: number
}

//classes
class Swarm {
    private r1: number;
    private r2: number;
    private maxWeight: number;
    private maxValue: number;
    private possibleItems: IKapsackItem[];
    private currentLoopIteraction: number = 0
    private socialBestPosition: number[];
    private particles: IParticle[] = [];

    constructor() {
        this.loadInput();
        this.calculateMaxValue();
        this.populateParticles();
        this.mainLoop();
    }


    private loadInput = () => {
        let input: IKapsackItem[] = require('./arquivo_entrada_mochila.json');
        let filter: IKapsackItem = input.filter((r: IKapsackItem) => r.item == 'knapsack')[0];

        this.maxWeight = input.splice(input.indexOf(filter), 1)[0].weight;
        this.possibleItems = input;
    }

    private newParticleVelocity = (particle: IParticle) => {
        let inertia = [INERTIA_IMPORTANCE * particle.velocity[VALUE_INDEX], INERTIA_IMPORTANCE * particle.velocity[WEIGHT_INDEX]];
        let cognitive = [COGNITIVE_IMPORTANCE * this.r1 * particle.position[VALUE_INDEX], COGNITIVE_IMPORTANCE * this.r1 * particle.position[WEIGHT_INDEX]];
        let social = [SOCIAL_IMPORTANCE * this.r2 * particle.position[VALUE_INDEX], SOCIAL_IMPORTANCE * this.r2 * particle.position[WEIGHT_INDEX]];

        let newVelocity = [inertia[VALUE_INDEX] + cognitive[VALUE_INDEX] + social[VALUE_INDEX], inertia[WEIGHT_INDEX] + cognitive[WEIGHT_INDEX] + social[WEIGHT_INDEX]];

        particle.velocity = newVelocity;
    }

    private newParticlePosition = (particle: IParticle) => {
        this.newParticleVelocity(particle);
        particle.position = particle.position = particle.velocity;
    }

    private newRandoms = () => {
        this.r1 = Math.random();
        this.r2 = Math.random();
    }

    private calculateMaxValue = () => {
        let maxValue = 0

        this.possibleItems.forEach(r => {
            maxValue = maxValue + r.value;
        })

        this.maxValue = maxValue;
    }

    private getInicialPosition = () => {
        let possibleItems = this.possibleItems;
        let knapsack: IKapsackItem[] = [];

        while (this.getKnapsackWeight(knapsack) < this.maxWeight) {
            let choice = possibleItems[Math.floor(Math.random() * possibleItems.length)];
            let item = possibleItems.splice(possibleItems.indexOf(choice), 1)[0]
            knapsack.push(item)
            while (this.getKnapsackWeight(knapsack) > this.maxWeight) {
                let minValue: number = this.maxValue;

                knapsack.forEach(r => minValue = r.value < minValue ? r.value : minValue)

                possibleItems.push(knapsack.slice(knapsack.indexOf(knapsack.filter(r => r.value == minValue)[0]), 1)[0])
            }

            let stillHavePossibleItems: boolean = false;

            possibleItems.forEach(x => {
                if (x.weight <= this.maxWeight - this.getKnapsackWeight(knapsack))
                    stillHavePossibleItems = true;
                else
                    possibleItems.splice(possibleItems.indexOf(x), 1);
            });

            if (!stillHavePossibleItems)
                return [this.getKnapsackWeight(knapsack), this.getKnapsackValue(knapsack)];
        }
    }

    private getKnapsackWeight = (knapsack: IKapsackItem[]) => {
        if(knapsack.length==0)
            return 0;

        let weights = knapsack.map(r => r.weight);
        let total = weights.reduce((a, b) => a + b);

        return total;
    }

    private getKnapsackValue = (knapsack: IKapsackItem[]) => {
        if (knapsack.length == 0)
            return 0;

        let values = knapsack.map(r => r.value);
        let total = values.reduce((a, b) => a + b);

        return total;
    }

    private populateParticles = () => {
        for (let x = 0; x < PARTICLE_QUANTITY; x++) {
            let particle: IParticle = {
                position: this.getInicialPosition(),
                velocity: [0, 0]
            }
            particle.cognitiveBestPosition = particle.position;

            if (x == 0)
                this.socialBestPosition = particle.position;

            this.particles.push(particle)
        }
    }

    private mainLoop = () => {
        this.newRandoms();

        this.particles.forEach(particle => {
            this.newParticlePosition(particle);

            if (particle.position[VALUE_INDEX] > particle.cognitiveBestPosition[VALUE_INDEX]) {
                particle.cognitiveBestPosition = particle.position;

                if (particle.position[VALUE_INDEX] > this.socialBestPosition[VALUE_INDEX]) {
                    this.socialBestPosition = particle.position;
                }
            }

        })

        let isLoopInRange = this.currentLoopIteraction < MAX_LOOP_ITERACTIONS;
        let isGlobalValuePerfect = this.socialBestPosition[VALUE_INDEX] < this.maxValue;
        if (isLoopInRange && isGlobalValuePerfect) {
            this.currentLoopIteraction++;
            this.mainLoop()
        }
        else {
            let response = `Melhor solução encontrada:\n\tPeso: ${this.socialBestPosition[WEIGHT_INDEX]}\n\tValor: ${this.socialBestPosition[VALUE_INDEX]}`;
            console.log(response);
        }
    }
}
