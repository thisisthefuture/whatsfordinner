# Before running this script execut the following command:
# $ pip install requests
# To run this script execute:
# $ python export_foursquare_checkins.py
import requests
import json

url_template = 'https://api.foursquare.com/v2/users/self/checkins?limit=250&oauth_token={}&v=20131026&offset={}'

# If you navigate to https://developer.foursquare.com/docs/explore, Foursquare
# will generate an OAuth token for you automatically. Copy and paste that token
# below.
oauth_token = "UOMC2UDVEQK11NDVENJ3PHCQJOXYUDSSNVTFZKPPGAZIOMNP"
offset = 0
data = []

# This will save your foursquare_checkins to a file in the same directory as
# this script.
with open("foursquare_checkins.json", 'w') as f:
    while True:
        response = requests.get(url_template.format(oauth_token, offset))
        if len(response.json()['response']['checkins']['items']) == 0:
            break

        data.append(response.json())
        offset += 250

    f.write(json.dumps(data, sort_keys=True, indent=4, separators=(',', ': ')))
