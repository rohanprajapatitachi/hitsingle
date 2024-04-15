const axios = require("axios");
const fs = require("fs");
const arr = [
  "6605cdbdf62e26c4a5f735fd"
]

const awaitTimer = (ms) => new Promise((res) => setTimeout(res, ms));
const run = async () => {
  let countDone = 0;
  let countFailed = 0;
  let failedLoads = [];
  let failedIds = [];
  for (let i = 0; i < arr.length; i++) {
    const config = {
      method: "POST",
      url: `https://trackos-devapi.axle.network/api/scheduler/single/${arr[i]}`,
      timeout: 6000,
      data: {
        isEir: true,
      },
    };
    const response = await axios(config).catch((err) => {
      // console.error(err);
      failedLoads.push(err);
      failedIds.push(arr[i]);
    });
    console.log(arr[i]);
    if (response?.status === 200) {
      console.log("done+++++++++++++++++++++++", countDone);
      countDone++;
    } else {
      console.log("failed----------------------", countFailed);
      if (!failedIds.includes(arr[i])) {
        failedLoads.push(arr[i]);
        failedIds.push(arr[i]);
      }
      countFailed++;
    }
    await awaitTimer(4000);
  }
  console.log("Total Success", countDone);
  console.log("total failed", countFailed);
  console.log("Total failed ids", failedIds);
  if (failedLoads.length) {
    fs.writeFileSync(
      __dirname + "/failedHitSingles.json",
      JSON.stringify(failedLoads)
    );
    // console.log("failed hit singles: ", JSON.stringify(failedLoads));
  }
};
run();