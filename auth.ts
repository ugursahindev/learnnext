import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { authConfig } from './auth.config';
import { z } from 'zod';
import type { User } from '@/app/lib/definitions';
import bcrypt from 'bcrypt';
import postgres from 'postgres';
 
// Veritabanı bağlantısını kontrol et
if (!process.env.POSTGRES_URL) {
  throw new Error('POSTGRES_URL environment variable is not set. Please check your .env.local file.');
}

const sql = postgres(process.env.POSTGRES_URL!, { 
  ssl: 'require',
  connect_timeout: 10, // 10 saniye timeout
  idle_timeout: 20,
  max_lifetime: 60 * 30 // 30 dakika
});
 
async function getUser(email: string): Promise<User | undefined> {
  try {
    console.log('Attempting to fetch user for email:', email);
    
    // Veritabanı bağlantısını test et
    await sql`SELECT 1`;
    console.log('Database connection successful');
    
    const user = await sql<User[]>`SELECT * FROM users WHERE email=${email}`;
    console.log('User query completed, found:', user.length, 'users');
    
    return user[0];
  } catch (error) {
    console.error('Failed to fetch user:', error);
    
    // Hata tipine göre daha detaylı mesaj
    if (error instanceof Error) {
      if (error.message.includes('ETIMEDOUT')) {
        console.error('Database connection timeout. Check if PostgreSQL is running and POSTGRES_URL is correct.');
      } else if (error.message.includes('ECONNREFUSED')) {
        console.error('Database connection refused. Check if PostgreSQL server is running.');
      } else if (error.message.includes('authentication failed')) {
        console.error('Database authentication failed. Check username/password in POSTGRES_URL.');
      }
    }
    
    throw new Error('Failed to fetch user.');
  }
}
 
export const { auth, signIn, signOut } = NextAuth({
    ...authConfig,
    providers: [
      Credentials({
        async authorize(credentials) {
            const parsedCredentials = z
            .object({ email: z.string().email(), password: z.string().min(6) })
            .safeParse(credentials);
   
          if (parsedCredentials.success) {
            const { email, password } = parsedCredentials.data;
            const user = await getUser(email);
            if (!user) return null;
            const passwordsMatch = await bcrypt.compare(password, user.password);
   
            if (passwordsMatch) return user;
          }
   
          console.log('Invalid credentials');
          return null;
        },
      }),
    ],
  });