import { Difficulty, TutorialModule } from './types';

export const TUTORIAL_MODULES: TutorialModule[] = [
  {
    id: 'intro-to-cac',
    title: 'Introduction to Compliance as Code',
    slug: 'intro-to-cac',
    description: 'Learn the fundamentals of automating compliance checks and the benefits of Shift-Left security.',
    difficulty: Difficulty.BEGINNER,
    estimatedTime: '10 mins',
    steps: [
      {
        id: 'what-is-cac',
        title: 'What is Compliance as Code?',
        description: 'Compliance as Code (CaC) is the automation of the auditing, security, and compliance testing of your software and infrastructure.',
        codeSnippet: `// Example: Traditional vs CaC
// Traditional: Manual audit checklist in Excel
// CaC: Automated Rego policy checking Terraform plan`,
        language: 'javascript'
      },
      {
        id: 'setup-opa',
        title: 'Install Open Policy Agent (OPA)',
        description: 'OPA is a general-purpose policy engine. Let\'s simulate the installation.',
        command: 'curl -L -o opa https://openpolicyagent.org/downloads/v0.61.0/opa_linux_amd64_static && chmod 755 opa',
        expectedOutput: 'opa binary successfully downloaded and permissions set.'
      }
    ]
  },
  {
    id: 'iac-scanning',
    title: 'Infrastructure as Code Scanning',
    slug: 'iac-scanning',
    description: 'Scanning Terraform files for security vulnerabilities and compliance gaps.',
    difficulty: Difficulty.INTERMEDIATE,
    estimatedTime: '20 mins',
    steps: [
      {
        id: 'tf-vulnerability',
        title: 'Identifying a vulnerability',
        description: 'Look at this Terraform snippet. It has a public S3 bucket, which is a compliance violation.',
        codeSnippet: `resource "aws_s3_bucket" "public_bucket" {
  bucket = "my-public-data"
  acl    = "public-read" # VIOLATION
}`,
        language: 'hcl'
      },
      {
        id: 'rego-policy',
        title: 'Writing a Rego Policy',
        description: 'Now, write a Rego policy to detect this public read ACL.',
        codeSnippet: `package terraform.analysis

deny[msg] {
  resource := input.resource_changes[_]
  resource.type == "aws_s3_bucket"
  resource.change.after.acl == "public-read"
  msg = sprintf("S3 bucket %v should not be public", [resource.address])
}`,
        language: 'rego'
      },
      {
        id: 'run-test',
        title: 'Run Policy Check',
        description: 'Execute OPA to check the terraform plan against the policy.',
        command: 'opa eval --data policy.rego --input plan.json "data.terraform.analysis.deny"',
        expectedOutput: '[ "S3 bucket aws_s3_bucket.public_bucket should not be public" ]'
      }
    ]
  },
  {
    id: 'container-security',
    title: 'Container Compliance',
    slug: 'container-security',
    description: 'Ensuring Docker images comply with security standards before deployment.',
    difficulty: Difficulty.INTERMEDIATE,
    estimatedTime: '15 mins',
    steps: [
      {
        id: 'trivy-scan',
        title: 'Scanning with Trivy',
        description: 'Use Trivy to scan a Docker image for vulnerabilities.',
        command: 'trivy image nginx:latest',
        expectedOutput: 'Total: 25 (UNKNOWN: 0, LOW: 12, MEDIUM: 10, HIGH: 3, CRITICAL: 0)'
      }
    ]
  }
];
