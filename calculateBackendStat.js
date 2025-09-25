global.totalReq = 0;
global.reqPerMinute = 0;

setInterval(() => {
  global.reqPerMinute = 0;
}, 1000 * 60);

export default function calculateBackendStat(req, res, next) {
  global.reqPerMinute++;
  global.totalReq++;

  if (next) next();
}
