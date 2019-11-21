text_file = open("arquivo_entrada_binpacking.txt")

matrix = []
i=0

for line in text_file:
    if " u" in line:
        if len(matrix) > 0:
            i += 1
        matrix.append([])
        matrix[i].append(line.split('\n')[0])
    else:
        line = line.split('\n')[0]
        if " " in line:
            if line[0] == " ":
                line = line[1:]
            line = line.split(" ")
            matrix[i].append(line)
        else:
            matrix[i].append(int(line))
            
capacity            = 0
number_of_items     = 0
best_know_solution  = 0
current_weight      = 0
bin_counter         = 0

for problem in matrix:
    capacity            = int(problem[1][0])
    number_of_items     = int(problem[1][1])
    best_know_solution  = int(problem[1][2])
    bin_counter         = 0
    #print(capacity,number_of_items,best_know_solution)
    aux_list            = problem[2:]
    aux_list.sort()
    current_weight      = 0
    i                   = 1
    teste               = 0
    while len(aux_list) > 0:
        if aux_list[-i] + current_weight <= capacity:
            current_weight  += aux_list[-i]
            aux_list.pop(-i)
            i               = 1
        else:
            i += 1
        if (
            i >= len(aux_list) or 
            current_weight == capacity
        ) and len(aux_list) > 0:
            current_weight  = 0
            i               = 1
            bin_counter     += 1
    print(f"Foi possível encher {bin_counter} bins no problema {problem[0]} usando o algoritmo guloso.")

