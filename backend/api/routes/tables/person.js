const genericModel = require("./genericCRUD");

const tableName = "Person";

// can be directly accessed, without need to provide with a tableName as a parameter - even better refactoring

async function getAllPersons() {
  return await genericModel.getAll(tableName);
}

async function getPersonById(id) {
  return await genericModel.getById(tableName, id);
}

async function addPerson(person) {
  return await genericModel.add(tableName, person);
}

async function updatePerson(id, updatedPerson) {
  return await genericModel.update(tableName, id, updatedPerson);
}

async function deletePerson(id) {
  await genericModel.deleteById(tableName, id);
}

async function deleteAllPersons() {
  return await genericModel.deleteAll(tableName);
}

module.exports = {
  getAllPersons,
  getPersonById,
  addPerson,
  updatePerson,
  deletePerson,
  deleteAllPersons,
};
