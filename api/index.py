from flask import Flask, request, jsonify
import uuid

app = Flask(__name__)


@app.route('/')
def home():
    return "Hello World!"


@app.route('/api', methods=["POST"])
def create_bill():
    content = request.json

    def split_value(value, nr_variables):
        cents = value*100
        base = cents//nr_variables
        rem = int(cents % nr_variables)
        return [(base+1)/100]*rem + [base/100]*(nr_variables-rem)

    response = {}

    response["id"] = uuid.uuid4().hex

    response["bill_name"] = content["bill_name"]

    response["people"] = content["people"]
    people_ht = {}

    for p in range(len(response["people"])):
        response["people"][p]["items"] = []
        people_ht[response["people"][p]["name"]] = p

    for bill_item in content["bill"]:
        names = bill_item["names"]  # ["Dan", "Eug"]
        split_value_arr = split_value(
            bill_item["price"], len(names))  # [6.50, 6.49]

        for n in range(len(names)):
            item = {"item": bill_item["item"], "price": split_value_arr[n]}
            response["people"][people_ht[names[n]]
                               ]["items"].append(item)  # index id

            # {"item": "Beer", "price": 6.50}
            # {"item": "Beer", "price": 6.40}

    return jsonify(
        response
    )
