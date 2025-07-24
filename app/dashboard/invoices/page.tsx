import { Suspense, } from 'react';
import { InvoicesTableSkeleton } from '@/app/ui/skeletons';

export default function Page() {

    async function InvoicesTable() {
        await new Promise((resolve) => setTimeout(resolve, 5000)); // 5 saniye bekle
        return <p>Invoices Table</p>;
    }

    return (
        <div>
            <Suspense fallback={<InvoicesTableSkeleton />}>
                <InvoicesTable />
            </Suspense>
        </div>
    );
}