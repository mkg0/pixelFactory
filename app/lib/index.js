export function exportFont(fontDataSet) {
  var tempDataSet = Object.assign({}, fontDataSet);
  var obj = {};
  tempDataSet.letters.forEach((item, i) => {
    item.order = i;
    obj[item.key] = item;
  });
  tempDataSet.letters = obj;
  return tempDataSet;
}
