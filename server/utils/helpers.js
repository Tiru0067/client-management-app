const db = require("../utils/db");

// Helper to get the last affected ID after an INSERT operation
exports.lastAffectedId = (sql, params) => {
  return new Promise((resolve, reject) => {
    db.run(sql, params, function (err) {
      if (err) return reject(err);
      resolve(this.lastID);
    });
  });
};

// Helper to get the number of changes after an UPDATE or DELETE operation
exports.changesCount = (sql, params) => {
  return new Promise((resolve, reject) => {
    db.run(sql, params, function (err) {
      if (err) return reject(err);
      resolve(this.changes);
    });
  });
};
