'use client';

import { useEffect, useState } from 'react';

interface Invoice {
  amount: number;
  name: string;
}

export default function QueryExample() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchInvoices() {
      try {
        setLoading(true);
        const response = await fetch('/query');
        
        if (!response.ok) {
          throw new Error('Failed to fetch invoices');
        }
        
        const data = await response.json();
        setInvoices(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    }

    fetchInvoices();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Special Invoices (Amount: 666)</h2>
      {invoices.length === 0 ? (
        <p>No invoices found with amount 666</p>
      ) : (
        <ul className="space-y-2">
          {invoices.map((invoice, index) => (
            <li key={index} className="p-2 border rounded">
              <strong>{invoice.name}</strong> - ${invoice.amount}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
} 