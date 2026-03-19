/**
 * server/src/routes/data.js
 * ─────────────────────────────────────────
 * GET  /api/data/:collection     → read all
 * POST /api/data/:collection     → upsert item
 * DELETE /api/data/:collection/:id → remove item
 *
 * Backed by simple JSON files in /data/.
 * Swap for SQLite or Postgres later with no
 * changes to the client.
 */

import { Router }     from 'express'
import { readJSON, writeJSON } from '../services/storage.js'

const router = Router()
const ALLOWED_COLLECTIONS = new Set(['bookmarks', 'queue', 'schedule', 'competitors'])

// ── Read collection ───────────────────────
router.get('/:collection', async (req, res, next) => {
  try {
    const { collection } = req.params
    if (!ALLOWED_COLLECTIONS.has(collection)) {
      return res.status(400).json({ error: 'Unknown collection' })
    }
    const data = await readJSON(collection)
    res.json(data)
  } catch (err) {
    next(err)
  }
})

// ── Write item ────────────────────────────
router.post('/:collection', async (req, res, next) => {
  try {
    const { collection } = req.params
    if (!ALLOWED_COLLECTIONS.has(collection)) {
      return res.status(400).json({ error: 'Unknown collection' })
    }
    const item = { ...req.body, id: req.body.id || `${Date.now()}`, savedAt: Date.now() }
    const data = await readJSON(collection)

    // Upsert by id
    const idx  = data.findIndex(d => d.id === item.id)
    if (idx >= 0) data[idx] = item
    else data.unshift(item)

    await writeJSON(collection, data)
    res.json(item)
  } catch (err) {
    next(err)
  }
})

// ── Delete item ───────────────────────────
router.delete('/:collection/:id', async (req, res, next) => {
  try {
    const { collection, id } = req.params
    if (!ALLOWED_COLLECTIONS.has(collection)) {
      return res.status(400).json({ error: 'Unknown collection' })
    }
    const data = await readJSON(collection)
    const filtered = data.filter(d => d.id !== id)
    await writeJSON(collection, filtered)
    res.json({ deleted: id })
  } catch (err) {
    next(err)
  }
})

export default router
