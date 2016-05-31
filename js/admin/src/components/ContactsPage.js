import Page from 'flarum/components/Page';
import Button from 'flarum/components/Button';

import EditContactModal from 'avatar4eg/contacts/components/EditContactModal';
import sortContacts from 'avatar4eg/contacts/utils/sortContacts';

function ContactItem(contact) {
    return [
        m('li', {"data-id": contact.id()}, [
            m('div', {className: 'ContactListItem-info'}, [
                m('span', {className: 'ContactListItem-name'}, [
                    contact.title()
                ]),
                Button.component({
                    className: 'Button Button--link',
                    icon: 'pencil',
                    onclick: () => app.modal.show(new EditContactModal({contact}))
                })
            ])
        ])
    ];
}

export default class ContactsPage extends Page {
    view() {
        return [
            m('div', {className: 'ContactsPage'}, [
                m('div', {className: 'ContactsPage-header'}, [
                    m('div', {className: 'container'}, [
                        m('p', {}, app.translator.trans('avatar4eg-contacts.admin.contacts.about_text')),
                        Button.component({
                            className: 'Button Button--primary',
                            icon: 'plus',
                            children: app.translator.trans('avatar4eg-contacts.admin.contacts.create_button'),
                            onclick: () => app.modal.show(new EditContactModal())
                        })
                    ])
                ]),
                m('div', {className: 'ContactsPage-list'}, [
                    m('div', {className: 'container'}, [
                        m('div', {className: 'ContactItems'}, [
                            m('label', {}, app.translator.trans('avatar4eg-contacts.admin.contacts.contacts')),
                            m('ol', {
                                    className: 'ContactList',
                                    config: loadSorter
                                },
                                [sortContacts(app.store.all('contacts')).map(ContactItem)]
                            )
                        ])
                    ])
                ])
            ])
        ];
    }
}

function loadSorter(element) {
    $(element).sortable()
        .on('sortupdate', (e, ui) => {
            const order = $(element).children('li')
                .map(function() {
                    return {
                        id: $(this).data('id')
                    };
                }).get();

            order.forEach((contact, i) => {
                const item = app.store.getById('contacts', contact.id);
                item.pushData({
                    attributes: {
                        position: i
                    }
                });
            });

            app.request({
                url: app.forum.attribute('apiUrl') + '/contacts/order',
                method: 'POST',
                data: {order}
            });

            m.redraw.strategy('all');
            m.redraw();
        });
}
