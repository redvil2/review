import crypto from 'crypto';
import querystring from 'querystring';
import url from 'url';

import { trcpEventEmitter } from '../../trpc/context';

export const wechatVerifyHandler = (req, res) => {
  const queryObj = querystring.parse(url.parse(req.url).query || '');
  const signature = queryObj.signature,
    timestamp = queryObj.timestamp,
    code = queryObj.code,
    state = queryObj.state,
    nonce = queryObj.nonce,
    echostr = queryObj.echostr;

  const sha1 = crypto.createHash('sha1'),
    sha1Str = sha1
      .update([process.env.WECHAT_TOKEN, timestamp, nonce].sort().join(''))
      .digest('hex');

  console.log('received wechat callback: ' + req.url);
  if (code) {
    trcpEventEmitter.emit('wechat_callback', { code, state });
  }

  res.writeHead(200, { 'Content-Type': 'text/plain' });
  return res.end(sha1Str === signature ? echostr : '');
};
