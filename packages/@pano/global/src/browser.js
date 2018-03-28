$.isCSSFeatureSupported = function(cssFeature) {
  let supported = false;
  const domPrefixes = 'Webkit Moz ms O'.split(' ');
  const elm = document.createElement('div');
  let cssFeatureUpperCase = null;

  cssFeature = cssFeature.toLowerCase();

  if (elm.style[cssFeature] !== undefined) {
    supported = true;
  }

  if (supported === false) {
    cssFeatureUpperCase = cssFeature.charAt(0).toUpperCase() + cssFeature.substr(1);

    for (let i = 0, end = domPrefixes.length, asc = 0 <= end; asc ? i < end : i > end; asc ? i++ : i--) {
      if (elm.style[domPrefixes[i] + cssFeatureUpperCase ] !== undefined) {
        supported = true;
        break;
      }
    }
  }

  return supported;
};