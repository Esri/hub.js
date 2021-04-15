import Controller from '@ember/controller';
import { camelize } from '@esri/hub-common';

export default class ApplicationController extends Controller {
  get message () {
    return camelize('Hello  Ember');
  }
}
