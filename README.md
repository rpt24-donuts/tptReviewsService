# tptReviews
Reviews Module

## API

**`GET` request**
*  endpoint: _/products/:id/reviews_
*  Params:`id=[integer]` product unique identifier
* **Success Response:**
  * **Code:** 200
  * **Content:**
             ```[{
            "grade": [
                "2nd Grade"
            ],
            "standards": [],
            "_id": "6007c969ddd577758381ae3e",
            "title": "Foxclore Chucknology Swooflia Pepelexa Ploosnar Foxclore",
            "description": "Wetwest Unpossible Losenoid Bumola Zestybus Sislaf Olielle Chucknology Besloor Luezoid Pepelexa Onama Yammoe Stepjump Dropellet Creahoof Stepjump Roinad Wetwest Crestboot Wavefire Onama Shorogyt Tupacase",
            "rating": 3,
            "helpful": 9,
            "user": "Chucknology Shorogyt",
            "productId": 2,
            "__v": 0
        }, ...]```

**`POST` request**
*  endpoint: _/products/:id/review_
*  Params:`id=[integer]` product unique identifier
*  Body:
   * `title: string`
   * `user: string`
   * `description: string`
   * `rating: integer`
   * `grade: array`
   * `description: array`
* **Success Response:**
  * **Code:** 204
  * **Content:**
             ```{
    "grade": [
        "2nd Grade",
        "3rd Grade"
    ],
    "standards": [],
    "_id": "600bd61dd8831e6ce0aa0121",
    "productId": 15,
    "title": "this is a test to create a review for product 10",
    "description": "product 10 is pretty awesome",
    "rating": 5,
    "user": "Matteo B",
    "__v": 0
}```


**`PUT` request**
*  endpoint: _/review/:reviewId'_
*  Params:`reviewId=[MongoDB ObjectId]`
*  Body:
   * `title: string`
   * `description: string`
   * `rating: integer`
   * `grade: array`
   * `description: array`
* **Success Response:**
  * **Code:** 200
  * **Content:**
             ```{
    "grade": [
        "3rd Grade"
    ],
    "standards": [
        {
            "standard": "TKO 12.4f",
            "alignment": 5
        },
        {
            "standard": "CCSS 3.NF.A.1",
            "alignment": 2
        }
    ],
    "_id": "6007c969ddd577758381ae8b",
    "title": "test to update title6",
    "description": "this is another test",
    "rating": 3,
    "helpful": 15,
    "user": "Sinpad Looncan",
    "productId": 2,
    "__v": 0
}```

**`DELETE` request**
*  endpoint: _/review/:reviewId'_
*  Params:`reviewId=[MongoDB ObjectId]`
* **Success Response:**
  * **Code:** 200
  * **Content:**
             ```{
    "n": 1,
    "ok": 1,
    "deletedCount": 1
}```