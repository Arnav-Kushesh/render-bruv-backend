function logReqAndRes(req, res, next) {
  var id = new mongoose.Types.ObjectId();

  req.logID = id;

  let theLogData = {
    method: req.method,
    url: req.url,
    hostname: req.hostname,
    reqPayload: req.body,
    appName: req.appName,
  };

  if (req.user) {
    theLogData.userId = req.user._id;
    theLogData.username = req.user.username;
    theLogData.name = req.user.name;
  }

  theLogData.reqPayloadSize = 0;

  if (req.body) {
    const size = Buffer.byteLength(JSON.stringify(req.body));
    theLogData.reqPayloadSize = size;
  }

  Log.findOneAndUpdate({ _id: id }, theLogData, { upsert: true }).then(() => {
    // console.log("Log req Saved");
  });

  let actualResSend = res.send;
  let actulResJson = res.json;

  res.json = (theData) => {
    // console.log(theData)

    saveTheData(theData);
    res.json = actulResJson;
    res.json(theData);
  };

  res.send = (theData) => {
    saveTheData(theData);
    res.send = actualResSend;
    res.send(theData);
  };

  function saveTheData(resData) {
    try {
      let jsonRes = JSON.parse(resData);
      resData = jsonRes;
    } catch {
      resData = { nonObjRes: resData };
    }

    let resDataSize = 0;

    if (resData) {
      resDataSize = Buffer.byteLength(JSON.stringify(resData));
    }

    Log.findOneAndUpdate(
      { _id: id },
      { resData, resDataSize },
      { upsert: true }
    ).then(() => {
      // console.log("Log res Saved");
    });
  }

  next();
}
