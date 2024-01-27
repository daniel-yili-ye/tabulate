from flask import Flask, request, jsonify
from functools import reduce
import uuid

app = Flask(__name__)


@app.route('/')
def home():
    return "Hello World!"


@app.route('/api', methods=["POST"])
def create_bill():

    def split_value(value, nr_variables):
        cents = value
        base = cents // nr_variables
        rem = int(cents % nr_variables)
        return ([base+1] * rem) + ([base] * (nr_variables-rem))

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
    people_subtotal = {}
    total = 0
    for p in range(len(response["people"])):
        name = response["people"][p]["name"]
        response["people"][p]["items"] = []
        people.append(name)
        people_index[name] = p
        people_subtotal[name] = 0

    # create itemized bill items for each person
    for bill_item in content["bill"]:
        total += bill_item["price"]
        names = bill_item["names"]  # ["Dan", "Eug"]
        split_value_arr = split_value(
            bill_item["price"], len(names))  # [650, 649]
        for n in range(len(names)):
            # update people_subtotal dict
            people_subtotal[names[n]] += split_value_arr[n]
            item = {"item": bill_item["item"], "price": split_value_arr[n]}
            response["people"][people_index[names[n]]
                               ]["items"].append(item)

    # allocate discount, tax, tip
    # determine how much should be allocated to each person
    discount_qr = list(map(lambda x: list(divmod(
        content["discount"] * people_subtotal[x], total)) + [x], people))
    tax_qr = list(map(lambda x: list(divmod(
        content["tax"] * people_subtotal[x], total)) + [x], people))
    tip_qr = list(map(lambda x: list(divmod(
        content["tip"] * people_subtotal[x], total)) + [x], people))

    discount_qr.sort(key=lambda x: x[1], reverse=True)
    tax_qr.sort(key=lambda x: x[1], reverse=True)
    tip_qr.sort(key=lambda x: x[1], reverse=True)

    discount_leftover_cents = content["discount"] - \
        reduce(lambda x, y: (x[0] + y[0], 0, 0), discount_qr)[0]
    tax_leftover_cents = content["tax"] - \
        reduce(lambda x, y: (x[0] + y[0], 0, 0), tax_qr)[0]
    tip_leftover_cents = content["tip"] - \
        reduce(lambda x, y: (x[0] + y[0], 0, 0), tip_qr)[0]

    for i in range(discount_leftover_cents):
        discount_qr[i][0] += 1
    for i in range(tax_leftover_cents):
        tax_qr[i][0] += 1
    for i in range(tip_leftover_cents):
        tip_qr[i][0] += 1

    for discount in discount_qr:
        response["people"][people_index[discount[2]]]["discount"] = discount[0]
    for tax in tax_qr:
        response["people"][people_index[tax[2]]]["tax"] = tax[0]
    for tip in tip_qr:
        response["people"][people_index[tip[2]]]["tip"] = tip[0]

    return jsonify(
        response
    )
