from util import Utils
import random


class Particula:
    WEIGHT = 0
    VALUE = 1
    COGNITIVO = 0
    SOCIAL = 1
    INERCIA = 2

    melhor_posicao_individual = [0, 0]
    posicao = []
    velocidade = []

    def nova_velocidade(self, posicao_inicial):
        self.velocidade = (super().PESO_INERCIA * self.velocidade) + (super().r1*super().PESO_COGNITIVO*(
            self.melhor_posicao_individual-self.posicao)) + (super().r2*super().PESO_SOCIAL*(super().melhor_posicao_global)-self.posicao)

    def nova_posicao(self):
        self.nova_velocidade()
        self.posicao = self.posicao + self.velocidade


class Enxame(Particula):
    QUANT_PARTICULAS = 10
    MAXIMO_REPETICOES = 1000 
    MAX_WEIGHT = 0
    MAX_VALUE = 0
    WEIGHT = 0
    VALUE = 1
    PESO_COGNITIVO = 1
    PESO_SOCIAL = 2
    PESO_INERCIA = 1   


    num_atual_repeticoes = 0
    melhor_posicao_global = [0, 0]
    entrada = []
    particulas = []

    def __init__(self):
        entrada = Utils.ler_entrada("arquivo_entrada_mochila.json")
        self.MAX_WEIGHT = entrada.pop(len(entrada)-1)['weight']
        self.entrada = entrada
        self.calc_max_value()


    def new_randoms(self):
        self.r1 = random.random()
        self.r2 = random.random()

    def calc_max_value(self):
        for item in self.entrada:
            self.MAX_VALUE += item['value']

    def popular_particulas(self):
        for x in range(self.QUANT_PARTICULAS):
            self.particulas.append(Particula([])

    def execution_loop(self): #recursive loop 
        self.new_randoms()

        if self.num_atual_repeticoes < self.MAXIMO_REPETICOES and self.melhor_posicao_global[self.VALUE] < self.MAX_VALUE:
            self.execution_loop()



