interface Invoice {
  amount: number;
  name: string;
}

async function fetchSpecialInvoices(): Promise<Invoice[]> {
  try {
    // Server-side'da absolute URL kullanmalıyız
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    const response = await fetch(`${baseUrl}/query`, {
      // Server-side cache ayarları
      cache: 'no-store', // veya 'force-cache' cache için
    });

    if (!response.ok) {
      throw new Error('Failed to fetch invoices');
    }

    return response.json();
  } catch (error) {
    console.error('Error fetching invoices:', error);
    return [];
  }
}

export default async function ServerQueryExample() {
  const invoices = await fetchSpecialInvoices();

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Special Invoices (Server-Side)</h2>
      {invoices.length === 0 ? (
        <p>No invoices found with amount 666</p>
      ) : (
        <ul className="space-y-2">
          {invoices.map((invoice, index) => (
            <li key={index} className="p-2 border rounded bg-gray-50">
              <strong>{invoice.name}</strong> - ${invoice.amount}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
} 