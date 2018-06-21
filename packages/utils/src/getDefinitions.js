const getDefinitions = ({
  data,
  keyExtractor = (item, index) => index,
  renderLabel,
  renderItem
}) =>
  data.reduce(
    ({ labels, items }, item, index) => {
      const key = keyExtractor(item, index);

      return {
        labels: { ...labels, [key]: renderLabel(item) },
        items: { ...items, [key]: renderItem(item) }
      };
    },
    { labels: {}, items: {} }
  );

export default getDefinitions;
