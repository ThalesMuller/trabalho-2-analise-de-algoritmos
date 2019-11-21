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
    count = 0
    list_best_result = []
    general_index = 0
    best_element = None
    best_value = 0

    def __init__(self):
        self.entrada = filter(self.process_knapsack, Utils.ler_entrada('arquivo_entrada_mochila.json'))
        # for item in self.entrada:
        #     item.update({"id": self.count})
        #     self.count += 1

    def process_knapsack(self, value):
        if 'knapsack' not in value['item']:
            self.knapsack_info = value
            return True

    def calcule(self):
        logging.info(self.entrada)
        # for node in self.entrada:
        self.recursive_backtracking(0)

    def recursive_backtracking(self, index, lado, ultimo_lado):
        if index > len() - 1:
            self.recursive_backtracking(index - 1, 1)
        else:
            object = self.entrada[index]
            if not self.best_value + object['value'] > self.knapsack_info['value']:
                self.best_value + object['value']
                self.list_best_result.append(self.entrada[index])
                if
            else:
                self.recursive_backtracking(index - 1)

    def generic(self):
        def A_n_k(a, n, k, depth, used, curr, ans):
            '''
            Implement permutation of k items out  of n items
            depth: start from 0, and represent the depth of the search
            used: track what items are  in the partial solution from the set of n
            curr: the current partial solution
            ans: collect all the valide solutions
            '''
            if depth == k:  # end condition
                ans.append(
                    curr[::])  # use deepcopy because curr is tracking all partial solution, it eventually become []
                return

            for i in range(n):
                if not used[i]:
                    # generate the next solution from curr
                    curr.append(a[i])
                    used[i] = True
                    print(curr)
                    # move to the next solution

                    A_n_k(a, n, k, depth + 1, used, curr, ans)

                    # backtrack to previous partial state
                    curr.pop()
                    print('backtrack: ', curr)
                    used[i] = False
            return

        a = [{"item": "teste", "value": 3}, {"item": "teste4", "value": 4}, {"item": "teste5", "value": 5},
             {"item": "teste6", "value": 6}, {"item": "teste7", "value": 7}]
        n = len(a)
        ans = [[None]]
        used = [False] * len(a)
        ans = []
        A_n_k(a, n, n, 0, used, [], ans)
        print(ans)


CalculoBacktracking().calcule()
