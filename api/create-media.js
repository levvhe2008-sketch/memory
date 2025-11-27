// Example serverless function for Vercel that creates a media record in Supabase DB
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE

const supabase = createClient(supabaseUrl, supabaseServiceKey)

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).send('Method Not Allowed')
  const { albumId, storagePath, filename, mimeType, size, width, height, caption, uploaderId } = req.body
  if (!albumId || !storagePath) return res.status(400).json({ error: 'Missing params' })

  try {
    // Insert media record into DB (service role key required)
    const { data, error } = await supabase.from('media').insert([{
      album_id: albumId,
      uploader_id: uploaderId || null,
      filename,
      mime_type: mimeType,
      size: size || null,
      width: width || null,
      height: height || null,
      storage_path: storagePath,
      caption: caption || null
    }]).select().single()

    if (error) throw error
    return res.status(201).json({ media: data })
  } catch (e) {
    console.error(e)
    return res.status(500).json({ error: 'db_insert_failed', details: e.message })
  }
}
