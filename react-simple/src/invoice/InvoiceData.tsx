export interface InvoiceData {
  invoiceid: number;
  name: string;
  amount: number;
}

const invoices: InvoiceData[] = [
  {
    invoiceid: 1,
    name: 'Ensar',
    amount: 100,
  },
  {
    invoiceid: 2,
    name: 'Ensar',
    amount: 1000,
  },
];

export const getInvoiceData = async (): Promise<InvoiceData[]> => invoices;
