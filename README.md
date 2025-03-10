# Cloud-Resume-Challenge

## Description
Following the Cloud Resume Challenge - I have put together my CV using a template that I liked as the base and then editted it to how I liked.
This included removing a lot of the pages included in the initial template and amending the code for the design and content via HTML and CSS.

## Prerequisites
- Have an AWS Account  
- Have VSCode setup
- Have a GitHub Account

## Breakdown and Walkthrough of the Challenge
1) Create your Resume/CV with HTML and CSS (COMPLETE)

2) Create a static Website deloyed on AWS S3 (COMPLETE)
   - Changed region to Europe(London) for faster load times
   - Named S3 bucket <name>-cloud-resume-challenge (fyi AWS doesn't accepts names w/ caps)
   - Add a tag with "Key: project" and "Value: Cloud Resume Challenge"
   - Set default encryption 
   - Upload website folder
   - Set "Static website hosting" to "Enable" in the Properties of the S3 Bucket and set the index document name to index.html (if yours is different make sure you use the right filename) + save changes (UPDATE - can set this to Disabled)
   - Navigate to your index.html in Objects in your S3 Bucket - click on the Object URL (you should get a XML file error - beacuse the bucket is not public. We can fix this via CloudFront in the next step) 

3) Website should use HTTPS for security via AWS CloudFront (COMPLETE) 
   - CloudFront is an AWS service that helps deliver data at a low latency and higher transfer speed.
   - Navigate to CloudFront, create distribution > origin domain is Your_S3_Bucket.s3.your_region.amazonaws.com
   - Set Origin access to "Origin access control settings(recommended)" 
      - This gives your CloudFront distribution access to your S3 Bucket to read objects (Right now nothing has access to read anything from your S3 Bucket. But origin access control setting allows the distribution to access the S3 Bucket)
      - Origin access control > create new AOC (CloudFront will provide a policy statement after the distribution has been created)
      - Viewer protocol policy > Allow only HTTPS access 
      - Create distribution > Copy the policy CloudFront provides to update your S3 Bucket with
      - Open a new AWS console window > S3 > your_bucket > Permissions > Edit Bucket Policy + paste the copied CloudFront policy > save changes (it should look like something like the cloudfrontpolicy.json file in this repo)
      - UPDATE - Set a Default root object > set as your index.html (this will point the distibution to the desired page - in this case its our cv)
      - At this point you can test the distribution URL to see if your resume loads
         - I had an issue where I encountered an "Access Denied" error message and proceeded to troubleshoot and went as far as to create an AppendIndexHTML function - the issue still persisted. 
         - The issue was that all my files (including the index.html) were in a parent folder. So I deleted everything in the bucket and reuploaded the files as the are; the only folder I had was the /images folder --> this ended up fixing my "Access Denied" error and fully loaded my resume as expected.  

4) Create a custom DNS domain name via AWS Route53 + AWS Certficate Management (ACM) (COMPLETE)
   - This step will also us to set a custom URL for our website
   - Navigate to Route 53 > register domain > enter domain name (I chose "<name>.click" - this only costs £3 to run yearly) > checkout (I set auto-renew to No - I'll see where I am in a year and renew if I want when the time comes)
   - It took about 10 minutes for the domain to be registered
   - You do need to verify your email to avoid domain suspension - you can click "send email again" from your registered domain's page to get the email sent out if you didn't already get it (it took about 5 minutes for it to get to my inbox)
   - In the CloudFront settings for your distribution, the Alternate domain names is not set. Select edit and Add item under CNAME (I chose resume.<name>.click)
   - Request SSL Certificate > Request a public cert > Set fully qualified domain name (I set this as *.<name>.click  The wildcard (*.) will allow you to use this SSL for other domain ending in "<name>.click") > set tags "key: project" and "value: Cloud Resume Challenge" > Request and wait for validation 
      - DNS Validation: If you're using DNS validation (which we are), the process is usually quicker, especially if you're using Amazon Route 53 as your DNS provider.
      - After adding the required CNAME records, validation can often complete within minutes to a few hours - However, it's important to note that while the validation process itself may be quick, the certificate status might continue to display as "Pending validation" for up to 30 minutes, even after successful validation. (so its a waiting game rn -> validation completed after 4.5 hours)
   - After the validation has completed, you can select the SSL certificate from the drop down list in the distributions' settings > save changes
   - After the distribution changes have finished deploying, you should be able to access your resume via the alternate domain name (in this case its resume.<name>.click)
      - This did not work for me and the problem lies in Route53; as it seems that it has not updated automatically with our CNAME. So I needed to add it manually via Hosted Zones > <name>.click > create record > add the record name for the subdomain (in this case its "resume") > Alias = on > Endpoint = "Alias to ClouFront distribution" > distribution = select your created distribution (resume.<name>.click) > create record 
      - check if you can access your resume via your alternate name (it will take some time for the DNS to propogate so try after a few minutes - it took about 8 minutes for me and was successfully able to access my resume site via the CNAME) 
      - A nice to have before this point would be to be able to use the AWS Tools Powershell so that I could check the change status of the DNS via a command like: "Get-R53HostedZone -Id YOUR_HOSTED_ZONE_ID", in the output, there would have been ChangeInfo section - from here I could have seen that status of the change
      - You can also check to see your working SSL thats being used by the site via the lock icon on the left side of the URL bar, next to the starting https

5) Create a visitor counter via JavaScript
   - Back the code editor - create a new file for index.js and code a asyn function that fetches the counter (or in our case the number of views from the AWS DynamoDB we created) The code used is in the index.js folder in this repo. Also added a script to the index.html file to call the index.js file to run the function.

6) Create a AWS DynamoDB to store and update the counter (COMPLETE)
   - Navigate to the DynamoDB service (I changed the region to Europe-London) > create table > Table name = "cloudresume-test" > partition key = "id" > tags key: "project" value: "Cloud Resume Challenge" > create table
   - Once it has been created, click on the table and select "Explore table items" (we currently have no items - we want to create an item that updates and keeps track of the number of users that have visited our site - called "views" for example)
   - Go back to the tables console for your table and under Actions select Create item > id value = "0" > add new attribute (Number) > Attribute name = "views" and value = "1" > create item

7) Create an API that accepts requests from your web app and communicate with the DB using AWS API Gateway and Lambda (COMPLETE)
   - Navigate to Lambda > create a function > Function Name = "cloudresume-test-api" > Runtime (I chose python 3.12 since that is what I'll be using to code the function) > Execution role (I'll be allowing a creation of a new role with basic Lambda permissions - if you already have a role that does this, you can just choose that instead) > under additional configs, select "Enable function URL" (This will give you a public URL that you can invoke your Lambda function through) > Auth type = NONE (this does mean anyone can call my API but we will be enabling CORS) > tick "Configure cross-origin resource sharing (CORS)" - this will allow us to WHITELIST our domain resume.<name>.click and this will be the only URL that will be allowed to FETCH data from this API > add the usual tags "project" and "Cloud Resume Challenge" > create function
   - The provided Function URL will show you the output from your Lambda function
   - Now we can add the code that call the views item from our DynamoDB table, update and return/print the value (I have included the lambda function code in this repo - although the AWS code editor was intelligent enough where I only had to type in 1 or 2 letters before I could just tab and auto complete the rest of the function code anyway - I did have to correct the "ID"s for "id"s and "view"s for "views" though and change the Table('cloud-resume-challenge'); which isn't a table I created btw, to Table('cloudresume-test'), since thats what I use in the table; its always good to check the code yourself and not trust the AI completely) > once satisfied deploy the function code
      - The table still was not being updated so I checked the configuration for the Lambda and its function URL
         - I though at first it might be because of the invoke mode but even after changing it I still got an "Internal Server Error"
         - I couldn't see anything else wrong with the function itself so it might actually be the basic IAM role that was automatically created
         - Looking at the Permissions tab of the Lambda function > clicking on the execution role name > we'll see it only has the AWSLambdaBasicExecutionRole and nothing else (it needs another policy to allow it to access and update the DynamoDB)
         - Click on Add permissions and select the AmazonDynamoDBFullAccess (which allow both read and write permissions) --> And me, it still didn't work after testing
         - After a bit more reading and research - I found that the both the Lambda and the DynamoDB had to be in the SAME REGION (my DB was in Europe(London) and the initial Lambda was in USA(N.Virginia)) -> So I recreated the same Lambda function this time called "cloud-resume-challenge-get_count" in the region EUROPE(LONDON) and it worked; printing the updated counter "2" and we can see the same in the DynamoDB table (if you have AWS Tools for Powershell configured - you could curl your lambda function url and it'll return the number of views 'curl <lambda_function_url>')


8) Use Python to code your Lambda functions

9) Include some tests in your Python code 

10) Configure your API resources using Infrastructure as Code via Terraform
11) Create a GitHub repo to manage your CI/CD Back-End + GitHub Actions
12) Create a GitHub repo to manage your CI/CD Front-End to for your website + GitHub Actions

## Installation
1. Clone the repository:
   ```sh
   git clone https://github.com/Tayya-D/Cloud-Resume-Challenge.git