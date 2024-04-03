const genericModel = require('./../genericCRUD');

const tableName = 'Feedback';

// can be directly accessed, without need to provide with a tableName as a parameter - even better refactoring

async function getAllFeedbacks() {
  return await genericModel.getAll(tableName);
}

async function getFeedbackById(id) {
  return await genericModel.getById(tableName, id);
}

async function addFeedback(feedback) {
  return await genericModel.add(tableName, feedback);
}

async function updateFeedback(id, updatedFeedback) {
  return await genericModel.update(tableName, id, updatedFeedback);
}

async function deleteFeedback(id) {
  await genericModel.deleteById(tableName, id);
}

async function deleteAllFeedbacks() {
  return await genericModel.deleteAll(tableName);
}

module.exports = {
  getAllFeedbacks,
  getFeedbackById,
  addFeedback,
  updateFeedback,
  deleteFeedback,
  deleteAllFeedbacks
};
