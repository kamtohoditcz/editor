// For indexed version this works, but it doesn't
// support substring match.
// return {
//   query: { $text: { $search: queryString } },
//   options: { score: { $meta: "textScore" } },
//   sort: { score: { $meta: "textScore" } },
// };

var sameChars = ['aá', 'cč', 'dď', 'eéě', 'ií', 'nň', 'oó', 'rř', 'sš', 'tť', 'uúů', 'yý', 'zž'];

module.exports = searchQueryBuilder(text) => {
  text = text.trim();
  text = text.replace(/\s+/g, ' ');
  text = text.replace(' ', '.* ');

  // cestina
  text = sameChars.reduce((text, s) => text.replace(`[${s}]`, `[${s}]`), text);

  var re = { $regex: text, $options: 'gim' };

  return {
    $or: [{ name: re }, { aliases: re }],
  }

};
