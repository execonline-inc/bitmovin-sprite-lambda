const createSprite = (bitcodin, jobId) => {
  let spriteConfig = {
    "jobId": parseInt(jobId),
    "height": 120,
    "width": 160,
    "distance": 5,
    "async": true
  }
  return bitcodin.sprite.create(spriteConfig)
}

const getUrl = (url, rp) => {
  const requestParams = {
    url: url,
    encoding: null,
    resolveWithFullResponse: true
  }
  return rp(requestParams);
}

const transferToS3 = (res, message, fileType) => {
  const AWS = require('aws-sdk');
  const outputPath = message.payload.outputUrl.match(/[0-9]{2,}_[A-z 0-9]+$/)[0];
  const bucket = process.env.STAGING_VIDEO_BUCKET
  const key = 'bitmovin/' + outputPath + fileType;
  const s3 = new AWS.S3({
                  region: 'us-east-1',
                  accessKeyId: process.env.AWS_KEY,
                  secretAccessKey: process.env.AWS_SECRECY_KEY
                        });

  let params = {
    Bucket: bucket,
    Key: key,
    Body: res.body,
    ContentType: res.headers['content-type'],
    ContentLength: res.headers['content-length'],
    ACL: 'public-read'
  }

  const s3Promise = s3.putObject(params).promise();
  return s3Promise
}

const getJpgName = (res) => {
  const rawJpgName = res.spriteUrl.match(/sprites\/.*/)[0]
  const jpgName = rawJpgName.replace('sprites', '')
  return jpgName;
}

class BitmovinSpriteLambda {
  start = (message) => {
    const jobId = message.payload.jobId;
    const bitcodin = require('bitcodin')(process.env.BITMOVIN_API_TOKEN);
    const rp = require('request-promise');
    const vttName = '/sprite.vtt'
    return createSprite(bitcodin, jobId)
      .then((res) => {
        return Promise.all([getUrl(res.spriteUrl, rp), getUrl(res.vttUrl, rp), getJpgName(res)]);
      })
      .then((res) => {
        const jpgName = res[2]
        console.log('Successfully requested sprite information')
        return Promise.all([transferToS3(res[0], message, jpgName), transferToS3(res[1], message, vttName)]);
      }
    );
  }
}

export default BitmovinSpriteLambda;
