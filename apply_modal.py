import re

def update_portfolio():
    with open('index.html', 'r') as f:
        html = f.read()

    # 1. Update action buttons in cards
    html = html.replace(
        '<span class="text-xs font-semibold text-emerald-700">✓ Live Project</span>',
        '<button onclick="openProjectModal(\'cloudfront-s3\')" class="px-3.5 py-1.5 rounded-full text-xs font-semibold text-emerald-800 bg-emerald-50 border border-emerald-200 hover:bg-emerald-100 transition-all cursor-pointer flex items-center gap-1 shadow-2xs">✓ Live Project ↗</button>'
    )

    html = html.replace(
        '<span class="text-xs font-semibold text-emerald-700">✓ Deployed</span>',
        '<button onclick="openProjectModal(\'serverless-resume\')" class="px-3.5 py-1.5 rounded-full text-xs font-semibold text-emerald-800 bg-emerald-50 border border-emerald-200 hover:bg-emerald-100 transition-all cursor-pointer flex items-center gap-1 shadow-2xs">✓ Deployed ↗</button>'
    )

    cs_count = 0
    def replace_case_study(match):
        nonlocal cs_count
        cs_count += 1
        ids = ['multiregion-aws', 'terraform-pipeline', 'ubuntu-hardening']
        proj_id = ids[cs_count - 1] if cs_count <= len(ids) else 'multiregion-aws'
        return f'<button onclick="openProjectModal(\'{proj_id}\')" class="px-3.5 py-1.5 rounded-full text-xs font-semibold text-stone-900 bg-stone-100 border border-stone-200 hover:bg-stone-200 transition-all cursor-pointer flex items-center gap-1 shadow-2xs">Case Study ↗</button>'

    html = re.sub(r'<span class="text-xs font-semibold text-stone-900">Case Study</span>', replace_case_study, html)

    html = html.replace(
        '<a href="https://github.com/hritiksah00/server-health-monitor" target="_blank" rel="noopener" class="text-xs font-semibold text-stone-900 hover:text-stone-600 flex items-center gap-1">View on GitHub ↗</a>',
        '<button onclick="openProjectModal(\'server-monitor\')" class="px-3.5 py-1.5 rounded-full text-xs font-semibold text-stone-900 bg-stone-200/80 border border-stone-300 hover:bg-stone-300 transition-all cursor-pointer flex items-center gap-1 shadow-2xs">View Details ↗</button>'
    )

    html = html.replace(
        '<a href="https://github.com/hritiksah00/PFM" target="_blank" rel="noopener" class="text-xs font-semibold text-stone-900 hover:text-stone-600 flex items-center gap-1">View on GitHub ↗</a>',
        '<button onclick="openProjectModal(\'pfm-finance\')" class="px-3.5 py-1.5 rounded-full text-xs font-semibold text-stone-900 bg-stone-200/80 border border-stone-300 hover:bg-stone-300 transition-all cursor-pointer flex items-center gap-1 shadow-2xs">View Details ↗</button>'
    )

    # 2. Add Modal CSS
    css_to_add = '''
    /* Modal Animation Styles */
    .modal-backdrop-active { opacity: 1 !important; pointer-events: auto !important; }
    .modal-container-active { opacity: 1 !important; transform: scale(1) translateY(0) !important; }
    body.modal-open { overflow: hidden !important; }
'''
    if 'body.modal-open' not in html:
        html = html.replace('</style>', css_to_add + '\n  </style>')

    # 3. Add Modal HTML Structure
    modal_html = '''
    <!-- Dynamic Project Details Modal -->
    <div id="project-modal" class="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 opacity-0 pointer-events-none transition-opacity duration-300 ease-in-out">
        <!-- Backdrop Overlay -->
        <div id="modal-backdrop" onclick="closeProjectModal()" class="absolute inset-0 bg-stone-900/65 backdrop-blur-sm cursor-pointer"></div>

        <!-- Modal Dialog Window -->
        <div id="modal-container" class="relative bg-[#FAF8F5] border border-stone-200 rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] flex flex-col overflow-hidden transform scale-95 translate-y-4 opacity-0 transition-all duration-300 ease-out z-10">
            
            <!-- Modal Header -->
            <div class="px-6 py-5 border-b border-stone-200 flex items-center justify-between bg-white flex-shrink-0">
                <div class="flex items-center gap-3">
                    <span id="modal-badge" class="text-[10px] font-bold tracking-widest uppercase px-2.5 py-1 rounded-full bg-stone-900 text-white shadow-2xs">PROJECT DETAILS</span>
                    <span id="modal-category-text" class="text-xs text-stone-500 font-mono font-medium">AWS Infrastructure</span>
                </div>
                <!-- Close Button (X) -->
                <button onclick="closeProjectModal()" class="w-9 h-9 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-600 hover:text-stone-900 flex items-center justify-center transition-colors focus:outline-none cursor-pointer" aria-label="Close modal">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                </button>
            </div>

            <!-- Modal Body Content (Scrollable) -->
            <div class="p-6 md:p-8 overflow-y-auto space-y-6 text-stone-800">
                <!-- Project Title & Subtitle -->
                <div>
                    <h2 id="modal-title" class="text-2xl md:text-3xl font-bold text-stone-950 tracking-tight mb-1">Project Title</h2>
                    <p id="modal-subtitle" class="text-xs text-stone-500 font-semibold uppercase tracking-wider">Role / Overview</p>
                </div>

                <!-- Detailed Description Area -->
                <div>
                    <h4 class="text-xs font-bold uppercase tracking-wider text-stone-500 mb-2">Detailed Overview &amp; Key Learnings</h4>
                    <div id="modal-description" class="text-sm leading-relaxed text-stone-700 space-y-3 bg-white p-5 rounded-xl border border-stone-200 shadow-2xs">
                        <!-- Dynamic Description HTML -->
                    </div>
                </div>

                <!-- Cloud Architecture Diagram Section -->
                <div id="modal-arch-section">
                    <div class="flex items-center justify-between mb-2">
                        <h4 class="text-xs font-bold uppercase tracking-wider text-stone-500">Cloud Architecture Diagram</h4>
                        <span class="text-[10px] font-mono text-sky-700 font-semibold">AWS / System Topology</span>
                    </div>
                    <div id="modal-arch-container" class="rounded-xl overflow-hidden border border-stone-200 bg-stone-950 p-3 shadow-2xs">
                        <!-- Dynamic Architecture Diagram (SVG) -->
                    </div>
                </div>

                <!-- Screenshots / Previews Section -->
                <div id="modal-screenshots-section">
                    <h4 class="text-xs font-bold uppercase tracking-wider text-stone-500 mb-2">Screenshots &amp; UI Previews</h4>
                    <div id="modal-screenshots-container" class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <!-- Dynamic Screenshots -->
                    </div>
                </div>

                <!-- Infrastructure Code Snippets Section -->
                <div id="modal-code-section">
                    <div class="flex items-center justify-between mb-2">
                        <h4 class="text-xs font-bold uppercase tracking-wider text-stone-500">Infrastructure Code Snippet</h4>
                        <span id="modal-code-lang" class="text-[10px] font-mono text-stone-500 font-medium">Terraform / HCL</span>
                    </div>
                    <div class="relative rounded-xl overflow-hidden bg-stone-900 border border-stone-800 text-stone-200">
                        <pre class="p-4 text-xs font-mono overflow-x-auto leading-relaxed"><code id="modal-code-content">// Infrastructure definition code snippet...</code></pre>
                    </div>
                </div>
            </div>

            <!-- Modal Footer -->
            <div class="px-6 py-4 border-t border-stone-200 bg-white flex flex-col sm:flex-row items-center justify-between gap-4 flex-shrink-0">
                <div id="modal-tags" class="flex gap-1.5 flex-wrap">
                    <!-- Stack Tags -->
                </div>
                <div class="flex items-center gap-3 w-full sm:w-auto justify-end">
                    <button onclick="closeProjectModal()" class="px-5 py-2.5 rounded-full text-xs font-semibold border border-stone-300 text-stone-700 hover:bg-stone-100 transition-all cursor-pointer">Close</button>
                    <a id="modal-action-btn" href="#" target="_blank" rel="noopener" class="px-6 py-2.5 rounded-full text-xs font-semibold bg-stone-900 hover:bg-stone-800 text-white transition-all shadow-sm flex items-center justify-center gap-1.5">
                        <span id="modal-action-text">View Live</span>
                        <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path></svg>
                    </a>
                </div>
            </div>
        </div>
    </div>
'''

    # 4. Add JavaScript logic
    js_code = '''
        // Project Details Data Store for Dynamic Modal
        const PROJECT_MODAL_DATA = {
            'cloudfront-s3': {
                title: 'Global Website Deployment via AWS S3 & CloudFront CDN',
                badge: 'AWS FEATURED PROJECT',
                category: 'AWS CloudFront & S3',
                role: 'Cloud Infrastructure Architect',
                description: `
                    <p>Designed and deployed a highly available, globally distributed static website hosting infrastructure leveraging Amazon S3 as origin storage and AWS CloudFront CDN for edge caching across 600+ Points of Presence (PoPs).</p>
                    <p><strong>Security Hardening:</strong> Configured Origin Access Control (OAC) to completely block direct public access to the S3 bucket, forcing all traffic through CloudFront edge locations with ACM SSL/TLS certificates and Route 53 custom domain DNS routing.</p>
                `,
                archSvg: `
                    <svg width="100%" height="180" viewBox="0 0 600 180" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <rect width="600" height="180" rx="8" fill="#1C1917"/>
                        <rect x="25" y="70" width="85" height="40" rx="6" fill="#292524" stroke="#38BDF8" stroke-width="1.5"/>
                        <text x="67.5" y="94" font-family="sans-serif" font-size="10" font-weight="600" fill="#F8FAFC" text-anchor="middle">Users / Clients</text>
                        <rect x="150" y="20" width="110" height="36" rx="6" fill="#292524" stroke="#F59E0B" stroke-width="1.5"/>
                        <text x="205" y="42" font-family="sans-serif" font-size="10" font-weight="600" fill="#F59E0B" text-anchor="middle">Route 53 DNS</text>
                        <rect x="290" y="50" width="140" height="80" rx="8" fill="#0284C7" stroke="#38BDF8" stroke-width="2"/>
                        <text x="360" y="80" font-family="sans-serif" font-size="12" font-weight="bold" fill="#FFFFFF" text-anchor="middle">AWS CloudFront CDN</text>
                        <text x="360" y="98" font-family="sans-serif" font-size="9" fill="#E0F2FE" text-anchor="middle">Global Edge Cache</text>
                        <text x="360" y="113" font-family="sans-serif" font-size="9" fill="#BAE6FD" text-anchor="middle">ACM SSL Encryption</text>
                        <rect x="475" y="70" width="100" height="40" rx="6" fill="#292524" stroke="#10B981" stroke-width="1.5"/>
                        <text x="525" y="94" font-family="sans-serif" font-size="10" font-weight="600" fill="#10B981" text-anchor="middle">Amazon S3 Origin</text>
                        <path d="M110 90 H290" stroke="#38BDF8" stroke-width="2"/>
                        <path d="M205 56 V90" stroke="#F59E0B" stroke-width="1.5" stroke-dasharray="3 3"/>
                        <path d="M430 90 H475" stroke="#10B981" stroke-width="2"/>
                    </svg>
                `,
                codeLang: 'S3 Origin Access Control (OAC) Policy',
                codeSnippet: `{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "AllowCloudFrontServicePrincipalReadOnly",
      "Effect": "Allow",
      "Principal": { "Service": "cloudfront.amazonaws.com" },
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::ritik-cloud-portfolio-origin/*",
      "Condition": {
        "StringEquals": {
          "AWS:SourceArn": "arn:aws:cloudfront::123456789012:distribution/EDFDV2608EXAMPLE"
        }
      }
    }
  ]
}`,
                screenshots: [
                    { title: 'CloudFront Edge Distribution', desc: 'Active edge cache deployment with sub-50ms latency.' },
                    { title: 'ACM TLS 1.3 Certificate', desc: 'Secure custom domain SSL certificate binding.' }
                ],
                tags: ['AWS CloudFront', 'Amazon S3', 'ACM SSL', 'Route 53', 'OAC Security'],
                actionText: 'View GitHub Profile',
                actionUrl: 'https://github.com/hritiksah00'
            },

            'serverless-resume': {
                title: 'Serverless Cloud Resume Website',
                badge: 'AWS SERVERLESS PROJECT',
                category: 'Amazon S3 & IAM Security',
                role: 'AWS Cloud Trainee',
                description: `
                    <p><strong>Overview & Hosting:</strong> Designed and deployed a highly available, serverless static resume website hosted on Amazon S3 to demonstrate foundational cloud infrastructure capabilities.</p>
                    <p><strong>Security & IAM:</strong> Authored custom JSON bucket policies and IAM access rules to enable secure public read access while restricting backend resource settings.</p>
                    <p><strong>Core Learnings:</strong> Gained hands-on experience in cloud storage architecture, object-level security management, and AWS console resource provisioning.</p>
                `,
                archSvg: `
                    <svg width="100%" height="160" viewBox="0 0 500 160" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <rect width="500" height="160" rx="8" fill="#1C1917"/>
                        <rect x="30" y="60" width="100" height="40" rx="6" fill="#292524" stroke="#10B981" stroke-width="1.5"/>
                        <text x="80" y="84" font-family="sans-serif" font-size="10" font-weight="600" fill="#10B981" text-anchor="middle">Browser User</text>
                        <rect x="200" y="45" width="120" height="70" rx="6" fill="#047857" stroke="#34D399" stroke-width="2"/>
                        <text x="260" y="75" font-family="sans-serif" font-size="11" font-weight="bold" fill="#FFFFFF" text-anchor="middle">Amazon S3 Bucket</text>
                        <text x="260" y="93" font-family="sans-serif" font-size="9" fill="#A7F3D0" text-anchor="middle">Static Website Hosting</text>
                        <rect x="370" y="60" width="100" height="40" rx="6" fill="#292524" stroke="#F59E0B" stroke-width="1.5"/>
                        <text x="420" y="84" font-family="sans-serif" font-size="10" font-weight="600" fill="#F59E0B" text-anchor="middle">AWS IAM Policy</text>
                        <path d="M130 80 H200" stroke="#10B981" stroke-width="2"/>
                        <path d="M320 80 H370" stroke="#F59E0B" stroke-width="1.5" stroke-dasharray="3 3"/>
                    </svg>
                `,
                codeLang: 'Amazon S3 Public Bucket Policy (JSON)',
                codeSnippet: `{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "PublicReadGetObject",
      "Effect": "Allow",
      "Principal": "*",
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::serverless-cloud-resume-ritik/*"
    }
  ]
}`,
                screenshots: [
                    { title: 'S3 Static Endpoint', desc: 'Bucket static web hosting enabled.' },
                    { title: 'IAM Policy Editor', desc: 'Custom JSON read permissions applied.' }
                ],
                tags: ['Amazon S3', 'AWS IAM', 'Serverless', 'HTML/CSS'],
                actionText: 'View GitHub Profile',
                actionUrl: 'https://github.com/hritiksah00'
            },

            'multiregion-aws': {
                title: 'AWS Multi-Region Auto-Scaling Stack',
                badge: 'HIGH AVAILABILITY STACK',
                category: 'AWS EC2, ALB & RDS',
                role: 'Cloud Systems Engineer',
                description: `
                    <p>Engineered a multi-region, fault-tolerant cloud architecture across <code>us-east-1</code> and <code>us-west-2</code> AWS regions to guarantee zero-downtime application availability.</p>
                    <p><strong>Traffic Routing & Failover:</strong> Configured Amazon Route 53 Latency Routing and Health Checks to automatically redirect web traffic to secondary active region during outages. Deployed EC2 Auto Scaling Groups behind Application Load Balancers with Multi-AZ RDS MySQL database replication.</p>
                `,
                archSvg: `
                    <svg width="100%" height="170" viewBox="0 0 550 170" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <rect width="550" height="170" rx="8" fill="#1C1917"/>
                        <rect x="210" y="15" width="130" height="35" rx="6" fill="#292524" stroke="#F59E0B" stroke-width="1.5"/>
                        <text x="275" y="37" font-family="sans-serif" font-size="10" font-weight="600" fill="#F59E0B" text-anchor="middle">Route 53 Latency Routing</text>
                        
                        <rect x="40" y="65" width="200" height="85" rx="6" fill="#1F2937" stroke="#38BDF8" stroke-width="1.5"/>
                        <text x="140" y="85" font-family="sans-serif" font-size="10" font-weight="bold" fill="#38BDF8" text-anchor="middle">Region A: us-east-1</text>
                        <text x="140" y="105" font-family="sans-serif" font-size="9" fill="#9CA3AF" text-anchor="middle">ALB + EC2 Auto Scaling Group</text>
                        <text x="140" y="125" font-family="sans-serif" font-size="9" fill="#10B981" text-anchor="middle">RDS Primary Database</text>

                        <rect x="310" y="65" width="200" height="85" rx="6" fill="#1F2937" stroke="#38BDF8" stroke-width="1.5"/>
                        <text x="410" y="85" font-family="sans-serif" font-size="10" font-weight="bold" fill="#38BDF8" text-anchor="middle">Region B: us-west-2</text>
                        <text x="410" y="105" font-family="sans-serif" font-size="9" fill="#9CA3AF" text-anchor="middle">ALB + EC2 Auto Scaling Group</text>
                        <text x="410" y="125" font-family="sans-serif" font-size="9" fill="#F59E0B" text-anchor="middle">RDS Multi-AZ Replica</text>

                        <path d="M275 50 L140 65" stroke="#F59E0B" stroke-width="1.5"/>
                        <path d="M275 50 L410 65" stroke="#F59E0B" stroke-width="1.5"/>
                        <path d="M240 125 H310" stroke="#10B981" stroke-width="1.5" stroke-dasharray="3 3"/>
                    </svg>
                `,
                codeLang: 'AWS Target Tracking Auto Scaling Policy',
                codeSnippet: `resource "aws_autoscaling_policy" "cpu_target_tracking" {
  name                   = "target-cpu-70-percent"
  autoscaling_group_name = aws_autoscaling_group.web_asg.name
  policy_type            = "TargetTrackingScaling"

  target_tracking_configuration {
    predefined_metric_specification {
      predefined_metric_type = "ASGAverageCPUUtilization"
    }
    target_value = 70.0
  }
}`,
                screenshots: [
                    { title: 'Target Group Health', desc: 'Dual-AZ EC2 instances pass HTTP health checks.' },
                    { title: 'Multi-AZ Database Failover', desc: 'Synchronous standby replica ready.' }
                ],
                tags: ['EC2 ASG', 'ALB', 'RDS Multi-AZ', 'Route 53', 'VPC Peering'],
                actionText: 'View GitHub Profile',
                actionUrl: 'https://github.com/hritiksah00'
            },

            'terraform-pipeline': {
                title: 'Terraform AWS GitOps Pipeline',
                badge: 'DEVOPS & IAC PIPELINE',
                category: 'Terraform & GitHub Actions',
                role: 'DevOps & IaC Specialist',
                description: `
                    <p>Built an automated Infrastructure as Code (IaC) GitOps delivery pipeline leveraging Terraform modules to provision AWS VPC subnets, Security Groups, and EC2 instances.</p>
                    <p><strong>State & Security Automation:</strong> Implemented remote state persistence using Amazon S3 with state locking via Amazon DynamoDB. Integrated Checkov and TFLint static security scanners directly into GitHub Actions workflows to catch misconfigurations before deployment.</p>
                `,
                archSvg: `
                    <svg width="100%" height="160" viewBox="0 0 520 160" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <rect width="520" height="160" rx="8" fill="#1C1917"/>
                        <rect x="25" y="60" width="100" height="40" rx="6" fill="#292524" stroke="#A855F7" stroke-width="1.5"/>
                        <text x="75" y="84" font-family="sans-serif" font-size="10" font-weight="600" fill="#A855F7" text-anchor="middle">Git Push / PR</text>
                        
                        <rect x="165" y="45" width="130" height="70" rx="6" fill="#581C87" stroke="#C084FC" stroke-width="2"/>
                        <text x="230" y="72" font-family="sans-serif" font-size="11" font-weight="bold" fill="#FFFFFF" text-anchor="middle">GitHub Actions</text>
                        <text x="230" y="90" font-family="sans-serif" font-size="9" fill="#E9D5FF" text-anchor="middle">Checkov + TF Plan</text>

                        <rect x="335" y="45" width="160" height="70" rx="6" fill="#1F2937" stroke="#38BDF8" stroke-width="1.5"/>
                        <text x="415" y="72" font-family="sans-serif" font-size="11" font-weight="bold" fill="#38BDF8" text-anchor="middle">AWS Cloud Infra</text>
                        <text x="415" y="90" font-family="sans-serif" font-size="9" fill="#9CA3AF" text-anchor="middle">S3 State + DynamoDB Lock</text>

                        <path d="M125 80 H165" stroke="#A855F7" stroke-width="2"/>
                        <path d="M295 80 H335" stroke="#38BDF8" stroke-width="2"/>
                    </svg>
                `,
                codeLang: 'main.tf — Terraform S3 Remote State Backend',
                codeSnippet: `terraform {
  required_version = ">= 1.5.0"
  backend "s3" {
    bucket         = "ritik-tf-state-backend"
    key            = "prod/terraform.tfstate"
    region         = "us-east-1"
    dynamodb_table = "ritik-tf-locks"
    encrypt        = true
  }
}`,
                screenshots: [
                    { title: 'GitHub Actions Workflow', desc: 'Automated terraform plan & security scans.' },
                    { title: 'DynamoDB Lock Table', desc: 'Concurrency lock protecting state file.' }
                ],
                tags: ['Terraform', 'GitHub Actions', 'S3 Backend', 'DynamoDB', 'Checkov'],
                actionText: 'View GitHub Profile',
                actionUrl: 'https://github.com/hritiksah00'
            },

            'ubuntu-hardening': {
                title: 'CIS Hardened Ubuntu 24.04 Server',
                badge: 'LINUX SECURITY & HARDENING',
                category: 'Ubuntu Linux & CIS Compliance',
                role: 'Systems Security Engineer',
                description: `
                    <p>Developed and executed automated Linux server hardening scripts applying CIS (Center for Internet Security) Level 1 Benchmark security guidelines on Ubuntu 24.04 LTS servers.</p>
                    <p><strong>Security Controls:</strong> Disabled root SSH logins, configured strict UFW firewall rule sets, deployed Fail2ban for automated SSH brute-force IP ban enforcement, configured Auditd kernel audit rules, and conducted automated compliance audits using Lynis.</p>
                `,
                archSvg: `
                    <svg width="100%" height="160" viewBox="0 0 520 160" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <rect width="520" height="160" rx="8" fill="#1C1917"/>
                        <rect x="30" y="45" width="130" height="70" rx="6" fill="#881337" stroke="#F43F5E" stroke-width="2"/>
                        <text x="95" y="75" font-family="sans-serif" font-size="11" font-weight="bold" fill="#FFFFFF" text-anchor="middle">Ubuntu 24.04 LTS</text>
                        <text x="95" y="93" font-family="sans-serif" font-size="9" fill="#FECDD3" text-anchor="middle">CIS Level 1 Benchmark</text>

                        <rect x="200" y="45" width="130" height="70" rx="6" fill="#1F2937" stroke="#10B981" stroke-width="1.5"/>
                        <text x="265" y="75" font-family="sans-serif" font-size="11" font-weight="bold" fill="#10B981" text-anchor="middle">UFW & Fail2ban</text>
                        <text x="265" y="93" font-family="sans-serif" font-size="9" fill="#D1D5DB" text-anchor="middle">SSH Brute-Force Ban</text>

                        <rect x="370" y="45" width="120" height="70" rx="6" fill="#1F2937" stroke="#F59E0B" stroke-width="1.5"/>
                        <text x="430" y="75" font-family="sans-serif" font-size="11" font-weight="bold" fill="#F59E0B" text-anchor="middle">Lynis Audit</text>
                        <text x="430" y="93" font-family="sans-serif" font-size="9" fill="#D1D5DB" text-anchor="middle">Auditd Kernel Logs</text>

                        <path d="M160 80 H200" stroke="#F43F5E" stroke-width="2"/>
                        <path d="M330 80 H370" stroke="#10B981" stroke-width="2"/>
                    </svg>
                `,
                codeLang: 'Bash Hardening Script snippet',
                codeSnippet: `#!/usr/bin/env bash
# Disable Root SSH Login & Password Authentication
sed -i 's/^PermitRootLogin.*/PermitRootLogin no/' /etc/ssh/sshd_config
sed -i 's/^PasswordAuthentication.*/PasswordAuthentication no/' /etc/ssh/sshd_config

# UFW Firewall Baseline
ufw default deny incoming
ufw default allow outgoing
ufw allow 22/tcp
ufw --force enable`,
                screenshots: [
                    { title: 'Lynis Security Score', desc: 'Achieved 84+ rating on CIS benchmarks.' },
                    { title: 'Fail2ban Jail Status', desc: 'Active SSH brute-force protection.' }
                ],
                tags: ['Ubuntu 24.04', 'CIS Benchmark', 'UFW Firewall', 'Fail2ban', 'Lynis'],
                actionText: 'View GitHub Profile',
                actionUrl: 'https://github.com/hritiksah00'
            },

            'server-monitor': {
                title: 'server-health-monitor',
                badge: 'GITHUB REPOSITORY · SHELL',
                category: 'Linux Automation & Shell',
                role: 'Systems Automation Specialist',
                description: `
                    <p>Automated Shell script designed to monitor system vitals, disk space utilization, CPU/RAM thresholds, and active web services on Linux servers.</p>
                    <p>Triggers immediate system alerts when resource thresholds exceed predefined limits, ensuring continuous uptime and system reliability.</p>
                `,
                archSvg: `
                    <svg width="100%" height="150" viewBox="0 0 500 150" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <rect width="500" height="150" rx="8" fill="#1C1917"/>
                        <rect x="30" y="50" width="130" height="50" rx="6" fill="#292524" stroke="#F59E0B" stroke-width="1.5"/>
                        <text x="95" y="78" font-family="sans-serif" font-size="10" font-weight="600" fill="#F59E0B" text-anchor="middle">Cron Job Trigger</text>
                        <rect x="200" y="35" width="150" height="80" rx="6" fill="#292524" stroke="#38BDF8" stroke-width="2"/>
                        <text x="275" y="65" font-family="sans-serif" font-size="11" font-weight="bold" fill="#FFFFFF" text-anchor="middle">server-health.sh</text>
                        <text x="275" y="85" font-family="sans-serif" font-size="9" fill="#93C5FD" text-anchor="middle">Disk / CPU / RAM Audit</text>
                        <rect x="380" y="50" width="90" height="50" rx="6" fill="#292524" stroke="#10B981" stroke-width="1.5"/>
                        <text x="425" y="78" font-family="sans-serif" font-size="10" font-weight="600" fill="#10B981" text-anchor="middle">Alert Log</text>
                        <path d="M160 75 H200" stroke="#F59E0B" stroke-width="2"/>
                        <path d="M350 75 H380" stroke="#10B981" stroke-width="2"/>
                    </svg>
                `,
                codeLang: 'Bash Script — server-health.sh',
                codeSnippet: `#!/bin/bash
THRESHOLD=85
USAGE=$(df / | grep / | awk '{ print $5 }' | sed 's/%//')

if [ $USAGE -gt $THRESHOLD ]; then
  echo "WARNING: Disk space critical on $(hostname): \${USAGE}%" | mail -s "Disk Alert" hritiksah38@gmail.com
fi`,
                screenshots: [
                    { title: 'GitHub Repository', desc: 'Open-source repository hosted on @hritiksah00.' }
                ],
                tags: ['Shell Scripting', 'Linux', 'Bash', 'Automation', 'Cron'],
                actionText: 'View Repo on GitHub ↗',
                actionUrl: 'https://github.com/hritiksah00/server-health-monitor'
            },

            'pfm-finance': {
                title: 'PFM — Personal Finance Manager',
                badge: 'GITHUB REPOSITORY · PYTHON',
                category: 'Python 3 Application',
                role: 'Python Developer',
                description: `
                    <p>Comprehensive Personal Finance Manager built in Python 3 to help users track transactions, compute monthly category spending, and export detailed financial reports.</p>
                    <p>Features custom data structures, transaction logging, CSV data persistence, and category-wise spending analytics.</p>
                `,
                archSvg: `
                    <svg width="100%" height="150" viewBox="0 0 500 150" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <rect width="500" height="150" rx="8" fill="#1C1917"/>
                        <rect x="30" y="50" width="110" height="50" rx="6" fill="#292524" stroke="#3B82F6" stroke-width="1.5"/>
                        <text x="85" y="78" font-family="sans-serif" font-size="10" font-weight="600" fill="#3B82F6" text-anchor="middle">User Input</text>
                        <rect x="180" y="35" width="150" height="80" rx="6" fill="#1E3A8A" stroke="#60A5FA" stroke-width="2"/>
                        <text x="255" y="65" font-family="sans-serif" font-size="11" font-weight="bold" fill="#FFFFFF" text-anchor="middle">PFM Core Engine</text>
                        <text x="255" y="85" font-family="sans-serif" font-size="9" fill="#93C5FD" text-anchor="middle">Python 3 Analytics</text>
                        <rect x="370" y="50" width="100" height="50" rx="6" fill="#292524" stroke="#10B981" stroke-width="1.5"/>
                        <text x="420" y="78" font-family="sans-serif" font-size="10" font-weight="600" fill="#10B981" text-anchor="middle">CSV Export</text>
                        <path d="M140 75 H180" stroke="#3B82F6" stroke-width="2"/>
                        <path d="M330 75 H370" stroke="#10B981" stroke-width="2"/>
                    </svg>
                `,
                codeLang: 'Python 3 — pfm_manager.py',
                codeSnippet: `class PersonalFinanceManager:
    def __init__(self, filename="transactions.csv"):
        self.filename = filename
        self.transactions = []

    def add_transaction(self, category, amount, tx_type="expense"):
        self.transactions.append({
            "category": category,
            "amount": float(amount),
            "type": tx_type
        })`,
                screenshots: [
                    { title: 'GitHub Repository', desc: 'Open-source Python app on @hritiksah00/PFM.' }
                ],
                tags: ['Python 3', 'Finance App', 'Analytics', 'Data Processing'],
                actionText: 'View Repo on GitHub ↗',
                actionUrl: 'https://github.com/hritiksah00/PFM'
            }
        };

        // Open Project Modal Function
        function openProjectModal(projectId) {
            const data = PROJECT_MODAL_DATA[projectId];
            if (!data) return;

            document.getElementById('modal-badge').innerText = data.badge;
            document.getElementById('modal-category-text').innerText = data.category;
            document.getElementById('modal-title').innerText = data.title;
            document.getElementById('modal-subtitle').innerText = data.role;
            document.getElementById('modal-description').innerHTML = data.description;
            document.getElementById('modal-arch-container').innerHTML = data.archSvg;
            document.getElementById('modal-code-lang').innerText = data.codeLang;
            document.getElementById('modal-code-content').innerText = data.codeSnippet;

            const screenshotsContainer = document.getElementById('modal-screenshots-container');
            screenshotsContainer.innerHTML = '';
            data.screenshots.forEach(sc => {
                const box = document.createElement('div');
                box.className = 'p-4 rounded-xl border border-stone-200 bg-white shadow-2xs';
                box.innerHTML = `
                    <div class="h-24 rounded-lg bg-stone-900 flex items-center justify-center text-white mb-3 text-xs font-mono border border-stone-800">
                        <span class="text-stone-400 font-semibold">[ Image Screenshot Placeholder ]</span>
                    </div>
                    <h5 class="text-xs font-bold text-stone-900">${sc.title}</h5>
                    <p class="text-[11px] text-stone-500 mt-0.5">${sc.desc}</p>
                `;
                screenshotsContainer.appendChild(box);
            });

            const tagsContainer = document.getElementById('modal-tags');
            tagsContainer.innerHTML = '';
            data.tags.forEach(t => {
                const tag = document.createElement('span');
                tag.className = 'text-[10px] font-mono bg-stone-100 text-stone-800 border border-stone-200 px-2.5 py-1 rounded-md font-medium';
                tag.innerText = t;
                tagsContainer.appendChild(tag);
            });

            const actionBtn = document.getElementById('modal-action-btn');
            document.getElementById('modal-action-text').innerText = data.actionText;
            actionBtn.href = data.actionUrl;

            const modal = document.getElementById('project-modal');
            const container = document.getElementById('modal-container');

            document.body.classList.add('modal-open');
            modal.classList.remove('opacity-0', 'pointer-events-none');
            modal.classList.add('opacity-100');

            setTimeout(() => {
                container.classList.remove('scale-95', 'translate-y-4', 'opacity-0');
                container.classList.add('scale-100', 'translate-y-0', 'opacity-100');
            }, 10);
        }

        // Close Project Modal Function
        function closeProjectModal() {
            const modal = document.getElementById('project-modal');
            const container = document.getElementById('modal-container');

            container.classList.remove('scale-100', 'translate-y-0', 'opacity-100');
            container.classList.add('scale-95', 'translate-y-4', 'opacity-0');

            setTimeout(() => {
                modal.classList.remove('opacity-100');
                modal.classList.add('opacity-0', 'pointer-events-none');
                document.body.classList.remove('modal-open');
            }, 200);
        }

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                closeProjectModal();
            }
        });
'''

    if 'PROJECT_MODAL_DATA' not in html:
        html = html.replace('</script>', js_code + '\n    </script>' + modal_html)

    with open('index.html', 'w') as f:
        f.write(html)

    with open('portfolio.html', 'w') as f:
        f.write(html)

    print('Successfully updated index.html and portfolio.html with dynamic modal!')

if __name__ == '__main__':
    update_portfolio()
