
// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import axios from 'axios'
import querystring from 'query-string'

type Data = {
  error: string | string[]
  err?: Record<string, any>
} | {
  code: string | string[]
  state: string | string[]
}

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  // Get code and state from query string
  const { code, state, error } = req.query

  if (error) {
    res.status(401).json({ error: error })
    return
  }

  if (state) {


    axios.post('https://accounts.spotify.com/api/token', querystring.stringify({
      grant_type: 'authorization_code',
      code,
      redirect_uri: process.env.REDIRECT_URI,
    }), {
      headers: {
        Authorization: `Basic ${Buffer.from(`${process.env.CLIENT_ID}:${process.env.CLIENT_SECRET}`).toString('base64')}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      }
    }).then(({ data }) => {
      res.redirect(`/visualizer?token=${data.access_token}`)
    }).catch(err => {
      res.status(401).json({ error: err, err })
    })

    return
  }
  res.status(200).json({ code: code as string, state: state as string })
}
