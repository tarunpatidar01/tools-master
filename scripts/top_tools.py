import json
p='data/tools.json'
obj=json.load(open(p,encoding='utf-8'))
arr=sorted(obj, key=lambda x: -x.get('monthlySearches',0))[:10]
for i,t in enumerate(arr,1):
    print(i, t['slug'], t['keyword'], t.get('monthlySearches',0))
