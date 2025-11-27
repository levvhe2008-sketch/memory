// Example serverless function for Vercel (Node.js) — generate pre-signed upload URL for Supabase Storage
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE

const supabase = createClient(supabaseUrl, supabaseServiceKey)

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).send('Method Not Allowed')
  const { albumId, filename, mimeType } = req.body
  if (!albumId || !filename) return res.status(400).json({ error: 'Missing params' })

  // Check user's session/permissions here (omitted in example)

  const filePath = `albums/${albumId}/${Date.now()}_${filename}`
  // Generate signed URL (Supabase uses Storage API - create signed upload URL requires service role)
  try {
    const { data, error } = await supabase.storage.from('media').createSignedUrl(filePath, 60, { contentType: mimeType })
    if (error) throw error
    // You'd typically also create a media row in the DB here
    return res.status(200).json({ uploadUrl: data.signedURL, storagePath: filePath })
  } catch (e) {
    console.error(e)
    return res.status(500).json({ error: 'upload_url_failed', details: e.message })
  }
}
