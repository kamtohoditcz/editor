// For indexed version this works, but it doesn't
// support substring match.
// return {
//   query: { $text: { $search: queryString } },
//   options: { score: { $meta: "textScore" } },
//   sort: { score: { $meta: "textScore" } },
// };

var sameCharsRegExps = ['aá', 'cč', 'dď', 'eéě', 'ií', 'nň', 'oó', 'rř', 'sš', 'tť', 'uúů', 'yý', 'zž'].map(chars => new RegExp(`[${chars}]`, 'ig'));

module.exports = (text) => {
  text = text.trim();
  text = text.replace(/\s+/g, ' ');
  text = text.replace(' ', '.* ');

  // cestina
  text = sameCharsRegExps.reduce((text, re) => text.replace(re, re.source), text);

  var re = { $regex: text, $options: 'gim' };

  return {
    $or: [{ name: re }, { aliases: re }],
  }

};
