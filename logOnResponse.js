export default function logOnResponse(req, res, next) {
  let actualResSend = res.send;
  let actualResSendStatus = res.sendStatus;
  let actualResJson = res.json;

  req.timeStart = new Date();

  res.json = (theData) => {
    console.log('RESPONSE', req.url, getTime(req));

    // saveTheData(theData);
    res.json = actualResJson;
    res.json(theData);
  };

  res.send = (theData) => {
    console.log('RESPONSE ', req.url, getTime(req));
    res.send = actualResSend;
    res.send(theData);
  };

  res.sendStatus = (theData) => {
    console.log('RESPONSE ', req.url, getTime(req));
    res.sendStatus = actualResSendStatus;
    res.sendStatus(theData);
  };

  next();
}

function getTime(req) {
  var timeStop = new Date();
  return '| Time: ' + (timeStop - req.timeStart) + 'ms';
}
