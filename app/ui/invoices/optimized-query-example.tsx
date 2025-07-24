import postgres from 'postgres';

const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });

interface Invoice {
  amount: number;
  name: string;
}

async function getSpecialInvoices(): Promise<Invoice[]> {
  try {
    const data = await sql<Invoice[]>`
      SELECT invoices.amount, customers.name
      FROM invoices
      JOIN customers ON invoices.customer_id = customers.id
      WHERE invoices.amount = 666;`;
    
    return data;
  } catch (error) {
    console.error('Database Error:', error);
    return [];
  }
}

export default async function OptimizedQueryExample() {
  const invoices = await getSpecialInvoices();

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Special Invoices (Direct DB)</h2>
      <p className="text-sm text-gray-600 mb-4">
        Bu version API route'u bypass eder ve direkt veritabanından veri çeker
      </p>
      {invoices.length === 0 ? (
        <p>No invoices found with amount 666</p>
      ) : (
        <ul className="space-y-2">
          {invoices.map((invoice, index) => (
            <li key={index} className="p-2 border rounded bg-blue-50">
              <strong>{invoice.name}</strong> - ${invoice.amount}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
} 