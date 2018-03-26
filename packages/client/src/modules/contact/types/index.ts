/* Entities */
interface Contact {
  name: string;
  email: string;
  content: string;
}

/* Types */
type SendContactFn = (contactData: Contact) => any;

/* ComponentProps */
interface ContactOperations {
  contact: SendContactFn;
}

interface ContactProps extends ContactOperations {}

interface ContactState {
  sent: boolean;
}

interface ContactError {
  field: string;
  message: string;
}

export { Contact };
export { SendContactFn };
export { ContactOperations, ContactProps, ContactState, ContactError };