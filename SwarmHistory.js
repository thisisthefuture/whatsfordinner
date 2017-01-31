var fs = require('fs');
var text;

var express = require('express');
var app = express();
var port = process.env.PORT || 8000;
var server = require('http').Server(app);

var categories = {                              // list of valid food/drinks related categories
  "Food": "4d4b7105d754a06374d81259",
  "Afghan Restaurant": "503288ae91d4c4b30a586d67",
  "African Restaurant": "4bf58dd8d48988d1c8941735",
  "Ethiopian Restaurant": "4bf58dd8d48988d10a941735",
  "American Restaurant": "4bf58dd8d48988d14e941735",
  "New American Restaurant": "4bf58dd8d48988d157941735",
  "Asian Restaurant": "4bf58dd8d48988d142941735",
  "Burmese Restaurant": "56aa371be4b08b9a8d573568",
  "Cambodian Restaurant": "52e81612bcbc57f1066b7a03",
  "Chinese Restaurant": "4bf58dd8d48988d145941735",
  "Anhui Restaurant": "52af3a5e3cf9994f4e043bea",
  "Beijing Restaurant": "52af3a723cf9994f4e043bec",
  "Cantonese Restaurant": "52af3a7c3cf9994f4e043bed",
  "Chinese Aristocrat Restaurant": "52af3a673cf9994f4e043beb",
  "Chinese Breakfast Place": "52af3a903cf9994f4e043bee",
  "Dim Sum Restaurant": "4bf58dd8d48988d1f5931735",
  "Dongbei Restaurant": "52af3a9f3cf9994f4e043bef",
  "Fujian Restaurant": "52af3aaa3cf9994f4e043bf0",
  "Guizhou Restaurant": "52af3ab53cf9994f4e043bf1",
  "Hainan Restaurant": "52af3abe3cf9994f4e043bf2",
  "Hakka Restaurant": "52af3ac83cf9994f4e043bf3",
  "Henan Restaurant": "52af3ad23cf9994f4e043bf4",
  "Hong Kong Restaurant": "52af3add3cf9994f4e043bf5",
  "Huaiyang Restaurant": "52af3af23cf9994f4e043bf7",
  "Hubei Restaurant": "52af3ae63cf9994f4e043bf6",
  "Hunan Restaurant": "52af3afc3cf9994f4e043bf8",
  "Imperial Restaurant": "52af3b053cf9994f4e043bf9",
  "Jiangsu Restaurant": "52af3b213cf9994f4e043bfa",
  "Jiangxi Restaurant": "52af3b293cf9994f4e043bfb",
  "Macanese Restaurant": "52af3b343cf9994f4e043bfc",
  "Manchu Restaurant": "52af3b3b3cf9994f4e043bfd",
  "Peking Duck Restaurant": "52af3b463cf9994f4e043bfe",
  "Shaanxi Restaurant": "52af3b633cf9994f4e043c01",
  "Shandong Restaurant": "52af3b513cf9994f4e043bff",
  "Shanghai Restaurant": "52af3b593cf9994f4e043c00",
  "Shanxi Restaurant": "52af3b6e3cf9994f4e043c02",
  "Szechuan Restaurant": "52af3b773cf9994f4e043c03",
  "Taiwanese Restaurant": "52af3b813cf9994f4e043c04",
  "Tianjin Restaurant": "52af3b893cf9994f4e043c05",
  "Xinjiang Restaurant": "52af3b913cf9994f4e043c06",
  "Yunnan Restaurant": "52af3b9a3cf9994f4e043c07",
  "Zhejiang Restaurant": "52af3ba23cf9994f4e043c08",
  "Filipino Restaurant": "4eb1bd1c3b7b55596b4a748f",
  "Himalayan Restaurant": "52e81612bcbc57f1066b79fb",
  "Hotpot Restaurant": "52af0bd33cf9994f4e043bdd",
  "Indonesian Restaurant": "4deefc054765f83613cdba6f",
  "Acehnese Restaurant": "52960eda3cf9994f4e043ac9",
  "Balinese Restaurant": "52960eda3cf9994f4e043acb",
  "Betawinese Restaurant": "52960eda3cf9994f4e043aca",
  "Indonesian Meatball Place": "52960eda3cf9994f4e043acc",
  "Javanese Restaurant": "52960eda3cf9994f4e043ac7",
  "Manadonese Restaurant": "52960eda3cf9994f4e043ac8",
  "Padangnese Restaurant": "52960eda3cf9994f4e043ac5",
  "Sundanese Restaurant": "52960eda3cf9994f4e043ac6",
  "Japanese Restaurant": "4bf58dd8d48988d111941735",
  "Donburi Restaurant": "55a59bace4b013909087cb0c",
  "Japanese Curry Restaurant": "55a59bace4b013909087cb30",
  "Kaiseki Restaurant": "55a59bace4b013909087cb21",
  "Kushikatsu Restaurant": "55a59bace4b013909087cb06",
  "Monjayaki Restaurant": "55a59bace4b013909087cb1b",
  "Nabe Restaurant": "55a59bace4b013909087cb1e",
  "Okonomiyaki Restaurant": "55a59bace4b013909087cb18",
  "Ramen Restaurant": "55a59bace4b013909087cb24",
  "Shabu-Shabu Restaurant": "55a59bace4b013909087cb15",
  "Soba Restaurant": "55a59bace4b013909087cb27",
  "Sukiyaki Restaurant": "55a59bace4b013909087cb12",
  "Sushi Restaurant": "4bf58dd8d48988d1d2941735",
  "Takoyaki Place": "55a59bace4b013909087cb2d",
  "Tempura Restaurant": "55a59a31e4b013909087cb00",
  "Tonkatsu Restaurant": "55a59af1e4b013909087cb03",
  "Udon Restaurant": "55a59bace4b013909087cb2a",
  "Unagi Restaurant": "55a59bace4b013909087cb0f",
  "Wagashi Place": "55a59bace4b013909087cb33",
  "Yakitori Restaurant": "55a59bace4b013909087cb09",
  "Yoshoku Restaurant": "55a59bace4b013909087cb36",
  "Korean Restaurant": "4bf58dd8d48988d113941735",
  "Bossam/Jokbal Restaurant": "56aa371be4b08b9a8d5734e4",
  "Bunsik Restaurant": "56aa371be4b08b9a8d5734f0",
  "Gukbap Restaurant": "56aa371be4b08b9a8d5734e7",
  "Janguh Restaurant": "56aa371be4b08b9a8d5734ed",
  "Samgyetang Restaurant": "56aa371be4b08b9a8d5734ea",
  "Malay Restaurant": "4bf58dd8d48988d156941735",
  "Mongolian Restaurant": "4eb1d5724b900d56c88a45fe",
  "Noodle House": "4bf58dd8d48988d1d1941735",
  "Satay Restaurant": "56aa371be4b08b9a8d57350e",
  "Thai Restaurant": "4bf58dd8d48988d149941735",
  "Som Tum Restaurant": "56aa371be4b08b9a8d573502",
  "Tibetan Restaurant": "52af39fb3cf9994f4e043be9",
  "Vietnamese Restaurant": "4bf58dd8d48988d14a941735",
  "Australian Restaurant": "4bf58dd8d48988d169941735",
  "Austrian Restaurant": "52e81612bcbc57f1066b7a01",
  "BBQ Joint": "4bf58dd8d48988d1df931735",
  "Bagel Shop": "4bf58dd8d48988d179941735",
  "Bakery": "4bf58dd8d48988d16a941735",
  "Belgian Restaurant": "52e81612bcbc57f1066b7a02",
  "Bistro": "52e81612bcbc57f1066b79f1",
  "Breakfast Spot": "4bf58dd8d48988d143941735",
  "Bubble Tea Shop": "52e81612bcbc57f1066b7a0c",
  "Buffet": "52e81612bcbc57f1066b79f4",
  "Burger Joint": "4bf58dd8d48988d16c941735",
  "Cafeteria": "4bf58dd8d48988d128941735",
  "Café": "4bf58dd8d48988d16d941735",
  "Cajun / Creole Restaurant": "4bf58dd8d48988d17a941735",
  "Caribbean Restaurant": "4bf58dd8d48988d144941735",
  "Cuban Restaurant": "4bf58dd8d48988d154941735",
  "Caucasian Restaurant": "5293a7d53cf9994f4e043a45",
  "Coffee Shop": "4bf58dd8d48988d1e0931735",
  "Comfort Food Restaurant": "52e81612bcbc57f1066b7a00",
  "Creperie": "52e81612bcbc57f1066b79f2",
  "Czech Restaurant": "52f2ae52bcbc57f1066b8b81",
  "Deli / Bodega": "4bf58dd8d48988d146941735",
  "Dessert Shop": "4bf58dd8d48988d1d0941735",
  "Cupcake Shop": "4bf58dd8d48988d1bc941735",
  "Frozen Yogurt Shop": "512e7cae91d4cbb4e5efe0af",
  "Ice Cream Shop": "4bf58dd8d48988d1c9941735",
  "Pastry Shop": "5744ccdfe4b0c0459246b4e2",
  "Pie Shop": "52e81612bcbc57f1066b7a0a",
  "Diner": "4bf58dd8d48988d147941735",
  "Donut Shop": "4bf58dd8d48988d148941735",
  "Dumpling Restaurant": "4bf58dd8d48988d108941735",
  "Dutch Restaurant": "5744ccdfe4b0c0459246b4d0",
  "Eastern European Restaurant": "4bf58dd8d48988d109941735",
  "Belarusian Restaurant": "52e928d0bcbc57f1066b7e97",
  "Bulgarian Restaurant": "56aa371be4b08b9a8d5734f3",
  "Romanian Restaurant": "52960bac3cf9994f4e043ac4",
  "Tatar Restaurant": "52e928d0bcbc57f1066b7e98",
  "English Restaurant": "52e81612bcbc57f1066b7a05",
  "Falafel Restaurant": "4bf58dd8d48988d10b941735",
  "Fast Food Restaurant": "4bf58dd8d48988d16e941735",
  "Fish & Chips Shop": "4edd64a0c7ddd24ca188df1a",
  "Fondue Restaurant": "52e81612bcbc57f1066b7a09",
  "Food Court": "4bf58dd8d48988d120951735",
  "Food Stand": "56aa371be4b08b9a8d57350b",
  "Food Truck": "4bf58dd8d48988d1cb941735",
  "French Restaurant": "4bf58dd8d48988d10c941735",
  "Alsatian Restaurant": "57558b36e4b065ecebd306b6",
  "Auvergne Restaurant": "57558b36e4b065ecebd306b8",
  "Basque Restaurant": "57558b36e4b065ecebd306bc",
  "Brasserie": "57558b36e4b065ecebd306b0",
  "Breton Restaurant": "57558b36e4b065ecebd306c5",
  "Burgundian Restaurant": "57558b36e4b065ecebd306c0",
  "Catalan Restaurant": "57558b36e4b065ecebd306cb",
  "Ch'ti Restaurant": "57558b36e4b065ecebd306ce",
  "Corsican Restaurant": "57558b36e4b065ecebd306d1",
  "Estaminet": "57558b36e4b065ecebd306b4",
  "Labour Canteen": "57558b36e4b065ecebd306b2",
  "Lyonese Bouchon": "57558b35e4b065ecebd306ad",
  "Norman Restaurant": "57558b36e4b065ecebd306d4",
  "Provençal Restaurant": "57558b36e4b065ecebd306d7",
  "Savoyard Restaurant": "57558b36e4b065ecebd306da",
  "Southwestern French Restaurant": "57558b36e4b065ecebd306ba",
  "Fried Chicken Joint": "4d4ae6fc7a7b7dea34424761",
  "Friterie": "55d25775498e9f6a0816a37a",
  "Gastropub": "4bf58dd8d48988d155941735",
  "German Restaurant": "4bf58dd8d48988d10d941735",
  "Apple Wine Pub": "56aa371ce4b08b9a8d573583",
  "Bavarian Restaurant": "56aa371ce4b08b9a8d573572",
  "Bratwurst Joint": "56aa371ce4b08b9a8d57358e",
  "Currywurst Joint": "56aa371ce4b08b9a8d57358b",
  "Franconian Restaurant": "56aa371ce4b08b9a8d573574",
  "German Pop-Up Restaurant": "56aa371ce4b08b9a8d573592",
  "Palatine Restaurant": "56aa371ce4b08b9a8d573578",
  "Rhenisch Restaurant": "56aa371ce4b08b9a8d57357b",
  "Schnitzel Restaurant": "56aa371ce4b08b9a8d573587",
  "Silesian Restaurant": "56aa371ce4b08b9a8d57357f",
  "Swabian Restaurant": "56aa371ce4b08b9a8d573576",
  "Gluten-free Restaurant": "4c2cd86ed066bed06c3c5209",
  "Greek Restaurant": "4bf58dd8d48988d10e941735",
  "Bougatsa Shop": "53d6c1b0e4b02351e88a83e8",
  "Cretan Restaurant": "53d6c1b0e4b02351e88a83e2",
  "Fish Taverna": "53d6c1b0e4b02351e88a83d8",
  "Grilled Meat Restaurant": "53d6c1b0e4b02351e88a83d6",
  "Kafenio": "53d6c1b0e4b02351e88a83e6",
  "Magirio": "53d6c1b0e4b02351e88a83e4",
  "Meze Restaurant": "53d6c1b0e4b02351e88a83da",
  "Modern Greek Restaurant": "53d6c1b0e4b02351e88a83d4",
  "Ouzeri": "53d6c1b0e4b02351e88a83dc",
  "Patsa Restaurant": "53d6c1b0e4b02351e88a83e0",
  "Souvlaki Shop": "52e81612bcbc57f1066b79f3",
  "Taverna": "53d6c1b0e4b02351e88a83d2",
  "Tsipouro Restaurant": "53d6c1b0e4b02351e88a83de",
  "Halal Restaurant": "52e81612bcbc57f1066b79ff",
  "Hawaiian Restaurant": "52e81612bcbc57f1066b79fe",
  "Hot Dog Joint": "4bf58dd8d48988d16f941735",
  "Hungarian Restaurant": "52e81612bcbc57f1066b79fa",
  "Indian Restaurant": "4bf58dd8d48988d10f941735",
  "Andhra Restaurant": "54135bf5e4b08f3d2429dfe5",
  "Awadhi Restaurant": "54135bf5e4b08f3d2429dff3",
  "Bengali Restaurant": "54135bf5e4b08f3d2429dff5",
  "Chaat Place": "54135bf5e4b08f3d2429dfe2",
  "Chettinad Restaurant": "54135bf5e4b08f3d2429dff2",
  "Dhaba": "54135bf5e4b08f3d2429dfe1",
  "Dosa Place": "54135bf5e4b08f3d2429dfe3",
  "Goan Restaurant": "54135bf5e4b08f3d2429dfe8",
  "Gujarati Restaurant": "54135bf5e4b08f3d2429dfe9",
  "Hyderabadi Restaurant": "54135bf5e4b08f3d2429dfe6",
  "Indian Chinese Restaurant": "54135bf5e4b08f3d2429dfdf",
  "Indian Sweet Shop": "54135bf5e4b08f3d2429dfe4",
  "Irani Cafe": "54135bf5e4b08f3d2429dfe7",
  "Jain Restaurant": "54135bf5e4b08f3d2429dfea",
  "Karnataka Restaurant": "54135bf5e4b08f3d2429dfeb",
  "Kerala Restaurant": "54135bf5e4b08f3d2429dfed",
  "Maharashtrian Restaurant": "54135bf5e4b08f3d2429dfee",
  "Mughlai Restaurant": "54135bf5e4b08f3d2429dff4",
  "Multicuisine Indian Restaurant": "54135bf5e4b08f3d2429dfe0",
  "North Indian Restaurant": "54135bf5e4b08f3d2429dfdd",
  "Northeast Indian Restaurant": "54135bf5e4b08f3d2429dff6",
  "Parsi Restaurant": "54135bf5e4b08f3d2429dfef",
  "Punjabi Restaurant": "54135bf5e4b08f3d2429dff0",
  "Rajasthani Restaurant": "54135bf5e4b08f3d2429dff1",
  "South Indian Restaurant": "54135bf5e4b08f3d2429dfde",
  "Udupi Restaurant": "54135bf5e4b08f3d2429dfec",
  "Irish Pub": "52e81612bcbc57f1066b7a06",
  "Italian Restaurant": "4bf58dd8d48988d110941735",
  "Abruzzo Restaurant": "55a5a1ebe4b013909087cbb6",
  "Agriturismo": "55a5a1ebe4b013909087cb7c",
  "Aosta Restaurant": "55a5a1ebe4b013909087cba7",
  "Basilicata Restaurant": "55a5a1ebe4b013909087cba1",
  "Calabria Restaurant": "55a5a1ebe4b013909087cba4",
  "Campanian Restaurant": "55a5a1ebe4b013909087cb95",
  "Emilia Restaurant": "55a5a1ebe4b013909087cb89",
  "Friuli Restaurant": "55a5a1ebe4b013909087cb9b",
  "Ligurian Restaurant": "55a5a1ebe4b013909087cb98",
  "Lombard Restaurant": "55a5a1ebe4b013909087cbbf",
  "Malga": "55a5a1ebe4b013909087cb79",
  "Marche Restaurant": "55a5a1ebe4b013909087cbb0",
  "Molise Restaurant": "55a5a1ebe4b013909087cbb3",
  "Piadineria": "55a5a1ebe4b013909087cb74",
  "Piedmontese Restaurant": "55a5a1ebe4b013909087cbaa",
  "Puglia Restaurant": "55a5a1ebe4b013909087cb83",
  "Romagna Restaurant": "55a5a1ebe4b013909087cb8c",
  "Roman Restaurant": "55a5a1ebe4b013909087cb92",
  "Sardinian Restaurant": "55a5a1ebe4b013909087cb8f",
  "Sicilian Restaurant": "55a5a1ebe4b013909087cb86",
  "South Tyrolean Restaurant": "55a5a1ebe4b013909087cbb9",
  "Trattoria/Osteria": "55a5a1ebe4b013909087cb7f",
  "Trentino Restaurant": "55a5a1ebe4b013909087cbbc",
  "Tuscan Restaurant": "55a5a1ebe4b013909087cb9e",
  "Umbrian Restaurant": "55a5a1ebe4b013909087cbc2",
  "Veneto Restaurant": "55a5a1ebe4b013909087cbad",
  "Jewish Restaurant": "52e81612bcbc57f1066b79fd",
  "Kosher Restaurant": "52e81612bcbc57f1066b79fc",
  "Juice Bar": "4bf58dd8d48988d112941735",
  "Kebab Restaurant": "5283c7b4e4b094cb91ec88d7",
  "Latin American Restaurant": "4bf58dd8d48988d1be941735",
  "Arepa Restaurant": "4bf58dd8d48988d152941735",
  "Empanada Restaurant": "52939a8c3cf9994f4e043a35",
  "Salvadoran Restaurant": "5745c7ac498e5d0483112fdb",
  "South American Restaurant": "4bf58dd8d48988d1cd941735",
  "Argentinian Restaurant": "4bf58dd8d48988d107941735",
  "Brazilian Restaurant": "4bf58dd8d48988d16b941735",
  "Acai House": "5294c7523cf9994f4e043a62",
  "Baiano Restaurant": "52939ae13cf9994f4e043a3b",
  "Central Brazilian Restaurant": "52939a9e3cf9994f4e043a36",
  "Churrascaria": "52939a643cf9994f4e043a33",
  "Empada House": "5294c55c3cf9994f4e043a61",
  "Goiano Restaurant": "52939af83cf9994f4e043a3d",
  "Mineiro Restaurant": "52939aed3cf9994f4e043a3c",
  "Northeastern Brazilian Restaurant": "52939aae3cf9994f4e043a37",
  "Northern Brazilian Restaurant": "52939ab93cf9994f4e043a38",
  "Pastelaria": "5294cbda3cf9994f4e043a63",
  "Southeastern Brazilian Restaurant": "52939ac53cf9994f4e043a39",
  "Southern Brazilian Restaurant": "52939ad03cf9994f4e043a3a",
  "Tapiocaria": "52939a7d3cf9994f4e043a34",
  "Peruvian Restaurant": "4eb1bfa43b7b52c0e1adc2e8",
  "Venezuelan Restaurant": "56aa371be4b08b9a8d573558",
  "Mac & Cheese Joint": "4bf58dd8d48988d1bf941735",
  "Mediterranean Restaurant": "4bf58dd8d48988d1c0941735",
  "Moroccan Restaurant": "4bf58dd8d48988d1c3941735",
  "Mexican Restaurant": "4bf58dd8d48988d1c1941735",
  "Burrito Place": "4bf58dd8d48988d153941735",
  "Taco Place": "4bf58dd8d48988d151941735",
  "Tex-Mex Restaurant": "56aa371ae4b08b9a8d5734ba",
  "Yucatecan Restaurant": "5744ccdfe4b0c0459246b4d3",
  "Middle Eastern Restaurant": "4bf58dd8d48988d115941735",
  "Israeli Restaurant": "56aa371be4b08b9a8d573529",
  "Kurdish Restaurant": "5744ccdfe4b0c0459246b4ca",
  "Persian Restaurant": "52e81612bcbc57f1066b79f7",
  "Tabbakhi": "5744ccdfe4b0c0459246b4a8",
  "Modern European Restaurant": "52e81612bcbc57f1066b79f9",
  "Molecular Gastronomy Restaurant": "4bf58dd8d48988d1c2941735",
  "Pakistani Restaurant": "52e81612bcbc57f1066b79f8",
  "Pet Café": "56aa371be4b08b9a8d573508",
  "Pizza Place": "4bf58dd8d48988d1ca941735",
  "Polish Restaurant": "52e81612bcbc57f1066b7a04",
  "Portuguese Restaurant": "4def73e84765ae376e57713a",
  "Poutine Place": "56aa371be4b08b9a8d5734c7",
  "Restaurant": "4bf58dd8d48988d1c4941735",
  "Russian Restaurant": "5293a7563cf9994f4e043a44",
  "Blini House": "52e928d0bcbc57f1066b7e9d",
  "Pelmeni House": "52e928d0bcbc57f1066b7e9c",
  "Salad Place": "4bf58dd8d48988d1bd941735",
  "Sandwich Place": "4bf58dd8d48988d1c5941735",
  "Scandinavian Restaurant": "4bf58dd8d48988d1c6941735",
  "Scottish Restaurant": "5744ccdde4b0c0459246b4a3",
  "Seafood Restaurant": "4bf58dd8d48988d1ce941735",
  "Slovak Restaurant": "56aa371be4b08b9a8d57355a",
  "Snack Place": "4bf58dd8d48988d1c7941735",
  "Soup Place": "4bf58dd8d48988d1dd931735",
  "Southern / Soul Food Restaurant": "4bf58dd8d48988d14f941735",
  "Spanish Restaurant": "4bf58dd8d48988d150941735",
  "Paella Restaurant": "4bf58dd8d48988d14d941735",
  "Tapas Restaurant": "4bf58dd8d48988d1db931735",
  "Sri Lankan Restaurant": "5413605de4b0ae91d18581a9",
  "Steakhouse": "4bf58dd8d48988d1cc941735",
  "Swiss Restaurant": "4bf58dd8d48988d158941735",
  "Tea Room": "4bf58dd8d48988d1dc931735",
  "Theme Restaurant": "56aa371be4b08b9a8d573538",
  "Truck Stop": "57558b36e4b065ecebd306dd",
  "Turkish Restaurant": "4f04af1f2fb6e1c99f3db0bb",
  "Borek Place": "530faca9bcbc57f1066bc2f3",
  "Cigkofte Place": "530faca9bcbc57f1066bc2f4",
  "Doner Restaurant": "5283c7b4e4b094cb91ec88d8",
  "Gozleme Place": "5283c7b4e4b094cb91ec88d9",
  "Kofte Place": "5283c7b4e4b094cb91ec88db",
  "Kokoreç Restaurant": "5283c7b4e4b094cb91ec88d6",
  "Kumpir Restaurant": "56aa371be4b08b9a8d573535",
  "Kumru Restaurant": "56aa371be4b08b9a8d5734bd",
  "Manti Place": "5283c7b4e4b094cb91ec88d5",
  "Meyhane": "5283c7b4e4b094cb91ec88da",
  "Pide Place": "530faca9bcbc57f1066bc2f2",
  "Tantuni Restaurant": "56aa371be4b08b9a8d5734bf",
  "Turkish Coffeehouse": "56aa371be4b08b9a8d5734c1",
  "Turkish Home Cooking Restaurant": "5283c7b4e4b094cb91ec88d4",
  "Ukrainian Restaurant": "52e928d0bcbc57f1066b7e96",
  "Varenyky restaurant": "52e928d0bcbc57f1066b7e9a",
  "West-Ukrainian Restaurant": "52e928d0bcbc57f1066b7e9b",
  "Vegetarian / Vegan Restaurant": "4bf58dd8d48988d1d3941735",
  "Wings Joint": "4bf58dd8d48988d14c941735",
  "Nightlife Spot": "4d4b7105d754a06376d81259",
  "Bar": "4bf58dd8d48988d116941735",
  "Beach Bar": "52e81612bcbc57f1066b7a0d",
  "Beer Bar": "56aa371ce4b08b9a8d57356c",
  "Beer Garden": "4bf58dd8d48988d117941735",
  "Champagne Bar": "52e81612bcbc57f1066b7a0e",
  "Cocktail Bar": "4bf58dd8d48988d11e941735",
  "Dive Bar": "4bf58dd8d48988d118941735",
  "Gay Bar": "4bf58dd8d48988d1d8941735",
  "Hookah Bar": "4bf58dd8d48988d119941735",
  "Hotel Bar": "4bf58dd8d48988d1d5941735",
  "Karaoke Bar": "4bf58dd8d48988d120941735",
  "Pub": "4bf58dd8d48988d11b941735",
  "Sake Bar": "4bf58dd8d48988d11c941735",
  "Sports Bar": "4bf58dd8d48988d11d941735",
  "Tiki Bar": "56aa371be4b08b9a8d57354d",
  "Whisky Bar": "4bf58dd8d48988d122941735",
  "Wine Bar": "4bf58dd8d48988d123941735",
  "Brewery": "50327c8591d4c4b30a586d5d",
  "Lounge": "4bf58dd8d48988d121941735",
  "Night Market": "53e510b7498ebcb1801b55d4",
  "Nightclub": "4bf58dd8d48988d11f941735",
  "Other Nightlife": "4bf58dd8d48988d11a941735",
  "Speakeasy": "4bf58dd8d48988d1d4941735"
};


server.listen(port, function() {
    console.log("App is running on port " + port);
});

app.get('/', function (req, res) {

  var summary = '';
  fs.readFile('data/foursquare_checkins.json', 'utf8', function (err, data) {
    if (err) throw err;
    text = JSON.parse(data);
    var places = [];

    // combining multiple arrays of checkins into one
    for (var i = 0 ; i < text.length; i++) {
      places = places.concat(text[i].response.checkins.items);
    }

    // response format: text[ ].response.checkins.items.venue.categories[ ].name

    // var places = text[0].response.checkins.items;     // give me only the array of checkin items in text[0]

    // format: places[ ].venue.categories[ ].name
    // console.log(places[0].venue.categories[0].name);

    var placesToEat = [];
    console.log('# of places', places.length);

   for (var i = 0; i < places.length; i++) {

      if (places[i].hasOwnProperty('venue')) {

        // check that the venue.categories is in the list of valid categories before we do anything else
        if (function(category) {
            return categories.hasOwnProperty(category.name);
          }(places[i].venue.categories[0] || 'none')) {

            // need to check if place is already in placesToEat. If not, add.
            var place = placesToEat.find(function (element) {
              if (element.details.venue.name === places[i].venue.name) {
                return element;
              }
            });

            if (place === undefined) {
              placesToEat.push(
                {
                  details: places[i],
                  count: 1
                });
//              summary += ('place ' + i + ': ' + places[i].venue.name + ' is a place to eat!<br />');
            }
            else {
              place.count++;
            }
        }
      } else {
        console.log('item', i, 'missing venue property');
      }

    }
    console.log('# of places to eat', placesToEat.length);

    for (var i = 0; i < placesToEat.length; i++) {
      summary += ('Eat at #' + i + ': ' + placesToEat[i].details.venue.name + '. Visited @ least ' + placesToEat[i].count +' times<br />');
    }

    res.send(summary);


    // console.log(text);
    // res.send('hi');
  });
})

// var text = [ { "meta": { "code": 200, "requestId": "5887e551dd57974d22a8429c" }, "notifications": [ { "item": { "unreadCount": 0 }, "type": "notificationTray" } ], "response": { "checkins": { "count": 1511, "items": [ { "comments": { "count": 0 }, "createdAt": 1485114975, "id": "58850e5fac136931b3b66dac", "isMayor": false, "like": false, "likes": { "count": 0, "groups": [] }, "photos": { "count": 0, "items": [] }, "posts": { "count": 0, "textCount": 0 }, "source": { "name": "Swarm for iOS", "url": "https://www.swarmapp.com" }, "timeZoneOffset": -480, "type": "checkin", "venue": { "allowMenuUrlEdit": true, "beenHere": { "lastCheckinExpiredAt": 0 }, "categories": [ { "icon": { "prefix": "https://ss3.4sqi.net/img/categories_v2/food/vietnamese_", "suffix": ".png" }, "id": "4bf58dd8d48988d14a941735", "name": "Vietnamese Restaurant", "pluralName": "Vietnamese Restaurants", "primary": true, "shortName": "Vietnamese" } ], "contact": { "formattedPhone": "(206) 325-2111", "phone": "2063252111", "twitter": "monsoonnw" }, "hasMenu": true, "id": "4391a4d9f964a5205e2b1fe3", "location": { "address": "615 19th Ave E", "cc": "US", "city": "Seattle", "country": "United States", "crossStreet": "at E Mercer St", "formattedAddress": [ "615 19th Ave E (at E Mercer St)", "Seattle, WA 98112" ], "labeledLatLngs": [ { "label": "display", "lat": 47.62479716487741, "lng": -122.30756968259811 } ], "lat": 47.62479716487741, "lng": -122.30756968259811, "postalCode": "98112", "state": "WA" }, "menu": { "anchor": "View Menu", "label": "Menu", "mobileUrl": "https://foursquare.com/v/4391a4d9f964a5205e2b1fe3/device_menu", "type": "Menu", "url": "https://foursquare.com/v/monsoon/4391a4d9f964a5205e2b1fe3/menu" }, "name": "Monsoon", "stats": { "checkinsCount": 2798, "tipCount": 48, "usersCount": 1470 }, "url": "http://www.monsoonseattle.com", "verified": false } }, { "comments": { "count": 0 }, "createdAt": 1485063103, "id": "588443bf2bc5e272f3f8ab3a", "isMayor": false, "like": false, "likes": { "count": 0, "groups": [] }, "photos": { "count": 0, "items": [] }, "posts": { "count": 0, "textCount": 0 }, "source": { "name": "Swarm for iOS", "url": "https://www.swarmapp.com" }, "timeZoneOffset": -480, "type": "checkin", "venue": { "allowMenuUrlEdit": true, "beenHere": { "lastCheckinExpiredAt": 0 }, "categories": [ { "icon": { "prefix": "https://ss3.4sqi.net/img/categories_v2/nightlife/pub_", "suffix": ".png" }, "id": "4bf58dd8d48988d116941735", "name": "Bar", "pluralName": "Bars", "primary": true, "shortName": "Bar" } ], "contact": { "formattedPhone": "(206) 245-1390", "phone": "2062451390" }, "hasMenu": true, "id": "4f3dffcae4b02787b3ae4674", "location": { "address": "719 E Pike St", "cc": "US", "city": "Seattle", "country": "United States", "crossStreet": "at Harvard Ave.", "formattedAddress": [ "719 E Pike St (at Harvard Ave.)", "Seattle, WA 98122" ], "labeledLatLngs": [ { "label": "display", "lat": 47.61405165530944, "lng": -122.32260390442656 } ], "lat": 47.61405165530944, "lng": -122.32260390442656, "postalCode": "98122", "state": "WA" }, "menu": { "anchor": "View Menu", "label": "Menu", "mobileUrl": "https://foursquare.com/v/4f3dffcae4b02787b3ae4674/device_menu", "type": "Menu", "url": "https://foursquare.com/v/saint-johns-bar--eatery/4f3dffcae4b02787b3ae4674/menu" }, "name": "Saint John's Bar & Eatery", "stats": { "checkinsCount": 3473, "tipCount": 23, "usersCount": 1614 }, "url": "http://saintjohnsseattle.com", "verified": false } }, { "comments": { "count": 0 }, "createdAt": 1484878945, "id": "58817461040d537fb5bb7f5b", "isMayor": false, "like": false, "likes": { "count": 0, "groups": [] }, "photos": { "count": 0, "items": [] }, "posts": { "count": 0, "textCount": 0 }, "source": { "name": "Swarm for iOS", "url": "https://www.swarmapp.com" }, "timeZoneOffset": -480, "type": "checkin", "venue": { "beenHere": { "lastCheckinExpiredAt": 0 }, "categories": [ { "icon": { "prefix": "https://ss3.4sqi.net/img/categories_v2/shops/technology_", "suffix": ".png" }, "id": "4bf58dd8d48988d125941735", "name": "Tech Startup", "pluralName": "Tech Startups", "primary": true, "shortName": "Tech Startup" } ], "contact": { "twitter": "twitterseattle" }, "id": "5048f16fe4b06b5821990507", "location": { "address": "1501 4th Ave", "cc": "US", "city": "Seattle", "country": "United States", "crossStreet": "Pike St", "formattedAddress": [ "1501 4th Ave (Pike St)", "Seattle, WA 98101" ], "labeledLatLngs": [ { "label": "display", "lat": 47.60979112600535, "lng": -122.33793551960332 } ], "lat": 47.60979112600535, "lng": -122.33793551960332, "postalCode": "98101", "state": "WA" }, "name": "Twitter Seattle", "stats": { "checkinsCount": 562, "tipCount": 1, "usersCount": 217 }, "venuePage": { "id": "135106709" }, "venueRatingBlacklisted": true, "verified": true } } ] } } } ];



//                                                     // response.checkins.items[0].venue.categories[0].id
//
//
//
//
// //usage:
//
// console.log(placesToEat);
// // console.log(text[0].response.checkins.items[1].venue.name);
