export function newPost(obj) {
  if (obj.id && obj.title && obj.data) {
    return {
      id: obj.id,
      title: obj.title,
      data: obj.data,
      tags: Array.isArray(obj.tags) ? obj.tags : [],
      // ^---- parse instead of validate,
      // in this case we want to not get send wrong tags like undefined, numbers, or other values
    };
  }
  return null;
}
module.exports = {
  newPost,
};
