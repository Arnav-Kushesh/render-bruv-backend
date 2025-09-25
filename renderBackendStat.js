export default function renderBackendStat(req, res, next) {
  let theStat = { version: global.appVersion };

  const formatMemoryUsage = (data) =>
    `${Math.round((data / 1024 / 1024) * 100) / 100} MB`;

  let memoryData = process.memoryUsage();

  theStat.memoryUsage = {
    rss: `${formatMemoryUsage(
      memoryData.rss
    )} -> Resident Set Size - total memory allocated for the process execution`,
    heapTotal: `${formatMemoryUsage(
      memoryData.heapTotal
    )} -> total size of the allocated heap`,
    heapUsed: `${formatMemoryUsage(
      memoryData.heapUsed
    )} -> actual memory used during the execution`,
    external: `${formatMemoryUsage(memoryData.external)} -> V8 external memory`,
  };

  theStat.reqStat = {
    reqPerMinute: `${global.reqPerMinute} -> Request Per Minute`,
    totalReq: `${global.totalReq} -> Total Req.`,
  };

  return res.json(theStat);
}
