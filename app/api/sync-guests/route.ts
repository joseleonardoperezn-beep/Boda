import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { doc, setDoc } from 'firebase/firestore';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { token, guests } = body;

    const expectedToken = process.env.SYNC_SECRET_TOKEN || 'boda_secreta_lis_y_leo_2026';

    if (token !== expectedToken) {
      return NextResponse.json({ error: 'Token de sincronización no válido' }, { status: 401 });
    }

    if (!Array.isArray(guests)) {
      return NextResponse.json({ error: 'Lista de invitados no válida' }, { status: 400 });
    }

    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://boda-lis-leo.vercel.app';
    const results = [];

    for (const g of guests) {
      const rawId = String(g.id || '').trim();
      const slug = rawId
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9_-]/g, '-');

      if (!slug) continue;

      const guestRef = doc(db, 'guests', slug);
      await setDoc(
        guestRef,
        {
          id: slug,
          name: String(g.name || '').trim(),
          dedication: String(g.dedication || '').trim(),
          phone: g.phone ? String(g.phone).trim() : null,
          confirmed: false,
          companions_count: 0,
          updated_at: new Date().toISOString(),
        },
        { merge: true } // Mantiene la confirmación si ya la habían hecho
      );

      results.push({
        id: slug,
        url: `${baseUrl}/invitacion/${slug}`,
      });
    }

    return NextResponse.json({
      success: true,
      count: results.length,
      data: results,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Error interno' }, { status: 500 });
  }
}

