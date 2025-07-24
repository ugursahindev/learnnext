import { Card } from '@/app/ui/dashboard/cards';
import RevenueChart from '@/app/ui/dashboard/revenue-chart';

import { CardsSkeleton, RevenueChartSkeleton } from '@/app/ui/skeletons';
import LatestInvoices from '@/app/ui/dashboard/latest-invoices';
import { lusitana } from '@/app/ui/fonts';
import { fetchRevenue } from '@/app/lib/data';

import { Suspense } from 'react';
 
export default async function Page() {
  const revenue = await fetchRevenue();
  console.log(revenue);
  
  
  return (
    <div>
      <Suspense fallback={<RevenueChartSkeleton />}>
        <RevenueChart revenue={revenue} />
      </Suspense>
    </div>
   );
}







