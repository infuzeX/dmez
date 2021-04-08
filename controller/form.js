const {
    createContact,
    fetchContacts,
    createSuggestion,
    fetchSuggestions,
    createBulkOrder,
    fetchBulkOrders,
    createPartner,
    fetchPartners,
} = require("../service/formService");

const catchAsync = require("../utils/catchAsync");

exports.submitUserContact = catchAsync(async (req, res, next) => {
    await createContact({
        name: req.body.name,
        email: req.body.email,
        contact: req.body.contact,
        message: req.body.message,
    });
    res.status(201).json({
        status: "success",
        message: "We will contact you soon",
    });
});

exports.fetchContactsController = catchAsync(async (req, res, next) => {
    const contacts = await fetchContacts();
    res.status(201).json({
        status: "success",
        data: {
            results: contacts.length,
            contacts,
        },
    });
});

exports.submitUserSuggestion = catchAsync(async (req, res, next) => {
    await createSuggestion({
        name: req.body.name,
        suggestion: req.body.suggestion,
    });
    res.status(201).json({
        status: "success",
        message: "Thank you for your valuable suggestion",
    });
});

exports.fetchSuggestionsController = catchAsync(async (req, res, next) => {
    const suggestions = await fetchSuggestions();
    res.status(201).json({
        status: "success",
        data: {
            results: suggestions.length,
            suggestions,
        },
    });
});

exports.submitBulkOrder = catchAsync(async (req, res, next) => {
    await createBulkOrder({
        title: req.body.title,
        quantity: req.body.quantity,
        contact: req.body.contact,
        email: req.body.email,
        name: req.body.name,
        address: req.body.address,
    });
    res.status(201).json({
        status: "success",
        message: "We will contact you soon",
    });
});

exports.fetchBulkOrdersController = catchAsync(async (req, res, next) => {
    const bulkOrders = await fetchBulkOrders();
    res.status(201).json({
        status: "success",
        data: {
            results: bulkOrders.length,
            bulkOrders,
        },
    });
});

exports.submitPartnerRequest = catchAsync(async (req, res, next) => {
    await createPartner({
        contact: req.body.contact,
        email: req.body.email,
        name: req.body.name,
    });
    res.status(201).json({
        status: "success",
        message: "We will contact you soon",
    });
});

exports.fetchPartnersController = catchAsync(async (req, res, next) => {
    const partners = await fetchPartners();
    res.status(201).json({
        status: "success",
        data: {
            results: partners.length,
            partners,
        },
    });
});
