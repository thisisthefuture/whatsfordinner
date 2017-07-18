const util = require('./index.js'),
      assert = require('assert'),
      // checkin list of 3 places in Seattle, 1 in San Francisco
      fakeCheckins = [{
            "count": 1,
            "details": {
                "source": {
                    "url": "https://www.swarmapp.com",
                    "name": "Swarm for iOS"
                },
                "comments": {
                    "count": 0
                },
                "posts": {
                    "textCount": 0,
                    "count": 0
                },
                "photos": {
                    "items": [],
                    "count": 0
                },
                "isMayor": false,
                "like": false,
                "likes": {
                    "groups": [],
                    "count": 0
                },
                "venue": {
                    "beenHere": {
                        "lastCheckinExpiredAt": 0
                    },
                    "allowMenuUrlEdit": true,
                    "url": "http://sugarhillseattle.com",
                    "stats": {
                        "tipCount": 1,
                        "usersCount": 126,
                        "checkinsCount": 188
                    },
                    "verified": false,
                    "categories": [{
                        "primary": true,
                        "icon": {
                            "suffix": ".png",
                            "prefix": "https://ss3.4sqi.net/img/categories_v2/nightlife/default_"
                        },
                        "shortName": "Lounge",
                        "pluralName": "Lounges",
                        "name": "Lounge",
                        "id": "4bf58dd8d48988d121941735"
                    }],
                    "location": {
                        "formattedAddress": ["414 E Pine St, Seattle", "Seattle, WA 98122"],
                        "country": "United States",
                        "state": "WA",
                        "city": "Seattle",
                        "cc": "US",
                        "postalCode": "98122",
                        "labeledLatLngs": [{
                            "lng": -122.326122,
                            "lat": 47.615312,
                            "label": "display"
                        }],
                        "lng": -122.326122,
                        "lat": 47.615312,
                        "address": "414 E Pine St, Seattle"
                    },
                    "contact": {
                        "formattedPhone": "(206) 568-2111",
                        "phone": "2065682111"
                    },
                    "name": "Sugar Hill",
                    "id": "585242cda913303f63f584be"
                },
                "timeZoneOffset": -420,
                "type": "checkin",
                "createdAt": 1493687151,
                "id": "5907db6fdb1d8108e42e64a4"
            }
        }, {
            "count": 1,
            "details": {
                "source": {
                    "url": "https://www.swarmapp.com",
                    "name": "Swarm for iOS"
                },
                "comments": {
                    "count": 0
                },
                "posts": {
                    "textCount": 0,
                    "count": 0
                },
                "photos": {
                    "items": [],
                    "count": 0
                },
                "isMayor": false,
                "like": false,
                "likes": {
                    "groups": [],
                    "count": 0
                },
                "venue": {
                    "beenHere": {
                        "lastCheckinExpiredAt": 0
                    },
                    "allowMenuUrlEdit": true,
                    "url": "http://t.co/HP1jMKlOZf",
                    "stats": {
                        "tipCount": 56,
                        "usersCount": 3628,
                        "checkinsCount": 11101
                    },
                    "verified": true,
                    "categories": [{
                        "primary": true,
                        "icon": {
                            "suffix": ".png",
                            "prefix": "https://ss3.4sqi.net/img/categories_v2/food/coffeeshop_"
                        },
                        "shortName": "Coffee Shop",
                        "pluralName": "Coffee Shops",
                        "name": "Coffee Shop",
                        "id": "4bf58dd8d48988d1e0931735"
                    }],
                    "location": {
                        "formattedAddress": ["616 E Pine St (at Boylston Ave)", "Seattle, WA 98122"],
                        "country": "United States",
                        "state": "WA",
                        "city": "Seattle",
                        "cc": "US",
                        "postalCode": "98122",
                        "labeledLatLngs": [{
                            "lng": -122.32376754283905,
                            "lat": 47.61535617644119,
                            "label": "display"
                        }],
                        "lng": -122.32376754283905,
                        "lat": 47.61535617644119,
                        "crossStreet": "at Boylston Ave",
                        "address": "616 E Pine St"
                    },
                    "contact": {
                        "twitter": "stumptowncoffee",
                        "formattedPhone": "(206) 329-0115",
                        "phone": "2063290115"
                    },
                    "name": "Stumptown Coffee Roasters",
                    "id": "472094c9f964a520c74b1fe3"
                },
                "timeZoneOffset": -420,
                "type": "checkin",
                "createdAt": 1493685769,
                "id": "5907d609fe37404d7c11c6ea"
            }
        }, {
            "count": 1,
            "details": {
                "source": {
                    "url": "https://www.swarmapp.com",
                    "name": "Swarm for iOS"
                },
                "comments": {
                    "count": 0
                },
                "posts": {
                    "textCount": 0,
                    "count": 0
                },
                "photos": {
                    "items": [],
                    "count": 0
                },
                "isMayor": false,
                "like": false,
                "likes": {
                    "groups": [],
                    "count": 0
                },
                "venue": {
                    "beenHere": {
                        "lastCheckinExpiredAt": 0
                    },
                    "allowMenuUrlEdit": true,
                    "menu": {
                        "mobileUrl": "https://foursquare.com/v/42966300f964a52051241fe3/device_menu",
                        "url": "https://foursquare.com/v/hot-mamas-pizza/42966300f964a52051241fe3/menu",
                        "anchor": "View Menu",
                        "label": "Menu",
                        "type": "Menu"
                    },
                    "hasMenu": true,
                    "url": "http://hot-mamaspizza.com",
                    "stats": {
                        "tipCount": 71,
                        "usersCount": 2947,
                        "checkinsCount": 7018
                    },
                    "verified": false,
                    "categories": [{
                        "primary": true,
                        "icon": {
                            "suffix": ".png",
                            "prefix": "https://ss3.4sqi.net/img/categories_v2/food/pizza_"
                        },
                        "shortName": "Pizza",
                        "pluralName": "Pizza Places",
                        "name": "Pizza Place",
                        "id": "4bf58dd8d48988d1ca941735"
                    }],
                    "location": {
                        "formattedAddress": ["700 E Pine St (at Boylston Ave)", "Seattle, WA 98122"],
                        "country": "United States",
                        "state": "WA",
                        "city": "Seattle",
                        "cc": "US",
                        "postalCode": "98122",
                        "labeledLatLngs": [{
                            "lng": -122.32322037220001,
                            "lat": 47.615347135995314,
                            "label": "display"
                        }],
                        "lng": -122.32322037220001,
                        "lat": 47.615347135995314,
                        "crossStreet": "at Boylston Ave",
                        "address": "700 E Pine St"
                    },
                    "contact": {
                        "formattedPhone": "(206) 322-6444",
                        "phone": "2063226444"
                    },
                    "name": "Hot Mama's Pizza",
                    "id": "42966300f964a52051241fe3"
                },
                "timeZoneOffset": -420,
                "type": "checkin",
                "createdAt": 1493685202,
                "id": "5907d3d23d47913c7b681b54"
            }
        }, {
            "count": 1,
            "details": {
                "source": {
                    "url": "https://www.swarmapp.com",
                    "name": "Swarm for iOS"
                },
                "comments": {
                    "count": 0
                },
                "posts": {
                    "textCount": 0,
                    "count": 0
                },
                "photos": {
                    "items": [],
                    "count": 0
                },
                "isMayor": false,
                "sticker": {
                    "unlockText": "You unlocked your first sticker! (We promise, they're not all hats.) Try to collect them all, and add them to your check-ins to unlock special rewards.",
                    "teaseText": "You never forget your first time.",
                    "pickerPosition": {
                        "index": 0,
                        "page": 0
                    },
                    "group": {
                        "index": 0,
                        "name": "collectible"
                    },
                    "stickerType": "unlockable",
                    "image": {
                        "name": "/partyhat_726832.png",
                        "sizes": [60, 94, 150, 300],
                        "prefix": "https://irs1.4sqi.net/img/sticker/"
                    },
                    "name": "Newbie",
                    "id": "543847324b909c2fb9aae4c0"
                },
                "like": false,
                "likes": {
                    "groups": [],
                    "count": 0
                },
                "venue": {
                    "beenHere": {
                        "lastCheckinExpiredAt": 0
                    },
                    "allowMenuUrlEdit": true,
                    "stats": {
                        "tipCount": 12,
                        "usersCount": 261,
                        "checkinsCount": 953
                    },
                    "verified": false,
                    "categories": [{
                        "primary": true,
                        "icon": {
                            "suffix": ".png",
                            "prefix": "https://ss3.4sqi.net/img/categories_v2/food/coffeeshop_"
                        },
                        "shortName": "Coffee Shop",
                        "pluralName": "Coffee Shops",
                        "name": "Coffee Shop",
                        "id": "4bf58dd8d48988d1e0931735"
                    }],
                    "location": {
                        "formattedAddress": ["1125 E Olive St (at 12th Ave)", "Seattle, WA 98122"],
                        "country": "United States",
                        "state": "WA",
                        "city": "San Francisco",
                        "cc": "US",
                        "postalCode": "98122",
                        "labeledLatLngs": [{
                            "lng": -122.31713923975587,
                            "lat": 47.616405014037454,
                            "label": "display"
                        }],
                        "lng": -122.31713923975587,
                        "lat": 47.616405014037454,
                        "crossStreet": "at 12th Ave",
                        "address": "1125 E Olive St"
                    },
                    "contact": {
                        "formattedPhone": "(206) 383-3295",
                        "phone": "2063833295"
                    },
                    "name": "Cafe Argento",
                    "id": "45754c3ef964a520983e1fe3"
                },
                "timeZoneOffset": -420,
                "type": "checkin",
                "createdAt": 1493317485,
                "id": "5902376dfc9e9422af051577"
            }
        }],
      eleWithoutURL = {
            "count": 2,
            "details": {
                "createdAt": 1493685202,
                "venue": {
                    "name": "Hot Mama\'s Pizza",
                    "location": {
                        "neighborhood": "Capitol Hill"
                    }
                }
            }
        }



const listOf2checkins = [{
            "count": 2,
            "details": {
                "createdAt": 1493685202,
                "venue": {
                    "name": "Hot Mama\'s Pizza",
                    "location": {
                    }
                }
            }
        },
        {
            "count": 2,
            "details": {
                "createdAt": 1493685202,
                "venue": {
                    "name": "Hot Mama\'s Pizza",
                    "location": {
                    }
                }
            }
        }]
        describe('Find place by city', () => {

    const emptyList = [];
    const sampleList = [{
        "response": {
            "checkins": {
                "count": 1511,
                "items": [{
                    "comments": {
                        "count": 0
                    },
                    "createdAt": 1485114975,
                    "id": "58850e5fac136931b3b66dac",
                    "venue": {
                        "categories": [{
                            "icon": {
                                "prefix": "https://ss3.4sqi.net/img/categories_v2/food/vietnamese_",
                                "suffix": ".png"
                            },
                            "id": "4bf58dd8d48988d14a941735",
                            "name": "Vietnamese Restaurant",
                            "pluralName": "Vietnamese Restaurants",
                            "primary": true,
                            "shortName": "Vietnamese"
                        }],
                        "id": "4391a4d9f964a5205e2b1fe3",
                        "location": {
                            "address": "615 19th Ave E",
                            "cc": "US",
                            "city": "Seattle",
                            "country": "United States",
                            "crossStreet": "at E Mercer St",
                            "formattedAddress": ["615 19th Ave E (at E Mercer St)", "Seattle, WA 98112"],
                            "labeledLatLngs": [{
                                "label": "display",
                                "lat": 47.62479716487741,
                                "lng": -122.30756968259811
                            }],
                            "lat": 47.62479716487741,
                            "lng": -122.30756968259811,
                            "postalCode": "98112",
                            "state": "WA"
                        },
                        "name": "Monsoon",
                        "url": "http://www.monsoonseattle.com",
                        "verified": false
                    }
                }, {
                    "comments": {
                        "count": 0
                    },
                    "createdAt": 1485063103,
                    "id": "588443bf2bc5e272f3f8ab3a",
                    "venue": {
                        "categories": [{
                            "icon": {
                                "prefix": "https://ss3.4sqi.net/img/categories_v2/nightlife/pub_",
                                "suffix": ".png"
                            },
                            "id": "4bf58dd8d48988d116941735",
                            "name": "Bar",
                            "pluralName": "Bars",
                            "primary": true,
                            "shortName": "Bar"
                        }],
                        "location": {
                            "address": "719 E Pike St",
                            "cc": "US",
                            "city": "Seattle",
                            "country": "United States",
                            "crossStreet": "at Harvard Ave.",
                            "formattedAddress": ["719 E Pike St (at Harvard Ave.)", "Seattle, WA 98122"],
                            "labeledLatLngs": [{
                                "label": "display",
                                "lat": 47.61405165530944,
                                "lng": -122.32260390442656
                            }],
                            "lat": 47.61405165530944,
                            "lng": -122.32260390442656,
                            "postalCode": "98122",
                            "state": "WA"
                        },
                        "name": "Saint John's Bar & Eatery",
                        "url": "http://saintjohnsseattle.com",
                    }
                }, {
                    "comments": {
                        "count": 0
                    },
                    "createdAt": 1485038417,
                    "venue": {
                        "categories": [{
                            "icon": {
                                "prefix": "https://ss3.4sqi.net/img/categories_v2/food/asian_",
                                "suffix": ".png"
                            },
                            "id": "4bf58dd8d48988d142941735",
                            "name": "Asian Restaurant",
                            "pluralName": "Asian Restaurants",
                            "primary": true,
                            "shortName": "Asian"
                        }],
                        "id": "54c150cf498edf6cf23c4a71",
                        "location": {
                            "address": "1631 E Olive Way",
                            "cc": "US",
                            "city": "Seattle",
                            "country": "United States",
                            "crossStreet": "Belmont Ave E",
                            "formattedAddress": ["1631 E Olive Way (Belmont Ave E)", "Seattle, WA 98102"],
                            "labeledLatLngs": [{
                                "label": "display",
                                "lat": 47.619344208146615,
                                "lng": -122.32453139729026
                            }],
                            "lat": 47.619344208146615,
                            "lng": -122.32453139729026,
                            "postalCode": "98102",
                            "state": "WA"
                        },
                        "name": "BlueStone",
                        "stats": {
                            "checkinsCount": 500,
                            "tipCount": 8,
                            "usersCount": 288
                        },
                        "verified": false
                    }
                }, {
                    "comments": {
                        "count": 0
                    },
                    "createdAt": 1484878945,
                    "id": "58817461040d537fb5bb7f5b",
                    "timeZoneOffset": -480,
                    "type": "checkin",
                    "venue": {
                        "categories": [{
                            "icon": {
                                "prefix": "https://ss3.4sqi.net/img/categories_v2/shops/technology_",
                                "suffix": ".png"
                            },
                            "id": "4bf58dd8d48988d125941735",
                            "name": "Tech Startup",
                            "pluralName": "Tech Startups",
                            "primary": true,
                            "shortName": "Tech Startup"
                        }],
                        "id": "5048f16fe4b06b5821990507",
                        "location": {
                            "address": "1501 4th Ave",
                            "cc": "US",
                            "city": "Seattle",
                            "country": "United States",
                            "crossStreet": "Pike St",
                            "formattedAddress": ["1501 4th Ave (Pike St)", "Seattle, WA 98101"],
                            "labeledLatLngs": [{
                                "label": "display",
                                "lat": 47.60979112600535,
                                "lng": -122.33793551960332
                            }],
                            "lat": 47.60979112600535,
                            "lng": -122.33793551960332,
                            "postalCode": "98101",
                            "state": "WA"
                        },
                        "name": "Twitter Seattle"                    }
                }]
            }
        }
    }]

    it('Finds no results', () => {
        let results = util.findPlaceByCity([], '')
        assert.equal(results.length, 0)
    })


    it('Finds results > 0', () => {
        // checkin list of 4 places in Seattle
        let fakeCheckins = [{
            "count": 1,
            "details": {
                "source": {
                    "url": "https://www.swarmapp.com",
                    "name": "Swarm for iOS"
                },
                "comments": {
                    "count": 0
                },
                "posts": {
                    "textCount": 0,
                    "count": 0
                },
                "photos": {
                    "items": [],
                    "count": 0
                },
                "isMayor": false,
                "like": false,
                "likes": {
                    "groups": [],
                    "count": 0
                },
                "venue": {
                    "beenHere": {
                        "lastCheckinExpiredAt": 0
                    },
                    "allowMenuUrlEdit": true,
                    "url": "http://sugarhillseattle.com",
                    "stats": {
                        "tipCount": 1,
                        "usersCount": 126,
                        "checkinsCount": 188
                    },
                    "verified": false,
                    "categories": [{
                        "primary": true,
                        "icon": {
                            "suffix": ".png",
                            "prefix": "https://ss3.4sqi.net/img/categories_v2/nightlife/default_"
                        },
                        "shortName": "Lounge",
                        "pluralName": "Lounges",
                        "name": "Lounge",
                        "id": "4bf58dd8d48988d121941735"
                    }],
                    "location": {
                        "formattedAddress": ["414 E Pine St, Seattle", "Seattle, WA 98122"],
                        "country": "United States",
                        "state": "WA",
                        "city": "Seattle",
                        "cc": "US",
                        "postalCode": "98122",
                        "labeledLatLngs": [{
                            "lng": -122.326122,
                            "lat": 47.615312,
                            "label": "display"
                        }],
                        "lng": -122.326122,
                        "lat": 47.615312,
                        "address": "414 E Pine St, Seattle"
                    },
                    "contact": {
                        "formattedPhone": "(206) 568-2111",
                        "phone": "2065682111"
                    },
                    "name": "Sugar Hill",
                    "id": "585242cda913303f63f584be"
                },
                "timeZoneOffset": -420,
                "type": "checkin",
                "createdAt": 1493687151,
                "id": "5907db6fdb1d8108e42e64a4"
            }
        }, {
            "count": 1,
            "details": {
                "source": {
                    "url": "https://www.swarmapp.com",
                    "name": "Swarm for iOS"
                },
                "comments": {
                    "count": 0
                },
                "posts": {
                    "textCount": 0,
                    "count": 0
                },
                "photos": {
                    "items": [],
                    "count": 0
                },
                "isMayor": false,
                "like": false,
                "likes": {
                    "groups": [],
                    "count": 0
                },
                "venue": {
                    "beenHere": {
                        "lastCheckinExpiredAt": 0
                    },
                    "allowMenuUrlEdit": true,
                    "url": "http://t.co/HP1jMKlOZf",
                    "stats": {
                        "tipCount": 56,
                        "usersCount": 3628,
                        "checkinsCount": 11101
                    },
                    "verified": true,
                    "categories": [{
                        "primary": true,
                        "icon": {
                            "suffix": ".png",
                            "prefix": "https://ss3.4sqi.net/img/categories_v2/food/coffeeshop_"
                        },
                        "shortName": "Coffee Shop",
                        "pluralName": "Coffee Shops",
                        "name": "Coffee Shop",
                        "id": "4bf58dd8d48988d1e0931735"
                    }],
                    "location": {
                        "formattedAddress": ["616 E Pine St (at Boylston Ave)", "Seattle, WA 98122"],
                        "country": "United States",
                        "state": "WA",
                        "city": "Seattle",
                        "cc": "US",
                        "postalCode": "98122",
                        "labeledLatLngs": [{
                            "lng": -122.32376754283905,
                            "lat": 47.61535617644119,
                            "label": "display"
                        }],
                        "lng": -122.32376754283905,
                        "lat": 47.61535617644119,
                        "crossStreet": "at Boylston Ave",
                        "address": "616 E Pine St"
                    },
                    "contact": {
                        "twitter": "stumptowncoffee",
                        "formattedPhone": "(206) 329-0115",
                        "phone": "2063290115"
                    },
                    "name": "Stumptown Coffee Roasters",
                    "id": "472094c9f964a520c74b1fe3"
                },
                "timeZoneOffset": -420,
                "type": "checkin",
                "createdAt": 1493685769,
                "id": "5907d609fe37404d7c11c6ea"
            }
        }, {
            "count": 1,
            "details": {
                "source": {
                    "url": "https://www.swarmapp.com",
                    "name": "Swarm for iOS"
                },
                "comments": {
                    "count": 0
                },
                "posts": {
                    "textCount": 0,
                    "count": 0
                },
                "photos": {
                    "items": [],
                    "count": 0
                },
                "isMayor": false,
                "like": false,
                "likes": {
                    "groups": [],
                    "count": 0
                },
                "venue": {
                    "beenHere": {
                        "lastCheckinExpiredAt": 0
                    },
                    "allowMenuUrlEdit": true,
                    "menu": {
                        "mobileUrl": "https://foursquare.com/v/42966300f964a52051241fe3/device_menu",
                        "url": "https://foursquare.com/v/hot-mamas-pizza/42966300f964a52051241fe3/menu",
                        "anchor": "View Menu",
                        "label": "Menu",
                        "type": "Menu"
                    },
                    "hasMenu": true,
                    "url": "http://hot-mamaspizza.com",
                    "stats": {
                        "tipCount": 71,
                        "usersCount": 2947,
                        "checkinsCount": 7018
                    },
                    "verified": false,
                    "categories": [{
                        "primary": true,
                        "icon": {
                            "suffix": ".png",
                            "prefix": "https://ss3.4sqi.net/img/categories_v2/food/pizza_"
                        },
                        "shortName": "Pizza",
                        "pluralName": "Pizza Places",
                        "name": "Pizza Place",
                        "id": "4bf58dd8d48988d1ca941735"
                    }],
                    "location": {
                        "formattedAddress": ["700 E Pine St (at Boylston Ave)", "Seattle, WA 98122"],
                        "country": "United States",
                        "state": "WA",
                        "city": "Seattle",
                        "cc": "US",
                        "postalCode": "98122",
                        "labeledLatLngs": [{
                            "lng": -122.32322037220001,
                            "lat": 47.615347135995314,
                            "label": "display"
                        }],
                        "lng": -122.32322037220001,
                        "lat": 47.615347135995314,
                        "crossStreet": "at Boylston Ave",
                        "address": "700 E Pine St"
                    },
                    "contact": {
                        "formattedPhone": "(206) 322-6444",
                        "phone": "2063226444"
                    },
                    "name": "Hot Mama's Pizza",
                    "id": "42966300f964a52051241fe3"
                },
                "timeZoneOffset": -420,
                "type": "checkin",
                "createdAt": 1493685202,
                "id": "5907d3d23d47913c7b681b54"
            }
        }, {
            "count": 1,
            "details": {
                "source": {
                    "url": "https://www.swarmapp.com",
                    "name": "Swarm for iOS"
                },
                "comments": {
                    "count": 0
                },
                "posts": {
                    "textCount": 0,
                    "count": 0
                },
                "photos": {
                    "items": [],
                    "count": 0
                },
                "isMayor": false,
                "sticker": {
                    "unlockText": "You unlocked your first sticker! (We promise, they're not all hats.) Try to collect them all, and add them to your check-ins to unlock special rewards.",
                    "teaseText": "You never forget your first time.",
                    "pickerPosition": {
                        "index": 0,
                        "page": 0
                    },
                    "group": {
                        "index": 0,
                        "name": "collectible"
                    },
                    "stickerType": "unlockable",
                    "image": {
                        "name": "/partyhat_726832.png",
                        "sizes": [60, 94, 150, 300],
                        "prefix": "https://irs1.4sqi.net/img/sticker/"
                    },
                    "name": "Newbie",
                    "id": "543847324b909c2fb9aae4c0"
                },
                "like": false,
                "likes": {
                    "groups": [],
                    "count": 0
                },
                "venue": {
                    "beenHere": {
                        "lastCheckinExpiredAt": 0
                    },
                    "allowMenuUrlEdit": true,
                    "stats": {
                        "tipCount": 12,
                        "usersCount": 261,
                        "checkinsCount": 953
                    },
                    "verified": false,
                    "categories": [{
                        "primary": true,
                        "icon": {
                            "suffix": ".png",
                            "prefix": "https://ss3.4sqi.net/img/categories_v2/food/coffeeshop_"
                        },
                        "shortName": "Coffee Shop",
                        "pluralName": "Coffee Shops",
                        "name": "Coffee Shop",
                        "id": "4bf58dd8d48988d1e0931735"
                    }],
                    "location": {
                        "formattedAddress": ["1125 E Olive St (at 12th Ave)", "Seattle, WA 98122"],
                        "country": "United States",
                        "state": "WA",
                        "city": "Seattle",
                        "cc": "US",
                        "postalCode": "98122",
                        "labeledLatLngs": [{
                            "lng": -122.31713923975587,
                            "lat": 47.616405014037454,
                            "label": "display"
                        }],
                        "lng": -122.31713923975587,
                        "lat": 47.616405014037454,
                        "crossStreet": "at 12th Ave",
                        "address": "1125 E Olive St"
                    },
                    "contact": {
                        "formattedPhone": "(206) 383-3295",
                        "phone": "2063833295"
                    },
                    "name": "Cafe Argento",
                    "id": "45754c3ef964a520983e1fe3"
                },
                "timeZoneOffset": -420,
                "type": "checkin",
                "createdAt": 1493317485,
                "id": "5902376dfc9e9422af051577"
            }
        }]
        let results = util.findPlaceByCity(fakeCheckins, 'Seattle')
        assert.equal(results.length, 4)
    })

    it('Finds length = 1', () => {
        let results = util.findPlaceByCity(fakeCheckins, 'San Francisco')
        assert.equal(results.length, 1)
    })
})

describe('Printing details', () => {

    it('Prints details with a link', () => {
        let eleWithURL = {
            "details": {
                "venue": {
                    "url": "http://sugarhillseattle.com",
                    "name": "Sugar Hill",
                    "location": {  
                    }
                }
            },
            "count": 1
        }

        let results = util.printDetails(eleWithURL, false).display
        let expectedResult = '<a href=\"http://sugarhillseattle.com\">Sugar Hill</a>. Visited @ least once<br />'
        assert.equal(results, expectedResult)
    })

    it('Prints details without a link', () => {
        let eleWithoutURL = {
            "details": {
                "venue": {
                    "name": "Sugar Hill",
                    "location": {  
                    }
                }
            },
            "count": 2
        }

        let results = util.printDetails(eleWithoutURL, false).display
        let expectedResult = 'Sugar Hill. Visited @ least 2 times<br />'
        assert.equal(results, expectedResult)
    })

    it('Prints details with neighbourhood', () => {
        let results = util.printDetails(eleWithoutURL, false).display
        let expectedResult = 'Hot Mama\'s Pizza in Capitol Hill. Visited @ least 2 times<br />'
        assert.equal(results, expectedResult)
    })

    it('Prints details with last known visit', () => {
        let results = util.printDetails(eleWithoutURL, true).display
        let expectedResult = 'Hot Mama\'s Pizza in Capitol Hill.<br />Last known visit on May 1, 2017<br />'
        assert.equal(results, expectedResult)
    })

})

describe('Print list of details', () => {
    it('List of 1 item', () => {
        let results = util.printArrayOfPlaces([eleWithoutURL])
        let expected = 'Hot Mama\'s Pizza in Capitol Hill. Visited @ least 2 times<br />'
        assert.equal(results, expected)
    })

    it('List of 2 items', () => {
        let results = util.printArrayOfPlaces(listOf2checkins)
        let expected = 'Hot Mama\'s Pizza. Visited @ least 2 times<br />Hot Mama\'s Pizza. Visited @ least 2 times<br />'
        assert.equal(results, expected)        
    })
})

describe('Print recent', () => {
    it('Empty list', () => {
        let results = util.printRecent([])
        let expected = '...sorry, I don\'t know where you\'ve been.'
        assert.equal(results, expected)
    })
})

describe('Get cities list', () => {
    it('No cities', () => {
        let results = util.getCitiesList([])
        let expected = 'Whoops, no cities for some reason...';
        assert.equal(results, expected)
    })

    it('Have cities', () => {
        const placesList = ['Seattle', 'San Francisco']
        let results = util.getCitiesList(placesList)
        let expected = '<a href=\"/city/Seattle\">Seattle</a>  <a href=\"/city/San Francisco\">San Francisco</a>  '
        // assert.equal(results, expected)
        assert.equal(results, expected)
    })
})

describe('Getting a suggestion', () => {
    it('No places to pick from', () => {
        let results = util.getSuggestion([])
        let expected = '...sorry, I don\'t know where you\'ve been.'
        assert.equal(results, expected)
    })

    it('Places to pick from', () => {

    })
})