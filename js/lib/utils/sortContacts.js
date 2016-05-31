export default function sortContacts(contacts) {
  return contacts.slice(0).sort((a, b) => {
    const aPos = a.position();
    const bPos = b.position();

    if (bPos === null) return -1;
    if (aPos === null) return 1;

    return a.position() - b.position();
  });
}
