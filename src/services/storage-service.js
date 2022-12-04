import { utilService } from './utils-service.js';

export const storageService = {
  query,
  get,
  post,
  put,
  remove,
  postMany,
  save,
};

function query(entityType) {
  var entities = JSON.parse(localStorage.getItem(entityType)) || [];
  return Promise.resolve(entities);
}

function get(entityType, entityId) {
  return query(entityType).then(entities =>
    entities.find(entity => entity._id === entityId)
  );
}

function post(entityType, newEntity) {
  newEntity._id = utilService.makeId();
  return query(entityType).then(entities => {
    entities.push(newEntity);
    save(entityType, entities);
    return newEntity;
  });
}

function postMany(entityType, newEntities) {
  return query(entityType).then(entities => {
    entities.push(...newEntities);
    save(entityType, entities);
    return entities;
  });
}

function put(entityType, updatedEntity) {
  return query(entityType).then(entities => {
    const idx = entities.findIndex(entity => entity._id === updatedEntity._id);
    entities.splice(idx, 1, updatedEntity);
    save(entityType, entities);
    return updatedEntity;
  });
}

function remove(entityType, entityId) {
  return query(entityType).then(entities => {
    const idx = entities.findIndex(entity => entity._id === entityId);
    entities.splice(idx, 1);
    save(entityType, entities);
  });
}

function save(entityType, entities) {
  localStorage.setItem(entityType, JSON.stringify(entities));
}
