import Modal from 'flarum/components/Modal';
import Button from 'flarum/components/Button';
import { slug } from 'flarum/utils/string';
import Select from 'flarum/components/Select';
import IconSelectorComponent from 'avatar4eg/contacts/components/IconSelectorComponent';

/**
 * The `EditContactModal` component shows a modal dialog which allows the user
 * to create or edit a contact.
 */
export default class EditContactModal extends Modal {
    init() {
        super.init();

        this.contact = this.props.contact || app.store.createRecord('contacts');

        this.itemTitle = m.prop(this.contact.title() || '');
        this.type = m.prop(this.contact.type() || 'url');
        this.url = m.prop(this.contact.url() || '');
        this.icon = m.prop(this.contact.icon() || 'fa-link');
        this.iconType = m.prop(this.contact.icon_type() || 'icon');

        this.contactTypes = {
            'titles': {
                'url': app.translator.trans('avatar4eg-contacts.admin.edit_contact.type_url'),
                'phone': app.translator.trans('avatar4eg-contacts.admin.edit_contact.type_phone'),
                'mail': app.translator.trans('avatar4eg-contacts.admin.edit_contact.type_mail')
            },
            'links': {
                'url': '',
                'phone': 'tel:',
                'mail': 'mailto:'
            },
            'icons': {
                'url': 'fa-link',
                'phone': 'fa-phone',
                'mail': 'fa-at'
            }
        };
    }

    className() {
        return 'EditContactModal Modal--small';
    }

    title() {
        const title = this.itemTitle();
        return title
            ? title
            : app.translator.trans('avatar4eg-contacts.admin.edit_contact.title');
    }

    content() {
        var parent = this;
        return [
            m('div', {className: 'Modal-body'}, [
                m('form', {
                        className: 'Form',
                        onsubmit: this.onsubmit.bind(this)
                    },
                    [
                        m('div', {className: 'Form-group'}, [
                            m('label', {}, app.translator.trans('avatar4eg-contacts.admin.edit_contact.title_label')),
                            m('input', {
                                className: 'FormControl',
                                placeholder: app.translator.trans('avatar4eg-contacts.admin.edit_contact.title_placeholder'),
                                value: this.itemTitle(),
                                oninput: m.withAttr('value', this.itemTitle)
                            })
                        ]),
                        m('div', {className: 'Form-group'}, [
                            m('label', {}, app.translator.trans('avatar4eg-contacts.admin.edit_contact.type_label')),
                            Select.component({
                                options: this.contactTypes['titles'],
                                onchange: function (value) {
                                    parent.type(value);
                                    parent.url(parent.contactTypes['links'][value]);
                                    parent.iconType('icon');
                                    parent.icon(parent.contactTypes['icons'][value]);
                                },
                                value: this.type() || 'url'
                            })
                        ]),
                        m('div', {className: 'Form-group'}, [
                            m('label', {}, app.translator.trans('avatar4eg-contacts.admin.edit_contact.url_label')),
                            m('input', {
                                className: 'FormControl',
                                type: 'url',
                                placeholder: app.translator.trans('avatar4eg-contacts.admin.edit_contact.url_placeholder'),
                                value: this.url(),
                                oninput: m.withAttr('value', (value) => {
                                    this.url(value);
                                    var urlpattern = /(http|ftp|https):\/\/[\w-]+(\.[\w-]+)+([\w.,@?^=%&amp;:\/~+#-]*[\w@?^=%&amp;\/~+#-])?/;
                                    if(urlpattern.test(this.url().toLowerCase())) {
                                        var iconurl = (this.url().replace(/(:\/\/[^\/]+).*$/, '$1') + '/favicon.ico');
                                        this.icon(iconurl);
                                        this.iconType('favicon');
                                        m.redraw();
                                    } else if (this.iconType() == 'favicon') {
                                        this.icon(parent.contactTypes['links']['url']);
                                        this.iconType('icon');
                                        m.redraw();
                                    }
                                })
                            })
                        ]),
                        m('div', {className: 'Form-group'}, [
                            m('label', {}, app.translator.trans('avatar4eg-contacts.admin.edit_contact.icon_label')),
                            IconSelectorComponent.component({
                                icon: this.icon,
                                iconType: this.iconType
                            })
                        ]),
                        m('div', {className: 'Form-group'}, [
                            Button.component({
                                type: 'submit',
                                className: 'Button Button--primary EditContactModal-save',
                                loading: this.loading,
                                children: app.translator.trans('avatar4eg-contacts.admin.edit_contact.submit_button')
                            }),
                            this.contact.exists ? (
                                Button.component({
                                    type: 'button',
                                    className: 'Button EditContactModal-delete',
                                    onclick: this.deleteItem.bind(this),
                                    children: app.translator.trans('avatar4eg-contacts.admin.edit_contact.delete_contact_button')
                                })
                            ) : ''
                        ])
                    ]
                )
            ])
        ];
    }

    onsubmit(e) {
        e.preventDefault();

        this.loading = true;

        this.contact.save({
            title: this.itemTitle(),
            url: this.url(),
            type: this.type(),
            icon: this.icon(),
            icon_type: this.iconType()
        }).then(
            () => this.hide(),
            response => {
                this.loading = false;
                this.handleErrors(response);
            }
        );
    }

    deleteItem() {
        if (confirm(app.translator.trans('avatar4eg-contacts.admin.edit_contact.delete_contact_confirmation'))) {
            this.contact.delete({}).then(() => m.redraw());
            this.hide();
        }
    }
}
