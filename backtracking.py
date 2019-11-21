import logging

logging.basicConfig(
    level=logging.DEBUG,
    format='%(asctime)s [%(levelname)-5.5s] - %(message)s',
    handlers=[
        logging.FileHandler("{0}/{1}.log".format(".", "log")),
        logging.StreamHandler()
    ])

limite_peso = int(input("Defina peso maximo da mochila: "))  # Define limite de peso da mochila

itens = (
    ("map", 9, 150), ("compass", 13, 35), ("water", 153, 200), ("sandwich", 50, 160),
    ("glucose", 15, 60), ("tin", 68, 45), ("banana", 27, 60), ("apple", 39, 40),
    ("cheese", 23, 30), ("beer", 52, 10), ("suntan cream", 11, 70), ("camera", 32, 30),
    ("t-shirt", 24, 15), ("trousers", 48, 10), ("umbrella", 73, 40), ("waterproof trousers", 42, 70),
    ("waterproof overclothes", 43, 75), ("note-case", 22, 80), ("sunglasses", 7, 20), ("towel", 18, 12),
    ("socks", 4, 50), ("book", 30, 10)
)


class Backtracking(object):

    # Incializador da classe
    def __init__(self, nome, valor, key, peso, esquerda=None, direita=None):
        self.nome = nome
        self.esquerda = esquerda
        self.direita = direita
        self.valor = valor
        self.peso = peso
        self.key = key

    # Funcao que realiza adicao de item na arvore e busca melhor conjunto
    def add_item(self, item, valor_mochila, peso_mochila, valor_restante, peso_restante, conjunto_atual):
        global melhorConjunto, melhor_valor, pesoFinal  # Declaracao de variaveis globais
        if self.key == 1:  # Se a chave for 1 item participa do conjunto corrente
            valor_mochila += self.valor  # Valor do item e somado a mochila
            peso_mochila += self.peso  # Peso do item e somado a mochila
            conjunto_atual.append([self.nome, self.valor, self.peso])  # Item e adicionado ao conjunto corrente
            if valor_mochila > melhor_valor and peso_mochila <= limite_peso:  # Se o valor da mochila for maior que o maior valor ate o momento e peso estiver no limite
                melhorConjunto[:] = conjunto_atual  # Conjunto atual se torna melhor conjunto
                melhor_valor = valor_mochila  # Valor da mochila se torna o melhor valor
                pesoFinal = peso_mochila  # Seta peso do melhor conjunto
        valor_restante -= self.valor  # Remove valor do item dos disponiveis
        peso_restante -= self.peso  # Remove peso do item dos disponiveis

        if valor_mochila + valor_restante > melhor_valor:  # Se existe a possibilidade de ocorrer um valor melhor continua percorrendo arvore
            if self.esquerda is None and self.direita is None:  # Se nodo nao tiver filhos
                self.esquerda = Backtracking(item[0], item[2], 0, item[1])  # Adiciona item ao nodo atual
                self.direita = Backtracking(item[0], item[2], 1, item[1])
                valor_mochila += item[2]
                peso_mochila += item[1]
                valor_restante -= item[2]
                peso_restante -= item[1]
                conjunto_atual.append(item)  # Insere item adicionado ao conjunto atual
                if valor_mochila > melhor_valor and peso_mochila <= limite_peso:  # Verifica se e melhor que o melhor valor ate o momente
                    melhorConjunto[:] = conjunto_atual  # Se for melhor torna esse o melhor conjunto
                    melhor_valor = valor_mochila
                    pesoFinal = peso_mochila
                del conjunto_atual[-1]  # Remove ultimo item inserido para nao ficar duplicado no conjunto atual
            else:  # Se nodo tiver filhor
                self.esquerda.add_item(item, valor_mochila, peso_mochila, valor_restante, peso_restante,
                                       conjunto_atual)  # Chama recursivamente para cada um dos nodos a funcao atual
                self.direita.add_item(item, valor_mochila, peso_mochila, valor_restante, peso_restante, conjunto_atual)
        if self.key == 1:  # Se nodo atual foi inserido no conjunto atual, ele e removido
            del conjunto_atual[-1]


# Calcula valor e peso total dos itens
pesoRestante = valorRestante = 0
for item in itens:
    valorRestante += item[2]
    pesoRestante += item[1]
logging.info(f"*** Valor total dos itens: {valorRestante} - Peso total dos itens: {pesoRestante} ***\n")

# Declara mochila como vazia
valor_mochila = peso_mochila = 0

# Inicializa raiz da arvore
raiz = Backtracking("root", 0, 0, 0, 0)
raiz.esquerda = None
raiz.direita = None

# Declara variaveis que irao armazenar valores finais
pesoFinal = 0
melhor_valor = 0
melhorConjunto = []

# Para cada um dos itens chama funcao para inseri-lo na arvore e buscar melhor conjunto
for item in itens:
    conjunto_atual = []
    logging.info(item)
    raiz.add_item(item, valor_mochila, peso_mochila, valorRestante, pesoRestante, conjunto_atual)
    logging.info(f"- Melhor valor ate o momento: {melhor_valor} | Peso: {pesoFinal}")

# Exibindo resultados finais
logging.info(f"Valor total dos itens na mochila: {melhor_valor}")
logging.info(f"Peso total dos itens na mochila: {pesoFinal}")
logging.info("Conjunto de melhor aproveitamento na mochila:")
for item in melhorConjunto:
    logging.info(item)
