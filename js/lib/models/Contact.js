import Model from 'flarum/Model';
import mixin from 'flarum/utils/mixin';

export default class Contact extends mixin(Model, {
    title: Model.attribute('title'),
    type: Model.attribute('type'),
    url: Model.attribute('url'),
    icon: Model.attribute('icon'),
    icon_type: Model.attribute('icon_type'),
    position: Model.attribute('position')
}) {}
