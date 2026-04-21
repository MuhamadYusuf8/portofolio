import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Setup Supabase Client
// We use the anon key for upload if the bucket policies are set, 
// or service_role key to bypass RLS policies on the server side.
// Make sure to add these to your .env and Vercel!
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://kldhqnxcjqsiutfjrpdu.supabase.co';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

const supabase = createClient(supabaseUrl, supabaseKey);

export async function POST(request: Request) {
  try {
    if (!supabaseKey) {
      console.error("Supabase API key is missing!");
      return NextResponse.json({ success: false, message: 'Server configuration error' }, { status: 500 });
    }

    const data = await request.formData();
    const file: File | null = data.get('file') as unknown as File;

    if (!file) {
      return NextResponse.json({ success: false, message: 'No file uploaded' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Generate unique filename to avoid overwrites
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = file.name.split('.').pop() || 'png';
    const filename = `projects/${uniqueSuffix}.${ext}`; // Upload ke dalam folder projects/

    // Upload to Supabase Storage (Bucket name: "portfolio")
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('portfolio')
      .upload(filename, buffer, {
        contentType: file.type,
        upsert: false
      });

    if (uploadError) {
      console.error('Supabase upload error:', uploadError);
      return NextResponse.json({ success: false, message: `Upload failed: ${uploadError.message}` }, { status: 500 });
    }

    // Get Public URL
    const { data: urlData } = supabase.storage
      .from('portfolio')
      .getPublicUrl(filename);

    return NextResponse.json({ success: true, url: urlData.publicUrl });
  } catch (error: any) {
    console.error('Error uploading file:', error);
    return NextResponse.json({ success: false, message: 'File upload failed' }, { status: 500 });
  }
}
