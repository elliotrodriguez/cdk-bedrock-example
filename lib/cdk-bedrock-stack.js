const { Stack, Duration, aws_iam, aws_lambda, aws_lambda_nodejs } = require('aws-cdk-lib');
const path = require('path')
// const sqs = require('aws-cdk-lib/aws-sqs');

class CdkBedrockStack extends Stack {
  /**
   *
   * @param {Construct} scope
   * @param {string} id
   * @param {StackProps=} props
   */
  constructor(scope, id, props) {
    super(scope, id, props);

    // The code that defines your stack goes here
   
    const bedrockLambda = new aws_lambda_nodejs.NodejsFunction(
      this,
      "BedrockLambda",
      {
          code: aws_lambda.Code.fromAsset("./src"),
          runtime: aws_lambda.Runtime.NODEJS_16_X,
          handler: "handler",
          entry: path.join(__dirname, "../src/index.js"),
          bundling: {
              forceDockerBundling: false
          },
          timeout: Duration.seconds(90)
      }
  )

  bedrockLambda.addToRolePolicy(
      new aws_iam.PolicyStatement({
          effect: aws_iam.Effect.ALLOW,
          actions: [
              "bedrock:InvokeModel"
          ],
          resources: ["*"]
      })
  )
    // example resource
    // const queue = new sqs.Queue(this, 'CdkBedrockQueue', {
    //   visibilityTimeout: Duration.seconds(300)
    // });
  }
}

module.exports = { CdkBedrockStack }
