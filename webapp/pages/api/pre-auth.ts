
import type { NextApiRequest, NextApiResponse } from "next";
import querystring from "query-string";

type Data = {
  accessToken: string
}

const ALPHA = "ABCDEFGHIGKLMNOPQRSTUVWXYZ";

/**
 * It generates a random string of a given length by randomly selecting characters from the alphabet
 * and randomly using uppercase or lowercase
 * @param {number} length - number - the length of the string to generate
 * @returns A random string of the given length.
 */
const generateRandomString = (length: number): string => {
  let result = "";
  
  for (let i = 0; i < length; i++) {
    let c = ALPHA.charAt(Math.floor(Math.random() * length));
    
    // randomly use uppercase or lowercase
    if (Math.random() > 0.5) {
      c = c.toUpperCase();
    }

    result += c;
  }

  return result
}



export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {

  // Generate a random string of characters for the state parameter
  const state = generateRandomString(16);
  const scope = "user-read-private user-read-email user-top-read";

  const query = querystring.stringify({
    response_type: "code",
    client_id: process.env.CLIENT_ID,
    redirect_uri: process.env.REDIRECT_URI,
    scope,
    state,
  })

  res.redirect('https://accounts.spotify.com/authorize?' + query);
}