const { Contact, Suggestion, BulkOrder, Partner } = require('../model/form');

//CONTACTS
exports.createContact = async (data) => await Contact.create(data);
exports.fetchContacts = async () => await Contact.find().lean();
//SUGGESTIONS
exports.createSuggestion = async (data) => await Suggestion.create(data);
exports.fetchSuggestions = async () => await Suggestion.find().lean();
//BULK ORDERS
exports.createBulkOrder = async (data) => await BulkOrder.create(data);
exports.fetchBulkOrders = async () => await BulkOrder.find().lean();
//PARTNERS
exports.createPartner = async (data) => await Partner.create(data);
exports.fetchPartners = async () => await Partner.find().lean();