#!/usr/bin/python
# -*- coding: utf-8 -*-

headers = {
    'languages': ("Arabic", "Chinese", "Creole", "English", "French", "German", "Hindi", "Hmong", "Italian", "Japanese", "Korean", "Portuguese", "Russian", "Spanish"),
    #'associations': ("CENYC", "NYRP", "NYCHA", "Green Guerillas", "GreenThumb", "Trust for Public Land", "Brooklyn GreenBridge", "Just Food", "Bronx Green Up", "More Gardens", "Community Garden Coalition"),
    'fruits': ("Hardy Kiwi", "Grape", "Currant", "Elderberry", "Blackberry", "Gooseberry", "Strawberry", "Blueberry", "Rhubarb", "Watermelon", "Raspberry", "Bitter Melon", "Honeydew", "Cantaloupe"),
    'vegetables': ("Tomato", "Onion", "Radish", "Summer Squash", "Winter Squash", "Cucumber", "Broccoli", "Beet", "Sweet Peppers", "Cayenne", "Turnip", "Pumpkin", "Carrot", "Garlic", "Parsnip", "Potato", "Artichoke", "Asparagus", "Cabbage", "Brussell Sprouts", "Cauliflower", "Celery", "Beans", "Eggplant", "Peas", "Scallion", "Corn", "Jalapeño", "Habañero",),
    'trees': ("Peach", "Cherry", "Apple", "Apricot", "Nectarine", "Mulberry", "Plum", "Fig", "Pear", "Crabapple"),
    'greens': ("Amaranth", "Arugula", "Bok Choy", "Chard", "Collard", "Endive", "Kale", "Lamb's Quarters", "Lettuce", "Mache", "Spinach", "Mesclun"),
    'herbs': ("Basil", "Chamomile", "Chive", "Comfrey", "Cilantro", "Dill", "Echinacea", "Epazote", "Fennel", "Horseradish", "Lavender", "Lemongrass", "Lleva buena", "Marjoram", "Mint", "Oregano", "Parsley", "Sage", "Thyme"),
    'events': ("Workshops", "Arts & Crafts", "Movies", "Picnics", "Performance", "Educational Events", "Barbecues", "Concerts", "Sports", "Religious Activities", "Private Events", "Farmers' Markets"),
    'water features': ("Pond", "Water Pump", "Fish", "Other Aquatic Life"),
    'private events': ("CanRent", "Members only (no non-members can rent garden)", "Members and non-members can rent", "Reservation only", "Reservation & rental fee", "InformalRent"),
    'fences': ("No fence", "Chain Link", "Iron", "WoodWire"),
    'schools': ("PartnersWSchool", "School garden/plot", "School Educational events", "School Regular visits by classes", "In-school workshops", "School Nothing yet, but we would like to"),
    'community groups': ("PartnersWCommGrp", "Comm Garden workshops", "Comm Off-site workshops", "Comm Educational events", "Comm Nothing yet, but we would like to"),
    'volunteers': ("HostsVolunteers",),
    'structures': ("Toolshed", "Greenhouse or Hoop House", "Chicken Coop", "Seating Area", "Gazebo/Casita", "Educational Signs", "Raised Beds", "Rainwater Catchment System", "Pathways", "Grill", "Playground", "Table(s)"),
    'art': ('Mural', 'Sculpture(s)'),
    'compost': ('CurrentCompost', 'PastCompost', 'FutureCompost'),
    'who composts': ("CompostGardenMembersOnly", "CompostGardenMembers & neighborhood residents", "CompostPublic"),
    # not surveyed
    # DEP, DCAS, DHS, NYCHA, FED
    'ownership': ("NYC Dept. of Parks & Recreation", "TPL", "NYRP", "HRA", "MTA", "Church", "Private", "Dept. of Education", "DOT", "HPD", "State"),
    'perceived edibility': ("0-25%", "26-50%", "51-75%", "76-100%"),
    'food use': ("Used by growers", "Donated", "Sold", "Sold at a Market"),
    'inedibles': ("Shade Trees", "Ornamental Plantings and Flowers", "Botanical Garden", "Shrubs", "Native Plant Garden", "Water Garden"),
    'previous use': ("Abandoned Building", "Park", "Vacant Lot", "Yard", "Unknown"),
    'open hours': ("Open_Hours",),
}

list_columns = {
    'languages': 'Languages_Spoken', 
    'perceived edibility': 'PercentEdible',
    'ownership': 'Land Jurisdiction',
    'previous use': 'BeforeTheGarden',
    'fences': 'Fence',
}

#yes_columns = ('CurrentCompost', 'PastCompost', 'FutureCompost', 'PartnersWCommGrp', 'CanRent', 'PartnersWSchool', 'HostsVolunteers')
yes_columns = ('CurrentCompost', 'PartnersWCommGrp', 'CanRent', 'PartnersWSchool', 'HostsVolunteers')
