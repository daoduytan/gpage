const deleteConversation = ({ db, key, collection }) => {
  return new Promise((resolve, reject) => {
    db.collection('user_activity')
      .doc(key)
      .collection(collection)
      .get()
      .then(snapshot => {
        if (snapshot.size === 0) {
          return resolve({ status: true });
        }

        const batch = db.batch();

        snapshot.forEach(doc => {
          // For each doc, add a delete operation to the batch
          batch.delete(doc.ref);
        });
        // Commit the batch
        return batch
          .commit()
          .then(() => {
            return resolve({ status: true });
          })
          .catch(error => reject(error));
      });
  });
};

module.exports = {
  deleteConversation,
};
