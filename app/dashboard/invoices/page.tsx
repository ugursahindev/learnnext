'use client';

import { Suspense, useEffect, useState } from 'react';
import { InvoicesTableSkeleton } from '@/app/ui/skeletons';

interface Invoice {
  amount: number;
  name: string;
}

export default function Page() {

    const [invoices, setInvoices] = useState<Invoice[]>([]);

    async function InvoicesTable() {
        await new Promise((resolve) => setTimeout(resolve, 5000)); // 5 saniye bekle
        return <p>Invoices Table</p>;
    }

    useEffect(() => {
        async function fetchInvoices() {
          try {
            // Relative URL - hem development hem production'da çalışır
            const response = await fetch('https://learnnext-eight-orcin.vercel.app/query');
            
            if (!response.ok) {
              throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();
            setInvoices(data.data);
            console.log('Fetched data:', data);
          } catch (err) {
            console.error('Fetch error:', err);
          }
        }
    
        fetchInvoices();
      }, []);

    return (
        <div>
            aaa
            {invoices.length > 0 && invoices[0].name}
            {/*
                        <Suspense fallback={<InvoicesTableSkeleton />}>
                <InvoicesTable />
            </Suspense>
            */}

        </div>
    );
}