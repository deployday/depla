/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("3qzr8gkz0usegs6")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "zkcez6fb",
    "name": "owner",
    "type": "relation",
    "required": false,
    "presentable": false,
    "unique": false,
    "options": {
      "collectionId": "_pb_users_auth_",
      "cascadeDelete": false,
      "minSelect": null,
      "maxSelect": 1,
      "displayFields": null
    }
  }))

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("3qzr8gkz0usegs6")

  // remove
  collection.schema.removeField("zkcez6fb")

  return dao.saveCollection(collection)
})
