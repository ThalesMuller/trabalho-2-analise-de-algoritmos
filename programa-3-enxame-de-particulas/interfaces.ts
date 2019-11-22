export interface IParticle {
    knapsack: IKnapsackItem[],
    cognitiveBestSolution?: IKnapsackItem[]
}

export interface IKnapsackItem {
    item: string,
    weight: number,
    value: number
    costBenefit?: string
}
