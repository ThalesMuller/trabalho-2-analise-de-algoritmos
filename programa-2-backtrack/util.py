import json


class Utils:
    @staticmethod
    def ler_entrada(file_name):
        with open(file_name, 'r') as file:
            array = []
            for item in json.load(file):
                if not item['item'] == 'knapsack':
                    array.append((item['item'], item['weight'], item['value']))
            return tuple(array)

# print(os.system("ls"))
