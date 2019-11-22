import json


class Utils:
    @staticmethod
    def ler_entrada(file_name):
        with open(file_name, 'r') as file:
            return json.load(file)
