const asyncHandler = require('../utils/asyncHandler');
const AppError = require('../utils/AppError');

const getAll = (Model, populate = []) =>
  asyncHandler(async (req, res) => {
    let query = Model.find();
    populate.forEach((field) => {
      query = query.populate(field);
    });

    const docs = await query.sort('-createdAt');
    res.json({ success: true, count: docs.length, data: docs });
  });

const getOne = (Model, populate = []) =>
  asyncHandler(async (req, res) => {
    let query = Model.findById(req.params.id);
    populate.forEach((field) => {
      query = query.populate(field);
    });

    const doc = await query;
    if (!doc) throw new AppError('Resource not found', 404);

    res.json({ success: true, data: doc });
  });

const createOne = (Model) =>
  asyncHandler(async (req, res) => {
    const doc = await Model.create(req.body);
    res.status(201).json({ success: true, data: doc });
  });

const updateOne = (Model) =>
  asyncHandler(async (req, res) => {
    const doc = await Model.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!doc) throw new AppError('Resource not found', 404);

    res.json({ success: true, data: doc });
  });

const deleteOne = (Model) =>
  asyncHandler(async (req, res) => {
    const doc = await Model.findByIdAndDelete(req.params.id);
    if (!doc) throw new AppError('Resource not found', 404);

    res.status(204).send();
  });

module.exports = { getAll, getOne, createOne, updateOne, deleteOne };
