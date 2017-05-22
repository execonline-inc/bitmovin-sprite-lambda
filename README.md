# bitmovin-sprite-lambda
 The bitmovin-sprite-lambda is a lambda function that allows for asynchronous sprite creation for completed bitmovin encoding jobs.  This function is triggered by a bitmovin notification when a bitmovin encoding job finishes transfering to our S3 bucket.  The lambda parses the jobId and outputUrl from the message, creates a sprite, and outputs the created vtt and jpg files to the appropriate folder on S3.
 
# Setup

`npm install`

# Deploy

## Development

`SLS_DEBUG='*' serverless webpack invoke --function test` to test with serverless locally. You may need to set SLS_DEBUG: `export SLS_DEBUG='*'`

## Staging

1. `serverless deploy --stage staging --verbose`
1. Configure lambda: add any environment variables and values, adjust the timeout if needed (up to 5 minutes), enable a trigger for your function, add a test event (json).

## Production

1. `serverless deploy --stage production --verbose`
1. Configure lambda: add any environment variables and values, adjust the timeout if needed (up to 5 minutes), enable a trigger for your function, add a test event (json).
