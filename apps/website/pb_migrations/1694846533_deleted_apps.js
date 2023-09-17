/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db);
  const collection = dao.findCollectionByNameOrId("3qzr8gkz0usegs6");

  return dao.deleteCollection(collection);
}, (db) => {
  const collection = new Collection({
    "id": "3qzr8gkz0usegs6",
    "created": "2023-09-16 06:34:34.538Z",
    "updated": "2023-09-16 06:34:34.538Z",
    "name": "apps",
    "type": "base",
    "system": false,
    "schema": [
      {
        "system": false,
        "id": "clnhoewu",
        "name": "name",
        "type": "text",
        "required": false,
        "presentable": false,
        "unique": false,
        "options": {
          "min": null,
          "max": null,
          "pattern": ""
        }
      },
      {
        "system": false,
        "id": "dxyj9pqh",
        "name": "heading",
        "type": "text",
        "required": false,
        "presentable": false,
        "unique": false,
        "options": {
          "min": null,
          "max": null,
          "pattern": ""
        }
      },
      {
        "system": false,
        "id": "sishmb25",
        "name": "category",
        "type": "relation",
        "required": false,
        "presentable": false,
        "unique": false,
        "options": {
          "collectionId": "rykdo2d8w5xixfl",
          "cascadeDelete": false,
          "minSelect": null,
          "maxSelect": 1,
          "displayFields": null
        }
      }
    ],
    "indexes": [],
    "listRule": null,
    "viewRule": null,
    "createRule": null,
    "updateRule": null,
    "deleteRule": null,
    "options": {}
  });

  return Dao(db).saveCollection(collection);
})
