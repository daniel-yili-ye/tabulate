import requests
import json

f = open('testing/test_1.json')
data = json.load(f)

res = requests.post('http://127.0.0.1:5328/api', json=data)
if res.ok:
    print(res.json())
