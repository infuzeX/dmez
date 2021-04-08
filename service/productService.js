const { Product } = require("../model/registerModel");
const APIFeatures = require("../utils/apifeatures");

function buildSearchQuery(data) {
  const query = [];
  data.forEach((part, index) => {
    query[index] = { description: { $regex: `${part}.*`, $options: "six" } };
  });
  return query;
}

exports.fetchProducts = async (queryString) => {
  const data = queryString.search && queryString.search.split("_");
  const search = queryString.search
    ? {
        $or: [
          { title: { $regex: `${data.join(" ")}.*`, $options: "six" } },
          {
            $or: [...buildSearchQuery(data)],
          },
        ],
      }
    : {};

  const features = new APIFeatures(Product.find(search), queryString)
    .filter()
    .limitFields()
    .sort()
    .paginate();
  return await features.query.lean();
};

exports.fetchProduct = async (id, queryString) => {
  const features = new APIFeatures(
    Product.findById(id),
    queryString
  ).limitFields();
  return await features.query;
};

exports.updateProduct = async (id, data) => {
  return await Product.findByIdAndUpdate(id, data, { new: true }).lean();
};
