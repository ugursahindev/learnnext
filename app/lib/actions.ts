'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import postgres from 'postgres';

import { signIn } from '@/auth';
import { AuthError } from 'next-auth';

//sd

const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });

export async function createInvoice(formData: FormData) {
  // Form verilerini al
  const customerId = formData.get('customerId') as string;
  const amount = Number(formData.get('amount'));
  const status = formData.get('status') as string;

  // Validation
  if (!customerId || !amount || !status) {
    throw new Error('Tüm alanlar gereklidir');
  }

  try {
    // Database'e kaydet
    await sql`
      INSERT INTO invoices (customer_id, amount, status, date)
      VALUES (${customerId}, ${amount * 100}, ${status}, ${new Date().toISOString().split('T')[0]})
    `;

    // Cache'i yenile ve yönlendir
    revalidatePath('/dashboard/invoices');
    redirect('/dashboard/invoices');
  } catch (error) {
    console.error('Invoice oluşturma hatası:', error);
    throw new Error('Invoice oluşturulamadı');
  }
}

export async function updateInvoice(id: string, formData: FormData) {
  const customerId = formData.get('customerId') as string;
  const amount = Number(formData.get('amount'));
  const status = formData.get('status') as string;

  try {
    await sql`
      UPDATE invoices 
      SET customer_id = ${customerId}, amount = ${amount * 100}, status = ${status}
      WHERE id = ${id}
    `;

    revalidatePath('/dashboard/invoices');
    redirect('/dashboard/invoices');
  } catch (error) {
    console.error('Invoice güncelleme hatası:', error);
    throw new Error('Invoice güncellenemedi');
  }
}

export async function deleteInvoice(id: string) {

  //throw new Error("test");
  
  try {
    await sql`DELETE FROM invoices WHERE id = ${id}`;
    revalidatePath('/dashboard/invoices');
  } catch (error) {
    console.error('Invoice silme hatası:', error);
    throw new Error('Invoice silinemedi');
  }
} 

export async function authenticate(
  prevState: string | undefined,
  formData: FormData,
) {
  try {
    await signIn('credentials', formData);
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case 'CredentialsSignin':
          return 'Invalid credentials.';
        default:
          return 'Something went wrong.';
      }
    }
    throw error;
  }
}