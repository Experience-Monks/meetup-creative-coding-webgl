import dat from 'dat-gui';
import queryString from 'query-string';

const gui = new dat.GUI();
// dat.GUI.toggleHide();

module.exports = modes => {
  const options = modes !== undefined ? modes : ['webgl2', 'webgl'];

  const queries = queryString.parse(window.location.search);

  function getQuery(query) {
    return queries[query];
  }

  const setQuery = (query, val) => {
    const newQueries = Object.assign({}, queries, {
      [query]: val
    });
    const stringified = queryString.stringify(newQueries);

    const url = `${window.location.pathname}?${stringified}`;
    window.location.href = url;
  };

  const guiController = {
    context: getQuery('context') || options[0]
  };

  gui.add(guiController, 'context', options).onChange(val => {
    setQuery('context', val);
  });

  return {
    gui,
    guiController,
    getQuery,
    setQuery
  };
};
