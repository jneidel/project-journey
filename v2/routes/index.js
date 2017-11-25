const express = require( "express" ),
    router = express.Router(),
    appController = require( "../controller/appController" ),
    databaseController = require( "../controller/databaseController" );

router.get( "/", appController.renderItems );
router.post( "/api/update", databaseController.updateDatabase );
router.get( "/api/generate-cardId", databaseController.generateCardId );
router.post( "/api/add-new-card", databaseController.addNewCard );
router.get( "/api/get-userid", databaseController.getUserId );

module.exports = router;
