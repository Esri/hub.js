import { camelize } from '@esri/hub-common';

function component() {
  const element = document.createElement('div');

  element.innerHTML = camelize('Hello  webpack');

  return element;
}

document.body.appendChild(component());
