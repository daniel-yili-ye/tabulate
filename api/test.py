import requests
import json

f = open('test.json')
data = json.load(f)

res = requests.post('http://127.0.0.1:5328/api', json=data)
if res.ok:
    print(res.json())


def f(nr_variables, value):

    cents = value*100

    base = cents//nr_variables
    rem = int(cents % nr_variables)

    return [(base+1)/100]*rem + [base/100]*(nr_variables-rem)


print(f(6, 0.1))
