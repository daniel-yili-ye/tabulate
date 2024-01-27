from flask import Flask, request, jsonify
from functools import reduce
import uuid

app = Flask(__name__)


@app.route('/')
def home():
    return "Hello World!"


@app.route('/api', methods=["POST"])
def create_bill():

    # Penny-Precise Allocation Algorithm
    def ppaa(value, nr_variables):
        base = value // nr_variables
        rem = int(value % nr_variables)
        return ([base+1] * rem) + ([base] * (nr_variables-rem))

    # Proportional Penny-Precise Allocation Algorithm
    def pppaa(value, subtotals_dict, people_arr):
        total = sum(list(subtotals_dict.values()))
        qr_arr = list(map(lambda x: list(
            divmod(value * subtotals_dict[x], total)) + [x], people_arr))
        qr_arr.sort(key=lambda x: x[1], reverse=True)
        leftover_cents = value - \
            reduce(lambda x, y: (x[0] + y[0], 0, 0), qr_arr)[0]
        for i in range(leftover_cents):
            qr_arr[i][0] += 1
        return qr_arr

    content = request.json

    # convert all money values to cents/integers
    for con in content["bill"]:
        con["price"] = int(con["price"] * 100)
    content["discount"] = int(content["discount"] * 100)
    content["tax"] = int(content["tax"] * 100)
    content["tip"] = int(content["tip"] * 100)

    response = {}
    response["id"] = uuid.uuid4().hex
    response["bill_name"] = content["bill_name"]
    response["people"] = content["people"]

    people = []
    people_index = {}
    subtotals = {}
    for p in range(len(response["people"])):
        name = response["people"][p]["name"]
        response["people"][p]["items"] = []
        people.append(name)
        people_index[name] = p
        subtotals[name] = 0

    # create itemized bill items for each person
    for bill_item in content["bill"]:
        names = bill_item["names"]  # ["Dan", "Eug"]
        split_value_arr = ppaa(
            bill_item["price"], len(names))  # [650, 649]
        for n in range(len(names)):
            # update subtotals dict
            subtotals[names[n]] += split_value_arr[n]
            item = {"item": bill_item["item"], "price": split_value_arr[n]}
            response["people"][people_index[names[n]]
                               ]["items"].append(item)

    # Proportional Penny-Precise Allocation Algorithm
    # allocate discount, tax, tip to each person
    discount_qr = pppaa(content["discount"], subtotals, people)
    tax_qr = pppaa(content["tax"], subtotals, people)
    tip_qr = pppaa(content["tip"], subtotals, people)

    for discount in discount_qr:
        response["people"][people_index[discount[2]]]["discount"] = discount[0]
    for tax in tax_qr:
        response["people"][people_index[tax[2]]]["tax"] = tax[0]
    for tip in tip_qr:
        response["people"][people_index[tip[2]]]["tip"] = tip[0]

    return jsonify(
        response
    )
