import json

def main():
    fp1 = open('compatibility.json', 'r')

    combat_info = json.load(fp1)

    fp1.close()

    for char_id in range(len(combat_info)):
        # start at 3 to account for removal of jab/get up attack/throws
        move_counter = 3
        total = ["Total"]

        # sora has many multihits
        if combat_info[char_id]["name"] == "Sora":
            move_counter -= 6

        ## Iterates Column by Column
        # shift by 1 to ignore move name
        for j in range(1, len(combat_info[char_id]["compatibility_matrix"][0]) + 1):
            current_total = 0
            # don't need to read header or total rows
            for i in range(1, len(combat_info[char_id]["compatibility_matrix"]) - 1):
                row = combat_info[char_id]["compatibility_matrix"][i]

                # Starts counting moves, ignores moves weighted as 1
                if j == 1:
                    if row[0][0:12] != "Floor attack" and row[0] != "Edge attack" and row[0][0:14] != "Neutral attack" and row[0][-5:] != "throw" and row[0][-6:] != "Pummel":
                        move_counter += 1

                value_addon = 0

                if row[j] == "True":
                    value_addon += 1
                elif row[j] == "Mixed":
                    value_addon += 0.5

                # Weighs multi-part moves to count as one move
                if row[0][0:12] == "Floor attack" or row[0] == "Edge attack":
                    value_addon = value_addon * 0.25

                elif row[0][-5:] == "throw" or row[0][-6:] == "Pummel":
                    value_addon = value_addon * 0.20

                elif row[0][-5:] == "Hit 1" or row[0][-5:] == "Hit 2":
                    value_addon = value_addon * 0.50

                elif row[0][-5:] == "Hit 3":
                    current_total *= 0.6666  # re-weigh options
                    value_addon = value_addon * 0.33333

                elif row[0][-8:] == "Infinite":
                    if combat_info[char_id]["compatibility_matrix"][i - 1][0][-5:] == "Hit 2":
                        current_total *= 0.6666  # re-weigh options
                        value_addon = value_addon * 0.33333
                    elif combat_info[char_id]["compatibility_matrix"][i - 1][0][-5:] == "Hit 3":
                        current_total *= 0.75  # re-weigh options
                        value_addon = value_addon * 0.33333

                current_total += value_addon

            total.append(round(current_total / move_counter * 100, 2))

        combat_info[char_id]["compatibility_matrix"][-1] = total

    fp2 = open('compatibility.json', 'w')

    fp2.write(json.dumps(combat_info))
    fp2.close()

if __name__ == "__main__":
    main()