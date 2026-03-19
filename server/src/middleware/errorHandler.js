/**
 * server/src/middleware/errorHandler.js
 */

export function errorHandler(err, req, res, next) {
  console.error(`[${new Date().toISOString()}] ${req.method} ${req.path}`, err.message)

  // Anthropic API errors
  if (err.status && err.error) {
    return res.status(err.status).json({ error: err.error.message || 'Anthropic error' })
  }

  res.status(500).json({ error: err.message || 'Internal server error' })
}
