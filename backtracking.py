import logging

from util import Utils

logging.basicConfig(
    level=logging.DEBUG,
    format='%(asctime)s [%(levelname)-5.5s] - %(message)s',
    handlers=[
        logging.FileHandler("{0}/{1}.log".format(".", "log")),
        logging.StreamHandler()
    ])


class CalculoBacktracking:
    knapsack_info = None

    def __init__(self):
        self.entrada = filter(self.process_knapsack, Utils.ler_entrada('arquivo_entrada_mochila.json'))

    def process_knapsack(self, value):
        if 'knapsack' not in value['item']:
            self.knapsack_info = value
            return True

    def calcule(self):
        logging.info(self.entrada)
        for node in self.entrada:


CalculoBacktracking().calcule()
