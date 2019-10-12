import Stats from 'stats-js'; // eslint-disable-line import/no-extraneous-dependencies

const stats = new Stats();
stats.domElement.style.position = 'absolute';
stats.domElement.style.left = '0';
stats.domElement.style.top = '0';

document.body.appendChild(stats.domElement);

export default stats;
