#!/usr/bin/env node
// Run once locally to get your Google OAuth refresh token.
// Usage: node scripts/bootstrap-auth.js
// Requires: credentials.json downloaded from Google Cloud Console
//   (OAuth 2.0 Client ID → Desktop App)

import fs from 'fs';
import http from 'http';
import { URL } from 'url';

let credentials;
try {
  const raw = fs.readFileSync('./credentials.json', 'utf8');
  if (!raw.trim()) throw new Error('File is empty');
  credentials = JSON.parse(raw);
} catch (e) {
  if (e.code === 'ENOENT') {
    console.error('\nMissing credentials.json\n');
  } else {
    console.error(`\nCould not read credentials.json: ${e.message}\n`);
  }
  console.error('Download it from Google Cloud Console:');
  console.error('  console.cloud.google.com → APIs & Services → Credentials');
  console.error('  → OAuth 2.0 Client IDs → your Desktop App → Download JSON');
  console.error('  Save it as credentials.json in the project root.\n');
  process.exit(1);
}
const { client_id, client_secret } = credentials.installed ?? credentials.web;

const REDIRECT_URI = 'http://localhost:9876/callback';
const SCOPE = 'https://www.googleapis.com/auth/photoslibrary.readonly';

const authUrl =
  'https://accounts.google.com/o/oauth2/v2/auth?' +
  new URLSearchParams({
    client_id,
    redirect_uri: REDIRECT_URI,
    response_type: 'code',
    scope: SCOPE,
    access_type: 'offline',
    prompt: 'consent',
  });

console.log('\nOpen this URL in your browser:\n');
console.log(authUrl);
console.log('\nWaiting for callback on http://localhost:9876 ...\n');

const server = http.createServer(async (req, res) => {
  const qs = new URL(req.url, 'http://localhost:9876').searchParams;
  const code = qs.get('code');
  const error = qs.get('error');

  if (error) {
    res.end(`Auth error: ${error}`);
    server.close();
    return;
  }

  if (!code) return;

  const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      code,
      client_id,
      client_secret,
      redirect_uri: REDIRECT_URI,
      grant_type: 'authorization_code',
    }),
  });

  const tokens = await tokenRes.json();
  res.end('Success! Check your terminal.');
  server.close();

  if (!tokens.refresh_token) {
    console.error('\nNo refresh_token returned. Try revoking access at:');
    console.error('https://myaccount.google.com/permissions');
    console.error('Then run this script again.\n');
    return;
  }

  console.log('\n✅ Add these to Vercel Environment Variables:\n');
  console.log(`GOOGLE_CLIENT_ID=${client_id}`);
  console.log(`GOOGLE_CLIENT_SECRET=${client_secret}`);
  console.log(`GOOGLE_REFRESH_TOKEN=${tokens.refresh_token}`);
  console.log('\nAlso add:');
  console.log('GOOGLE_PHOTOS_ALBUM_ID=<your shared album ID>');
  console.log('CRON_SECRET=<any random string, e.g. openssl rand -hex 32>');
  console.log('');
});

server.listen(9876);
