import postgres from 'postgres';

const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });

async function listInvoices() {
 	const data = await sql`
    SELECT invoices.amount, customers.name
    FROM invoices
    JOIN customers ON invoices.customer_id = customers.id
    WHERE invoices.amount = 666;`;

 	return data;
}

export async function GET() {
  try {
    const data = await listInvoices();
    return Response.json({ 
      status: 200, 
      data: data 
    }, { status: 200 });
  } catch (error) {
    return Response.json({ 
      status: 500, 
      error: error 
    }, { status: 500 });
  }
}
