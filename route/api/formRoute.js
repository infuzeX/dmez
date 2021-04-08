const router = require('express').Router();

const formController = require('../../controller/form');

router
    .route('/contacts')
    .post(formController.submitUserContact)
    .get(formController.fetchContactsController)

router
    .route('/suggestions')
    .post(formController.submitUserSuggestion)
    .get(formController.fetchSuggestionsController);

router
    .route('/bulkorders')
    .post(formController.submitBulkOrder)
    .get(formController.fetchBulkOrdersController)

router
    .route('/partners')
    .post(formController.submitPartnerRequest)
    .get(formController.fetchPartnersController)

module.exports = router;