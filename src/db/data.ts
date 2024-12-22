export const products : Array<{
  id: number,
  name: string,
  category: number,
  variants: Array<{
    id: number,
    name: string,
    price?: number | string
  }>
}> =  [
  {
    "id": 1,
    "name": "HOT & SOUR SOUP",
    "category": 1,
    "variants": [
      {
        "id": 1,
        "name": "VEG",
        "price": 60
      },
      {
        "id": 2,
        "name": "CHICKEN",
        "price": 80
      }
    ]
  },
  {
    "id": 2,
    "name": "MAN CHOW SOUP",
    "category": 1,
    "variants": [
      {
        "id": 1,
        "name": "VEG",
        "price": 60
      },
      {
        "id": 2,
        "name": "CHICKEN",
        "price": 100
      }
    ]
  },
  {
    "id": 3,
    "name": "PUSHPA SPECIAL CORIANDER SOUP",
    "category": 1,
    "variants": [
      {
        "id": 1,
        "name": "VEG",
        "price": 80
      },
      {
        "id": 2,
        "name": "CHICKEN",
        "price": 120
      }
    ]
  },
  {
    "id": 4,
    "name": "FRIED RICE",
    "category": 2,
    "variants": [
      {
        "id": 1,
        "name": "VEG",
        "price": 100
      },
      {
        "id": 2,
        "name": "CHICKEN",
        "price": 130
      },
      {
        "id": 3,
        "name": "EGG",
        "price": 120
      },
      {
        "id": 4,
        "name": "MIX",
        "price": 150
      }
    ]
  },
  {
    "id": 5,
    "name": "HAKKA NOODLES",
    "category": 2,
    "variants": [
      {
        "id": 1,
        "name": "VEG",
        "price": 100
      },
      {
        "id": 2,
        "name": "CHICKEN",
        "price": 130
      },
      {
        "id": 3,
        "name": "EGG",
        "price": 120
      },
      {
        "id": 4,
        "name": "MIX",
        "price": 150
      }
    ]
  },
  {
    "id": 6,
    "name": "GRAVY NOODLES",
    "category": 2,
    "variants": [
      {
        "id": 1,
        "name": "VEG",
        "price": 110
      },
      {
        "id": 2,
        "name": "CHICKEN",
        "price": 140
      },
      {
        "id": 3,
        "name": "MIX",
        "price": 150
      }
    ]
  },
  {
    "id": 7,
    "name": "AL-FAHAM CHICKEN RICE",
    "category": 2,
    "variants": [
      {
        "id": 1,
        "name": "HALF",
        "price": 250
      },
      {
        "id": 2,
        "name": "FULL",
        "price": 450
      }
    ]
  },
  {
    "id": 8,
    "name": "FRENCH FRIES",
    "category": 3,
    "variants": [
      {
        "id": 1,
        "name": "DEFAULT",
        "price": 60
      }
    ]
  },
  {
    "id": 9,
    "name": "VEG MANCHURIAN",
    "category": 3,
    "variants": [
      {
        "id": 1,
        "name": "DEFAULT",
        "price": 99
      }
    ]
  },
  {
    "id": 10,
    "name": "PANEER CHILLI",
    "category": 3,
    "variants": [
      {
        "id": 1,
        "name": "DEFAULT",
        "price": 160
      }
    ]
  },
  {
    "id": 11,
    "name": "CRISHPY CHILLI MASHROOM",
    "category": 3,
    "variants": [
      {
        "id": 1,
        "name": "DEFAULT",
        "price": 190
      }
    ]
  },
  {
    "id": 12,
    "name": "CRISHPY CHILL BABY CORN",
    "category": 3,
    "variants": [
      {
        "id": 1,
        "name": "DEFAULT",
        "price": 190
      }
    ]
  },
  {
    "id": 13,
    "name": "CHICKEN CHILLI",
    "category": 3,
    "variants": [
      {
        "id": 1,
        "name": "DEFAULT",
        "price": 160
      }
    ]
  },
  {
    "id": 14,
    "name": "PRAWN CHILLI ",
    "category": 3,
    "variants": [
      {
        "id": 1,
        "name": "DEFAULT",
        "price": 300
      }
    ]
  },
  {
    "id": 15,
    "name": "FISH CHILLI",
    "category": 3,
    "variants": [
      {
        "id": 1,
        "name": "DEFAULT",
        "price": 220
      }
    ]
  },
  {
    "id": 16,
    "name": "CHICKEN MANCHURIAN",
    "category": 3,
    "variants": [
      {
        "id": 1,
        "name": "DEFAULT",
        "price": 170
      }
    ]
  },
  {
    "id": 17,
    "name": "CRISHPY CHICKEN",
    "category": 3,
    "variants": [
      {
        "id": 1,
        "name": "DEFAULT",
        "price": 160
      }
    ]
  },
  {
    "id": 18,
    "name": "CHICKEN LOLLIPOP",
    "category": 3,
    "variants": [
      {
        "id": 1,
        "name": "DEFAULT",
        "price": 180
      }
    ]
  },
  {
    "id": 19,
    "name": "CHICKEN 65",
    "category": 3,
    "variants": [
      {
        "id": 1,
        "name": "DEFAULT",
        "price": 170
      }
    ]
  },
  {
    "id": 20,
    "name": "VEG PAKODA",
    "category": 3,
    "variants": [
      {
        "id": 1,
        "name": "DEFAULT",
        "price": 100
      }
    ]
  },
  {
    "id": 21,
    "name": "DRUMS OF HEAVEN",
    "category": 3,
    "variants": [
      {
        "id": 1,
        "name": "DEFAULT",
        "price": 190
      }
    ]
  },
  {
    "id": 22,
    "name": "DRAGON CHICKEN",
    "category": 3,
    "variants": [
      {
        "id": 1,
        "name": "DEFAULT",
        "price": 180
      }
    ]
  },
  {
    "id": 23,
    "name": "CHICKEN PAKODA",
    "category": 3,
    "variants": [
      {
        "id": 1,
        "name": "DEFAULT",
        "price": 160
      }
    ]
  },
  {
    "id": 24,
    "name": "H CHILLI PAKODA",
    "category": 3,
    "variants": [
      {
        "id": 1,
        "name": "DEFAULT",
        "price": 150
      }
    ]
  },
  {
    "id": 25,
    "name": "PANEER TIKKA",
    "category": 4,
    "variants": [
      {
        "id": 1,
        "name": "DEFAULT",
        "price": 160
      }
    ]
  },
  {
    "id": 26,
    "name": "PANEER PAHAR TIKKA",
    "category": 4,
    "variants": [
      {
        "id": 1,
        "name": "DEFAULT",
        "price": 180
      }
    ]
  },
  {
    "id": 27,
    "name": "CHICKEN MALAI TIKKA",
    "category": 4,
    "variants": [
      {
        "id": 1,
        "name": "DEFAULT",
        "price": 190
      }
    ]
  },
  {
    "id": 28,
    "name": "BANJARA KABAB",
    "category": 4,
    "variants": [
      {
        "id": 1,
        "name": "DEFAULT",
        "price": 180
      }
    ]
  },
  {
    "id": 29,
    "name": "CHICKEN TIKKA",
    "category": 4,
    "variants": [
      {
        "id": 1,
        "name": "DEFAULT",
        "price": 170
      }
    ]
  },
  {
    "id": 30,
    "name": "TANDOORI CHICKEN",
    "category": 4,
    "variants": [
      {
        "id": 1,
        "name": "HALF",
        "price": 250
      },
      {
        "id": 2,
        "name": "FULL",
        "price": 450
      }
    ]
  },
  {
    "id": 31,
    "name": "TANDOORI KOYEL",
    "category": 4,
    "variants": [
      {
        "id": 1,
        "name": "DEFAULT"
      }
    ]
  },
  {
    "id": 32,
    "name": "FISH TIKKA",
    "category": 4,
    "variants": [
      {
        "id": 1,
        "name": "DEFAULT",
        "price": 220
      }
    ]
  },
  {
    "id": 33,
    "name": "TENGRI KABAB",
    "category": 4,
    "variants": [
      {
        "id": 1,
        "name": "DEFAULT",
        "price": 160
      }
    ]
  },
  {
    "id": 34,
    "name": "MURG KASTURI KABAB",
    "category": 4,
    "variants": [
      {
        "id": 1,
        "name": "DEFAULT",
        "price": 170
      }
    ]
  },
  {
    "id": 35,
    "name": "DAL TADKA",
    "category": 5,
    "variants": [
      {
        "id": 1,
        "name": "DEFAULT",
        "price": 70
      }
    ]
  },
  {
    "id": 36,
    "name": "DAL FRY",
    "category": 5,
    "variants": [
      {
        "id": 1,
        "name": "DEFAULT",
        "price": 70
      }
    ]
  },
  {
    "id": 37,
    "name": "DAL MAKHANI",
    "category": 5,
    "variants": [
      {
        "id": 1,
        "name": "DEFAULT",
        "price": 70
      }
    ]
  },
  {
    "id": 38,
    "name": "PANEER BUTTER MASALA",
    "category": 5,
    "variants": [
      {
        "id": 1,
        "name": "DEFAULT",
        "price": 170
      }
    ]
  },
  {
    "id": 39,
    "name": "PALAK PANEER",
    "category": 5,
    "variants": [
      {
        "id": 1,
        "name": "DEFAULT",
        "price": 170
      }
    ]
  },
  {
    "id": 40,
    "name": "MASHROOM MASALA",
    "category": 5,
    "variants": [
      {
        "id": 1,
        "name": "DEFAULT",
        "price": 190
      }
    ]
  },
  {
    "id": 41,
    "name": "KADAI PANEER",
    "category": 5,
    "variants": [
      {
        "id": 1,
        "name": "HALF",
        "price": 90
      },
      {
        "id": 2,
        "name": "FULL",
        "price": 180
      }
    ]
  },
  {
    "id": 42,
    "name": "CHICKEN BUTTER MASALA",
    "category": 5,
    "variants": [
      {
        "id": 1,
        "name": "HALF",
        "price": 100
      },
      {
        "id": 2,
        "name": "FULL",
        "price": 200
      }
    ]
  },
  {
    "id": 43,
    "name": "MUTTON KOSHA",
    "category": 5,
    "variants": [
      {
        "id": 1,
        "name": "DEFAULT",
        "price": 340
      }
    ]
  },
  {
    "id": 44,
    "name": "MUTTON CURRY",
    "category": 5,
    "variants": [
      {
        "id": 1,
        "name": "DEFAULT",
        "price": 330
      }
    ]
  },
  {
    "id": 45,
    "name": "MUTTON HADI",
    "category": 5,
    "variants": [
      {
        "id": 1,
        "name": "DEFAULT",
        "price": 340
      }
    ]
  },
  {
    "id": 46,
    "name": "CHICKEN BHARTA",
    "category": 5,
    "variants": [
      {
        "id": 1,
        "name": "DEFAULT",
        "price": 220
      }
    ]
  },
  {
    "id": 47,
    "name": "CHICKEN CURRY",
    "category": 5,
    "variants": [
      {
        "id": 1,
        "name": "DEFAULT",
        "price": 220
      }
    ]
  },
  {
    "id": 48,
    "name": "CHICKEN KOSHA",
    "category": 5,
    "variants": [
      {
        "id": 1,
        "name": "DEFAULT",
        "price": 220
      }
    ]
  },
  {
    "id": 49,
    "name": "KOYEL MASALA",
    "category": 5,
    "variants": [
      {
        "id": 1,
        "name": "DEFAULT"
      }
    ]
  },
  {
    "id": 50,
    "name": "MIX VEG",
    "category": 6,
    "variants": [
      {
        "id": 1,
        "name": "DEFAULT",
        "price": 140
      }
    ]
  },
  {
    "id": 51,
    "name": "VEG JAIPURI",
    "category": 6,
    "variants": [
      {
        "id": 1,
        "name": "DEFAULT",
        "price": 150
      }
    ]
  },
  {
    "id": 52,
    "name": "VEGETABLE KOFTA",
    "category": 7,
    "variants": [
      {
        "id": 1,
        "name": "DEFAULT",
        "price": 150
      }
    ]
  },
  {
    "id": 53,
    "name": "MALAI KOFTA",
    "category": 7,
    "variants": [
      {
        "id": 1,
        "name": "DEFAULT",
        "price": 190
      }
    ]
  },
  {
    "id": 54,
    "name": "CHICKEN BIRIYANI",
    "category": 8,
    "variants": [
      {
        "id": 1,
        "name": "DEFAULT",
        "price": 150
      }
    ]
  },
  {
    "id": 55,
    "name": "MUTTON BIRYANI",
    "category": 8,
    "variants": [
      {
        "id": 1,
        "name": "DEFAULT",
        "price": 180
      }
    ]
  },
  {
    "id": 56,
    "name": "VEG BIRYANI",
    "category": 8,
    "variants": [
      {
        "id": 1,
        "name": "DEFAULT",
        "price": 120
      }
    ]
  },
  {
    "id": 57,
    "name": "PEAS PULAO",
    "category": 9,
    "variants": [
      {
        "id": 1,
        "name": "DEFAULT",
        "price": 120
      }
    ]
  },
  {
    "id": 58,
    "name": "VEG PULAO",
    "category": 9,
    "variants": [
      {
        "id": 1,
        "name": "DEFAULT",
        "price": 120
      }
    ]
  },
  {
    "id": 59,
    "name": "KASHMIRI PULAO",
    "category": 9,
    "variants": [
      {
        "id": 1,
        "name": "DEFAULT",
        "price": 150
      }
    ]
  },
  {
    "id": 60,
    "name": "STEAM RICE",
    "category": 9,
    "variants": [
      {
        "id": 1,
        "name": "DEFAULT",
        "price": 40
      }
    ]
  },
  {
    "id": 61,
    "name": "JEERA RICE",
    "category": 9,
    "variants": [
      {
        "id": 1,
        "name": "DEFAULT",
        "price": 50
      }
    ]
  },
  {
    "id": 62,
    "name": "TANDOORI PLAIN ROTI",
    "category": 10,
    "variants": [
      {
        "id": 1,
        "name": "DEFAULT",
        "price": 30
      }
    ]
  },
  {
    "id": 63,
    "name": "TANDOORI BUTTER ROTI",
    "category": 10,
    "variants": [
      {
        "id": 1,
        "name": "DEFAULT",
        "price": 35
      }
    ]
  },
  {
    "id": 64,
    "name": "TANDOORI PLAIN NAAN",
    "category": 10,
    "variants": [
      {
        "id": 1,
        "name": "DEFAULT",
        "price": 40
      }
    ]
  },
  {
    "id": 65,
    "name": "TANDOORI BUTTER NAAN",
    "category": 10,
    "variants": [
      {
        "id": 1,
        "name": "DEFAULT",
        "price": 45
      }
    ]
  },
  {
    "id": 66,
    "name": "MASALA KULCHA",
    "category": 10,
    "variants": [
      {
        "id": 1,
        "name": "DEFAULT",
        "price": 50
      }
    ]
  },
  {
    "id": 67,
    "name": "FRESH GREEN SALAD",
    "category": 11,
    "variants": [
      {
        "id": 1,
        "name": "DEFAULT",
        "price": 40
      }
    ]
  },
  {
    "id": 68,
    "name": "RAITA",
    "category": 11,
    "variants": [
      {
        "id": 1,
        "name": "DEFAULT",
        "price": 40
      }
    ]
  },
  {
    "id": 69,
    "name": "ROASTED PAPAD",
    "category": 11,
    "variants": [
      {
        "id": 1,
        "name": "DEFAULT",
        "price": 40
      }
    ]
  },
  {
    "id": 70,
    "name": "FRY PAPAD",
    "category": 11,
    "variants": [
      {
        "id": 1,
        "name": "DEFAULT",
        "price": 40
      }
    ]
  },
  {
    "id": 71,
    "name": "MASALA PAPAD",
    "category": 11,
    "variants": [
      {
        "id": 1,
        "name": "DEFAULT",
        "price": 60
      }
    ]
  },
  {
    "id": 72,
    "name": "PEANUT MASALA",
    "category": 11,
    "variants": [
      {
        "id": 1,
        "name": "DEFAULT",
        "price": 60
      }
    ]
  },
  {
    "id": 73,
    "name": "FISH FINGER",
    "category": 12,
    "variants": [
      {
        "id": 1,
        "name": "DEFAULT",
        "price": 250
      }
    ]
  },
  {
    "id": 74,
    "name": "FISH AND CHIPS",
    "category": 12,
    "variants": [
      {
        "id": 1,
        "name": "DEFAULT",
        "price": 240
      }
    ]
  },
  {
    "id": 75,
    "name": "PRAWN AND CHIPS",
    "category": 12,
    "variants": [
      {
        "id": 1,
        "name": "DEFAULT"
      }
    ]
  },
  {
    "id": 76,
    "name": "FRIED CHICKEN",
    "category": 12,
    "variants": [
      {
        "id": 1,
        "name": "DEFAULT"
      }
    ]
  },
  {
    "id": 77,
    "name": "RED BULL",
    "category": 13,
    "variants": [
      {
        "id": 1,
        "name": "DEFAULT"
      }
    ]
  },
  {
    "id": 78,
    "name": "COLD DRINKS",
    "category": 13,
    "variants": [
      {
        "id": 1,
        "name": "DEFAULT"
      }
    ]
  },
  {
    "id": 79,
    "name": "FRESH LIME SODA",
    "category": 13,
    "variants": [
      {
        "id": 1,
        "name": "DEFAULT",
        "price": 40
      }
    ]
  },
  {
    "id": 80,
    "name": "JEE SODA",
    "category": 13,
    "variants": [
      {
        "id": 1,
        "name": "DEFAULT",
        "price": 40
      }
    ]
  },
  {
    "id": 81,
    "name": "SWEET LASSI",
    "category": 13,
    "variants": [
      {
        "id": 1,
        "name": "DEFAULT",
        "price": 50
      }
    ]
  },
  {
    "id": 82,
    "name": "MILK SHAKES FLOX,STRAWBERRY/VANILLA",
    "category": 13,
    "variants": [
      {
        "id": 1,
        "name": "DEFAULT",
        "price": 50
      }
    ]
  },
  {
    "id": 83,
    "name": "FROZEN MARGARITA",
    "category": 13,
    "variants": [
      {
        "id": 1,
        "name": "DEFAULT",
        "price": 100
      }
    ]
  },
  {
    "id": 84,
    "name": "MOJITO (MINT)",
    "category": 13,
    "variants": [
      {
        "id": 1,
        "name": "DEFAULT",
        "price": 90
      }
    ]
  },
  {
    "id": 85,
    "name": "FRUIT PUNCH",
    "category": 13,
    "variants": [
      {
        "id": 1,
        "name": "DEFAULT",
        "price": 100
      }
    ]
  },
  {
    "id": 86,
    "name": "PUSHPA SPECIAL",
    "category": 13,
    "variants": [
      {
        "id": 1,
        "name": "DEFAULT",
        "price": 120
      }
    ]
  },
  {
    "id": 87,
    "name": "CARAMEL CASTARD",
    "category": 14,
    "variants": [
      {
        "id": 1,
        "name": "DEFAULT",
        "price": 60
      }
    ]
  },
  {
    "id": 88,
    "name": "PUSHPA SPECIAL SWEET",
    "category": 14,
    "variants": [
      {
        "id": 1,
        "name": "DEFAULT"
      }
    ]
  },
  {
    "id": 89,
    "name": "ICE CREAM",
    "category": 14,
    "variants": [
      {
        "id": 1,
        "name": "DEFAULT",
        "price": 60
      }
    ]
  }
]
export const categories = [
  {
    "id": 1,
    "name": "SOUP",
    "order": 1
  },
  {
    "id": 2,
    "name": "NOODLES AND RICE",
    "order": 2
  },
  {
    "id": 3,
    "name": "CHINEESE STARTED VEG/NON-VEG",
    "order": 3
  },
  {
    "id": 4,
    "name": "TANDOORI VEG/NON-VEG STARTER",
    "order": 4
  },
  {
    "id": 5,
    "name": "INDIAN MAIN COURCE VEG/NON-VEG",
    "order": 5
  },
  {
    "id": 6,
    "name": "INDIAN VEGETABLE",
    "order": 6
  },
  {
    "id": 7,
    "name": "KOFTA",
    "order": 7
  },
  {
    "id": 8,
    "name": "BIRYANI RICE",
    "order": 8
  },
  {
    "id": 9,
    "name": "PULAO",
    "order": 9
  },
  {
    "id": 10,
    "name": "INDIAN BREAD",
    "order": 10
  },
  {
    "id": 11,
    "name": "SALAD",
    "order": 11
  },
  {
    "id": 12,
    "name": "CONTINENTAL NON VEG STARTER",
    "order": 12
  },
  {
    "id": 13,
    "name": "DRINKS AND MOCKTAIL",
    "order": 13
  },
  {
    "id": 14,
    "name": "DESSERT",
    "order": 14
  }
]