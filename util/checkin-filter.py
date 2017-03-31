import json

def find_restaurant(x):
    try:
        return x[u'response'][u'checkins'][u'count'] == 1511
        # return x[u'response'][u'checkins'][u'items'][u'venue'][u'name'] == u'Suika Seattle'
    except (KeyError, TypeError):
        return False

s = '{"name": "Suika Seattle"}'
with open('../data/foursquare_checkins - Copy.json') as json_data:
    d = json.load(json_data)
    # print(d)
    suika_data = filter(find_restaurant, d)
    print(suika_data)
    print('hmmm')