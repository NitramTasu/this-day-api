const axios = require('axios');

const searchUrl =
      'https://pt.wikipedia.org/w/api.php?action=opensearch&format=json&search=';
      const contentUrl =
      'https://pt.wikipedia.org/w/api.php?action=query&prop=revisions&rvprop=content&format=json&titles=';
      const imageNameUrl =
      'https://pt.wikipedia.org/w/api.php?action=query&prop=images&format=json&titles=';

      const searchImageUrl =
      'http://pt.wikipedia.org/w/api.php?action=query&prop=imageinfo&iiprop=url&format=json&titles=';


exports.searchTitle = (search) => {
  const response = axios.get(searchUrl + search);
  return response;
}

exports.searchImageName = (name) => {
  const response = axios.get(imageNameUrl + name);
  return response;
}

exports.searchImageByName = (name) => {
  const response = axios.get(searchImageUrl + name);
  return response;
}

exports.searchContent = (title) => {
  const response = axios.get(contentUrl + title);
  return response;
}
