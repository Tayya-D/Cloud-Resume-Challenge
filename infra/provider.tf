terraform {
    required_providers {
        aws = {
            source  = "hashicorp/aws"
            version = ">= 4.9.0"  
            }
    }
}

provider "aws" {
    profile = "dev"
    # access_key = secrets.AWS_ACCESS_KEY_ID
    # secret_key = secrets.AWS_SECRET_ACCESS_KEY
    region = "eu-west-2" # Specify the AWS region (e.g., us-east-1, us-west-2)
}