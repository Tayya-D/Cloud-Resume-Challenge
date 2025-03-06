# Cloud-Resume-Challenge

## Description
Following the Cloud Resume Challenge - I have put together my CV using a template that I liked as the base and then editted it to how I liked.
This included removing a lot of the pages included in the initial template and amending the code for the design and content via HTML and CSS.

## Breakdown and Walkthrough of the Challenge
1) Create your Resume/CV with HTML and CSS (COMPLETE)
2) Create a static Website deloyed on AWS S3 (COMPLETE)
   - Changed region to Europe(London) for faster load times
   - Named S3 bucket <name>-cloud-resume-challenge (fyi AWS doesn't accepts names w/ caps)
   - Add a tag with "Key: project" and "Value: Cloud Resume Challenge"
   - Set default encryption 
   - Upload website folder
   - Set "Static website hosting" to "Enable" in the Properties of the S3 Bucket and set the index document name to index.html (if yours is different make sure you use the right filename) + save changes
   - Navigate to your index.html in Objects in your S3 Bucket - click on the Object URL (you should get a XML file error - beacuse the bucket is not public. We can fix this via CloudFront in the next step) 
3) Website should use HTTPS for security via AWS CloudFront 
   - CloudFront is an AWS service that helps deliver data at a low latency and higher transfer speed.
   - Navigate to CloudFront, create distribution > origin domain is Your_S3_Bucket.s3.your_region.amazonaws.com
   - Set Origin access to "Origin access control settings(recommended)" 
      - This gives your CloudFront distribution access to your S3 Bucket to read objects (Right now nothing has access to read anything from your S3 Bucket. But origin access control setting allows the distribution to access the S3 Bucket)
      - Origin access control > create new AOC (CloudFront will provide a policy statement after the distribution has been created)
      - Viewer protocol policy > Allow only HTTPS access 
      - Create distribution > Copy the policy CloudFront provides to update your S3 Bucket with
      - Open a new AWS console window > S3 > your_bucket > Permissions > Edit Bucket Policy + paste the copied CloudFront policy > save changes (it should look like something like the cloudfrontpolicy.json file in this repo)
4) Create a custom DNS domain name via AWS Route53
5) Create a visitor counter via JavaScript
6) Create a AWS DynamoDB to store and update the counter
7) Create an API that accepts requests from your web app and communicate with the DB using AWS API Gateway and Lambda
8) Use Python to code your Lambda functions
9) Include some tests in your Python code 
10) Configure your API resources using Infrastructure as Code via Terraform
11) Create a GitHub repo to manage your CI/CD Back-End + GitHub Actions
12) Create a GitHub repo to manage your CI/CD Front-End to for your website + GitHub Actions

## Installation
1. Clone the repository:
   ```sh
   git clone https://github.com/Tayya-D/Cloud-Resume-Challenge.git