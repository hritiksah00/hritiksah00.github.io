/* ─── DATA & APPLICATION ENGINE ──────────────────────────── */

// 8 Deep-Dive Projects Database
const projectsData = [
  {
    id: "aws-multi-region",
    title: "Multi-Region AWS Infrastructure with Auto-Scaling & Failover",
    category: "aws",
    categoryLabel: "AWS & Cloud · 2025",
    isFeatured: true,
    shortDesc: "Architected a multi-region, fault-tolerant web application on AWS utilizing EC2 Auto-Scaling Groups, Application Load Balancers (ALB), Amazon Route 53 latency routing, and RDS Multi-AZ replication. Reduced downtime by 94% during simulated regional failure.",
    longOverview: "Designed and deployed a highly available infrastructure across two AWS regions (us-east-1 and eu-west-1). The setup leverages Route 53 DNS failover with health checks, automatically rerouting traffic to the secondary region within 15 seconds of a simulated outage.",
    techStack: ["AWS EC2", "Auto Scaling", "ALB", "Route 53", "RDS Multi-AZ", "VPC Peering", "CloudWatch"],
    metrics: [
      "94% reduction in downtime during simulated regional failures",
      "< 15s automatic DNS failover latency via Route 53",
      "Zero data loss with synchronous RDS Multi-AZ replication",
      "Automated scale-out from 2 to 12 EC2 instances under 85% CPU load"
    ],
    techDetails: [
      "Custom VPC architecture with isolated Public, Private App, and Database Subnets across 3 Availability Zones per region.",
      "Route 53 Latency-Based Routing paired with Target Tracking Auto Scaling Policies based on CloudWatch metrics.",
      "AWS KMS key management for encryption of S3 buckets and EBS volumes at rest.",
      "IAM Role segregation enforcing strict principle of least privilege for EC2 instances."
    ],
    terminalSnippet: `# AWS CLI Verification Command
aws route53 get-health-check-status --health-check-id "hc-83f19a02"
aws autoscaling describe-auto-scaling-groups --auto-scaling-group-names "prod-us-east-asg"
aws elbv2 describe-load-balancers --names "prod-alb-us-east"`,
    diagramSvg: `
      <svg width="100%" height="180" viewBox="0 0 600 180" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="600" height="180" rx="8" fill="#0F172A"/>
        <!-- Route 53 -->
        <rect x="250" y="15" width="100" height="35" rx="4" stroke="#38BDF8" stroke-width="1.5" fill="#1E293B"/>
        <text x="300" y="37" font-family="monospace" font-size="11" fill="#38BDF8" text-anchor="middle">Route 53 DNS</text>
        
        <!-- Region 1 -->
        <rect x="40" y="75" width="230" height="85" rx="6" stroke="#64748B" stroke-dasharray="4 4" fill="none"/>
        <text x="50" y="93" font-family="sans-serif" font-size="10" fill="#94A3B8">AWS Region 1 (Primary)</text>
        <rect x="55" y="105" width="80" height="40" rx="4" fill="#334155" stroke="#60A5FA"/>
        <text x="95" y="129" font-family="monospace" font-size="10" fill="#F8FAFC" text-anchor="middle">ALB + ASG</text>
        <rect x="175" y="105" width="80" height="40" rx="4" fill="#334155" stroke="#10B981"/>
        <text x="215" y="129" font-family="monospace" font-size="10" fill="#F8FAFC" text-anchor="middle">RDS Primary</text>
        
        <!-- Region 2 -->
        <rect x="330" y="75" width="230" height="85" rx="6" stroke="#64748B" stroke-dasharray="4 4" fill="none"/>
        <text x="340" y="93" font-family="sans-serif" font-size="10" fill="#94A3B8">AWS Region 2 (Failover)</text>
        <rect x="345" y="105" width="80" height="40" rx="4" fill="#334155" stroke="#60A5FA"/>
        <text x="385" y="129" font-family="monospace" font-size="10" fill="#F8FAFC" text-anchor="middle">ALB + ASG</text>
        <rect x="465" y="105" width="80" height="40" rx="4" fill="#334155" stroke="#F59E0B"/>
        <text x="505" y="129" font-family="monospace" font-size="10" fill="#F8FAFC" text-anchor="middle">RDS Replica</text>

        <!-- Connections -->
        <path d="M280 50 L135 105" stroke="#38BDF8" stroke-width="1.5" stroke-dasharray="3 3"/>
        <path d="M320 50 L425 105" stroke="#38BDF8" stroke-width="1.5" stroke-dasharray="3 3"/>
        <path d="M255 125 L345 125" stroke="#10B981" stroke-width="1.5"/>
      </svg>`
  },
  {
    id: "gitops-terraform",
    title: "GitOps IaC Pipeline with Terraform & GitHub Actions",
    category: "devops",
    categoryLabel: "DevOps & IaC · 2025",
    isFeatured: false,
    shortDesc: "Built an automated GitOps deployment workflow provisioning AWS cloud environments using modular Terraform code, state locking in Amazon DynamoDB, and CI/CD validation checks.",
    longOverview: "Developed zero-drift infrastructure code enforcing modularity across Dev, Staging, and Production environments. Every pull request triggers Automated Terraform Plan, TFLint formatting checks, and Checkov security scanning before approval.",
    techStack: ["Terraform", "GitHub Actions", "AWS S3 State", "DynamoDB Lock", "Checkov", "Docker"],
    metrics: [
      "100% automated infrastructure linting and security scans",
      "Eliminated manual AWS console configuration drift",
      "< 3 minutes deployment time from PR merge to live stack",
      "Centralized state locking preventing concurrent execution conflicts"
    ],
    techDetails: [
      "Remote state storage in S3 with KMS encryption and object versioning enabled.",
      "DynamoDB table backend implementation for state locking.",
      "Checkov static code analysis integrated into GitHub Actions workflow.",
      "Modular Terraform structure for VPCs, EKS clusters, Security Groups, and IAM Policies."
    ],
    terminalSnippet: `# Terraform Validation Workflow
terraform fmt -check
terraform init -backend-config="key=prod/terraform.tfstate"
terraform plan -out=tfplan.binary
checkov -d . --framework terraform`,
    diagramSvg: `
      <svg width="100%" height="160" viewBox="0 0 600 160" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="600" height="160" rx="8" fill="#0F172A"/>
        <rect x="40" y="60" width="100" height="45" rx="6" fill="#1E293B" stroke="#60A5FA"/>
        <text x="90" y="87" font-family="monospace" font-size="11" fill="#F8FAFC" text-anchor="middle">Git Push / PR</text>
        
        <rect x="190" y="60" width="110" height="45" rx="6" fill="#1E293B" stroke="#F59E0B"/>
        <text x="245" y="87" font-family="monospace" font-size="11" fill="#F8FAFC" text-anchor="middle">GitHub Actions</text>
        
        <rect x="345" y="60" width="100" height="45" rx="6" fill="#1E293B" stroke="#38BDF8"/>
        <text x="395" y="87" font-family="monospace" font-size="11" fill="#F8FAFC" text-anchor="middle">Terraform IaC</text>
        
        <rect x="490" y="60" width="80" height="45" rx="6" fill="#1E293B" stroke="#10B981"/>
        <text x="530" y="87" font-family="monospace" font-size="11" fill="#F8FAFC" text-anchor="middle">AWS Cloud</text>

        <path d="M140 82.5 H190" stroke="#60A5FA" stroke-width="2"/>
        <path d="M300 82.5 H345" stroke="#F59E0B" stroke-width="2"/>
        <path d="M445 82.5 H490" stroke="#38BDF8" stroke-width="2"/>
      </svg>`
  },
  {
    id: "cis-ubuntu-hardening",
    title: "CIS Benchmark Hardened Ubuntu Server & Automated Auditing",
    category: "security",
    categoryLabel: "Security & Linux · 2026",
    isFeatured: false,
    shortDesc: "Applied Level 1 CIS Benchmark security hardening on Ubuntu 24.04 servers, automating system parameter tuning, UFW firewall policy, Fail2ban intrusion protection, and Lynis vulnerability reporting.",
    longOverview: "Hardened bare-metal and cloud Linux instances against unauthorized privilege escalation and brute-force attacks. Configured kernel sysctl security parameters, disabled unused filesystems, locked down SSH configurations, and established automated daily Lynis compliance reporting.",
    techStack: ["Ubuntu 24.04", "Bash Shell", "UFW Firewall", "Fail2ban", "Lynis Audit", "Auditd", "SSH Hardening"],
    metrics: [
      "Elevated Lynis Hardening Index score from 58 to 86/100",
      "Blocked 100% of brute-force SSH connection attempts via Fail2ban",
      "Automated log rotation and tamper-evident audit logs using auditd",
      "Zero root logins allowed over network (Key-only authentication)"
    ],
    techDetails: [
      "Disabled legacy network protocols (ICMP redirects, IP forwarding, source routing).",
      "Strict UFW firewall posture: default deny ingress, minimal egress whitelist.",
      "Configured pam_tally2 / pam_faillock for system account lockout policies.",
      "Cron-based automated system compliance scanning exporting alerts to Syslog."
    ],
    terminalSnippet: `# Linux Security Hardening Execution
sudo ufw default deny incoming
sudo ufw default allow outgoing
sudo ufw allow 2222/tcp comment 'Hardened SSH Port'
sudo lynis audit system --quick`,
    diagramSvg: `
      <svg width="100%" height="160" viewBox="0 0 600 160" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="600" height="160" rx="8" fill="#0F172A"/>
        <rect x="50" y="55" width="120" height="50" rx="6" fill="#1E293B" stroke="#EF4444"/>
        <text x="110" y="85" font-family="monospace" font-size="11" fill="#F8FAFC" text-anchor="middle">Untrusted Traffic</text>
        
        <rect x="220" y="55" width="100" height="50" rx="6" fill="#1E293B" stroke="#F59E0B"/>
        <text x="270" y="85" font-family="monospace" font-size="11" fill="#F8FAFC" text-anchor="middle">UFW / Fail2ban</text>
        
        <rect x="370" y="55" width="180" height="50" rx="6" fill="#1E293B" stroke="#10B981"/>
        <text x="460" y="80" font-family="monospace" font-size="11" fill="#F8FAFC" text-anchor="middle">Hardened Ubuntu Kernel</text>
        <text x="460" y="95" font-family="monospace" font-size="9" fill="#94A3B8" text-anchor="middle">Auditd + Sysctl Lockdown</text>

        <path d="M170 80 H220" stroke="#EF4444" stroke-width="2"/>
        <path d="M320 80 H370" stroke="#10B981" stroke-width="2"/>
      </svg>`
  },
  {
    id: "microservices-docker",
    title: "Containerized 3-Tier Microservices with Redis Caching",
    category: "devops",
    categoryLabel: "DevOps · 2025",
    isFeatured: false,
    shortDesc: "Engineered a containerized microservices stack with Nginx as a reverse proxy, Node.js REST API instances, PostgreSQL persistent database, and Redis cache layer using Docker Compose.",
    longOverview: "Constructed an isolated microservice architecture with custom bridge networks, volume mounts for database persistence, health checks for dynamic container dependency management, and Nginx load balancing across API nodes.",
    techStack: ["Docker", "Docker Compose", "Nginx", "Node.js", "PostgreSQL", "Redis", "Linux Containers"],
    metrics: [
      "65% lower API response latency with Redis caching layer",
      "Zero-downtime rolling container updates via Docker Compose scaling",
      "Isolated container bridge networking eliminating exposed internal ports",
      "Persistent state protection across container restarts"
    ],
    techDetails: [
      "Custom Nginx round-robin load balancing configuration upstreaming requests.",
      "Multi-stage Dockerfiles optimizing final production image size to < 120MB.",
      "Docker volume drivers with read-only runtime filesystem security flags.",
      "Environment variable isolation using Docker secrets management."
    ],
    terminalSnippet: `# Docker Microservices Stack Management
docker compose up -d --scale api=3
docker compose ps
docker exec -it stack-postgres-1 psql -U postgres -c "\\l"`,
    diagramSvg: `
      <svg width="100%" height="160" viewBox="0 0 600 160" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="600" height="160" rx="8" fill="#0F172A"/>
        <rect x="40" y="55" width="100" height="50" rx="6" fill="#1E293B" stroke="#38BDF8"/>
        <text x="90" y="85" font-family="monospace" font-size="11" fill="#F8FAFC" text-anchor="middle">Nginx Proxy</text>
        
        <rect x="180" y="30" width="110" height="40" rx="6" fill="#1E293B" stroke="#60A5FA"/>
        <text x="235" y="55" font-family="monospace" font-size="10" fill="#F8FAFC" text-anchor="middle">API Node 1</text>
        
        <rect x="180" y="85" width="110" height="40" rx="6" fill="#1E293B" stroke="#60A5FA"/>
        <text x="235" y="110" font-family="monospace" font-size="10" fill="#F8FAFC" text-anchor="middle">API Node 2</text>
        
        <rect x="330" y="30" width="100" height="40" rx="6" fill="#1E293B" stroke="#C084FC"/>
        <text x="380" y="55" font-family="monospace" font-size="10" fill="#F8FAFC" text-anchor="middle">Redis Cache</text>
        
        <rect x="330" y="85" width="100" height="40" rx="6" fill="#1E293B" stroke="#10B981"/>
        <text x="380" y="110" font-family="monospace" font-size="10" fill="#F8FAFC" text-anchor="middle">PostgreSQL DB</text>

        <path d="M140 80 L180 50" stroke="#38BDF8" stroke-width="1.5"/>
        <path d="M140 80 L180 105" stroke="#38BDF8" stroke-width="1.5"/>
        <path d="M290 50 H330" stroke="#C084FC" stroke-width="1.5"/>
        <path d="M290 105 H330" stroke="#10B981" stroke-width="1.5"/>
      </svg>`
  },
  {
    id: "serverless-pipeline",
    title: "Serverless Event-Driven Data Pipeline on AWS",
    category: "serverless",
    categoryLabel: "Serverless & Cloud · 2026",
    isFeatured: false,
    shortDesc: "Architected a serverless event-driven processing pipeline using Amazon S3 bucket notifications, AWS Lambda, DynamoDB storage, and Amazon SNS alert delivery.",
    longOverview: "Designed an automated data processing system that ingests JSON payloads uploaded to Amazon S3, invokes Python AWS Lambda handlers for sanitization and schema verification, writes structured documents to DynamoDB, and dispatches real-time alerts via SNS.",
    techStack: ["AWS Lambda", "Amazon S3", "DynamoDB", "Amazon SNS", "Python Boto3", "AWS IAM"],
    metrics: [
      "Sub-second end-to-end data ingestion latency",
      "Zero idle infrastructure costs (100% pay-per-execution)",
      "Processed 10,000+ test event payloads without a single dropped event",
      "Automatic DLQ (Dead Letter Queue) message handling for invalid payloads"
    ],
    techDetails: [
      "Asynchronous Lambda event triggers linked to S3 PutItem object lifecycle.",
      "DynamoDB single-table design with Partition and Sort Keys optimized for high write throughput.",
      "Fine-grained IAM policy scoping execution permissions for Lambda execution role.",
      "CloudWatch log retention and metric alarms for execution timeouts."
    ],
    terminalSnippet: `# AWS Lambda Function Invocation & Event Test
aws lambda invoke --function-name "DataProcessorLambda" --payload file://test_event.json output.txt
aws dynamodb scan --table-name "ProcessedEventsTable" --max-items 5`,
    diagramSvg: `
      <svg width="100%" height="160" viewBox="0 0 600 160" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="600" height="160" rx="8" fill="#0F172A"/>
        <rect x="40" y="60" width="100" height="45" rx="6" fill="#1E293B" stroke="#38BDF8"/>
        <text x="90" y="87" font-family="monospace" font-size="11" fill="#F8FAFC" text-anchor="middle">S3 Bucket</text>
        
        <rect x="180" y="60" width="110" height="45" rx="6" fill="#1E293B" stroke="#F59E0B"/>
        <text x="235" y="87" font-family="monospace" font-size="11" fill="#F8FAFC" text-anchor="middle">AWS Lambda</text>
        
        <rect x="330" y="30" width="110" height="45" rx="6" fill="#1E293B" stroke="#10B981"/>
        <text x="385" y="57" font-family="monospace" font-size="11" fill="#F8FAFC" text-anchor="middle">DynamoDB</text>
        
        <rect x="330" y="90" width="110" height="45" rx="6" fill="#1E293B" stroke="#EF4444"/>
        <text x="385" y="117" font-family="monospace" font-size="11" fill="#F8FAFC" text-anchor="middle">SNS Alerts</text>

        <path d="M140 82.5 H180" stroke="#38BDF8" stroke-width="2"/>
        <path d="M290 82.5 L330 52.5" stroke="#10B981" stroke-width="2"/>
        <path d="M290 82.5 L330 112.5" stroke="#EF4444" stroke-width="2"/>
      </svg>`
  },
  {
    id: "network-recon",
    title: "Network Reconnaissance & Vulnerability Mapping System",
    category: "security",
    categoryLabel: "Cybersecurity · 2026",
    isFeatured: false,
    shortDesc: "Executed passive and active network reconnaissance, automated port enumeration with Nmap scripts, captured network protocol traffic using Wireshark, and mapped findings to OWASP Top 10 vulnerabilities.",
    longOverview: "Conducted structured security assessments across simulated laboratory environments. Combined OSINT techniques, custom Nmap Scripting Engine (NSE) rules, and packet analysis to discover vulnerable services, misconfigured SSL/TLS certificates, and exposed endpoints.",
    techStack: ["Nmap", "Wireshark", "Bash Scripting", "OWASP Top 10", "Python", "Metasploit"],
    metrics: [
      "Automated scan time reduced by 50% using tailored Nmap timing templates (-T4)",
      "Mapped 25+ specific vulnerabilities directly to CVE databases and OWASP risks",
      "Produced comprehensive academic security report with remediation patches",
      "Zero network congestion caused during scan sweeps"
    ],
    techDetails: [
      "Custom Nmap NSE scripts targeting out-of-date web servers and default credentials.",
      "Wireshark pcap dissection identifying unencrypted sensitive payloads in transit.",
      "Passive recon leveraging DNS enumeration and Google Dorking methodologies.",
      "Structured reporting template detailing CVSS severity scores and mitigation guides."
    ],
    terminalSnippet: `# Nmap Vulnerability Scan Execution
nmap -sV -sC -O -T4 -p 1-10000 --script=vuln,http-enum 192.168.1.0/24 -oA recon_results
tshark -r capture.pcap -Y "http.request.method == POST" -T fields -e http.file_data`,
    diagramSvg: `
      <svg width="100%" height="160" viewBox="0 0 600 160" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="600" height="160" rx="8" fill="#0F172A"/>
        <rect x="40" y="60" width="110" height="45" rx="6" fill="#1E293B" stroke="#EF4444"/>
        <text x="95" y="87" font-family="monospace" font-size="11" fill="#F8FAFC" text-anchor="middle">Recon Engine</text>
        
        <rect x="190" y="60" width="110" height="45" rx="6" fill="#1E293B" stroke="#F59E0B"/>
        <text x="245" y="87" font-family="monospace" font-size="11" fill="#F8FAFC" text-anchor="middle">Nmap / Wireshark</text>
        
        <rect x="340" y="60" width="110" height="45" rx="6" fill="#1E293B" stroke="#38BDF8"/>
        <text x="395" y="87" font-family="monospace" font-size="11" fill="#F8FAFC" text-anchor="middle">Threat Matrix</text>
        
        <rect x="490" y="60" width="85" height="45" rx="6" fill="#1E293B" stroke="#10B981"/>
        <text x="532" y="87" font-family="monospace" font-size="11" fill="#F8FAFC" text-anchor="middle">OWASP Report</text>

        <path d="M150 82.5 H190" stroke="#EF4444" stroke-width="2"/>
        <path d="M300 82.5 H340" stroke="#F59E0B" stroke-width="2"/>
        <path d="M450 82.5 H490" stroke="#38BDF8" stroke-width="2"/>
      </svg>`
  },
  {
    id: "kubernetes-cluster",
    title: "Kubernetes (k8s) High-Availability Cluster & Ingress Routing",
    category: "devops",
    categoryLabel: "DevOps & Cloud · 2026",
    isFeatured: false,
    shortDesc: "Deployed a lightweight Kubernetes (k3s) cluster with Nginx Ingress Controller, Helm package management, automated Let's Encrypt SSL certificates via cert-manager, and Prometheus monitoring.",
    longOverview: "Constructed a production-ready Kubernetes development environment. Managed workloads using declarative Helm charts, implemented Secret encryption, configured Horizontal Pod Autoscalers (HPA), and set up Grafana dashboards for cluster metrics.",
    techStack: ["Kubernetes", "k3s", "Helm", "Nginx Ingress", "Cert-Manager", "Prometheus", "Grafana"],
    metrics: [
      "Dynamic Horizontal Pod Autoscaling based on CPU/Memory thresholds",
      "Automated SSL/TLS certificate renewal via Let's Encrypt ACME provider",
      "100% declarative cluster configuration tracked in Git",
      "Sub-millisecond ingress routing latency"
    ],
    techDetails: [
      "Custom Helm values files standardizing deployment templates across environments.",
      "Configured Ingress paths with rate-limiting annotations preventing DDoS overload.",
      "RBAC policies restricting service account namespace capabilities.",
      "PersistentVolumeClaim (PVC) storage binding for stateful pods."
    ],
    terminalSnippet: `# Kubernetes Cluster Inspection
kubectl get nodes -o wide
kubectl get pods -n ingress-nginx
helm list --all-namespaces
kubectl get certificate -A`,
    diagramSvg: `
      <svg width="100%" height="160" viewBox="0 0 600 160" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="600" height="160" rx="8" fill="#0F172A"/>
        <rect x="40" y="55" width="110" height="50" rx="6" fill="#1E293B" stroke="#38BDF8"/>
        <text x="95" y="85" font-family="monospace" font-size="11" fill="#F8FAFC" text-anchor="middle">Nginx Ingress</text>
        
        <rect x="180" y="30" width="120" height="45" rx="6" fill="#1E293B" stroke="#60A5FA"/>
        <text x="240" y="57" font-family="monospace" font-size="10" fill="#F8FAFC" text-anchor="middle">Pod (Web App)</text>
        
        <rect x="180" y="85" width="120" height="45" rx="6" fill="#1E293B" stroke="#60A5FA"/>
        <text x="240" y="112" font-family="monospace" font-size="10" fill="#F8FAFC" text-anchor="middle">Pod (API Service)</text>
        
        <rect x="340" y="55" width="120" height="50" rx="6" fill="#1E293B" stroke="#10B981"/>
        <text x="400" y="85" font-family="monospace" font-size="10" fill="#F8FAFC" text-anchor="middle">Cert-Manager SSL</text>

        <path d="M150 80 L180 52.5" stroke="#38BDF8" stroke-width="1.5"/>
        <path d="M150 80 L180 107.5" stroke="#38BDF8" stroke-width="1.5"/>
        <path d="M300 52.5 L340 80" stroke="#10B981" stroke-width="1.5"/>
      </svg>`
  },
  {
    id: "zero-trust-vpn",
    title: "Zero-Trust VPN & Automated Gateway Access Control",
    category: "security",
    categoryLabel: "Network Security · 2026",
    isFeatured: false,
    shortDesc: "Implemented a high-performance WireGuard VPN gateway enforcing Zero-Trust access control, PKI key infrastructure, iptables network isolation, and SSH key authentication vault.",
    longOverview: "Built a secure access solution for cloud infrastructure. Configured peer-to-peer WireGuard tunnels with minimal latency overhead, established dynamic iptables rules for subnet micro-segmentation, and automated SSH authorized key rotation.",
    techStack: ["WireGuard VPN", "Linux IPTables", "PKI Infrastructure", "Bash", "OpenSSL", "UFW"],
    metrics: [
      "Over 80% faster connection throughput compared to traditional OpenVPN",
      "Strict network micro-segmentation allowing only authenticated device IPs",
      "Automated certificate authority generation and key rotation",
      "Zero public exposing of management ports on cloud instances"
    ],
    techDetails: [
      "Custom WireGuard configuration generators creating client profiles securely.",
      "iptables forwarding rules isolating internal subnets per user privilege level.",
      "Systemd service automation ensuring persistent VPN state across reboot.",
      "Public-key cryptography paired with pre-shared keys (PSK) for post-quantum resistance."
    ],
    terminalSnippet: `# WireGuard Interface Status
sudo wg show wg0
sudo iptables -L FORWARD -v -n
wg-quick status wg0`,
    diagramSvg: `
      <svg width="100%" height="160" viewBox="0 0 600 160" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="600" height="160" rx="8" fill="#0F172A"/>
        <rect x="40" y="60" width="110" height="45" rx="6" fill="#1E293B" stroke="#60A5FA"/>
        <text x="95" y="87" font-family="monospace" font-size="11" fill="#F8FAFC" text-anchor="middle">Remote Peer</text>
        
        <rect x="190" y="60" width="130" height="45" rx="6" fill="#1E293B" stroke="#C084FC"/>
        <text x="255" y="87" font-family="monospace" font-size="11" fill="#F8FAFC" text-anchor="middle">WireGuard Tunnel</text>
        
        <rect x="360" y="60" width="110" height="45" rx="6" fill="#1E293B" stroke="#10B981"/>
        <text x="415" y="87" font-family="monospace" font-size="11" fill="#F8FAFC" text-anchor="middle">Secure Subnet</text>

        <path d="M150 82.5 H190" stroke="#60A5FA" stroke-width="2"/>
        <path d="M320 82.5 H360" stroke="#10B981" stroke-width="2"/>
      </svg>`
  }
];

// ─── INITIALIZATION & EVENT LISTENERS ───────────────────────
document.addEventListener('DOMContentLoaded', () => {
  initParticleCanvas();
  renderProjects('all');
  initProjectFilters();
  initTerminalEngine();
  initThemeToggle();
  initContactForm();
  initCopyButtons();
});

// ─── PROJECT RENDERER & FILTERS ─────────────────────────────
function renderProjects(filterCategory) {
  const container = document.getElementById('projects-container');
  const countBadge = document.getElementById('project-count-badge');
  container.innerHTML = '';

  const filtered = filterCategory === 'all' 
    ? projectsData 
    : projectsData.filter(p => p.category === filterCategory);

  countBadge.textContent = `Showing ${filtered.length} Project${filtered.length === 1 ? '' : 's'}`;

  filtered.forEach(project => {
    const card = document.createElement('article');
    card.className = `project-card ${project.isFeatured ? 'featured' : ''}`;
    card.dataset.id = project.id;

    const stackTagsHTML = project.techStack.slice(0, 4)
      .map(tag => `<span class="tag-pill">${tag}</span>`).join('');

    card.innerHTML = `
      <div class="card-body">
        <span class="card-badge">${project.categoryLabel}</span>
        <h3 class="card-title">${project.title}</h3>
        <p class="card-desc">${project.shortDesc}</p>
        <div class="card-tags">${stackTagsHTML}</div>
      </div>
      <div class="card-footer">
        <span>Click for Deep-Dive Architecture &amp; Metrics</span>
        <span class="card-arrow" aria-hidden="true">↗</span>
      </div>
    `;

    card.addEventListener('click', () => openProjectModal(project.id));
    container.appendChild(card);
  });
}

function initProjectFilters() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  filterBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      filterBtns.forEach(b => b.classList.remove('active'));
      e.target.classList.add('active');
      const filter = e.target.dataset.filter;
      renderProjects(filter);
    });
  });
}

// ─── PROJECT MODAL CONTROLLER ───────────────────────────────
function openProjectModal(projectId) {
  const project = projectsData.find(p => p.id === projectId);
  if (!project) return;

  document.getElementById('modal-tag').textContent = project.categoryLabel;
  document.getElementById('modal-title').textContent = project.title;
  document.getElementById('modal-overview').textContent = project.longOverview;
  
  // Render SVG diagram
  document.getElementById('modal-diagram-container').innerHTML = project.diagramSvg;

  // Technical Implementation Bullets
  const techList = document.getElementById('modal-tech-list');
  techList.innerHTML = project.techDetails.map(item => `<li>${item}</li>`).join('');

  // Metrics Bullets
  const metricsList = document.getElementById('modal-metrics-list');
  metricsList.innerHTML = project.metrics.map(item => `<li>${item}</li>`).join('');

  // Terminal Code Snippet
  document.getElementById('modal-code-snippet').querySelector('code').textContent = project.terminalSnippet;

  // Stack Tags
  document.getElementById('modal-tech-stack').textContent = `Stack: ${project.techStack.join(', ')}`;

  const modal = document.getElementById('project-modal');
  modal.classList.add('active');

  const closeBtn = document.getElementById('modal-close');
  const closeModal = () => modal.classList.remove('active');

  closeBtn.onclick = closeModal;
  modal.onclick = (e) => {
    if (e.target === modal) closeModal();
  };
}

// ─── INTERACTIVE TERMINAL ENGINE ───────────────────────────
function initTerminalEngine() {
  const input = document.getElementById('terminal-input');
  const history = document.getElementById('terminal-history');
  const body = document.getElementById('terminal-body');

  const commands = {
    help: () => `Available Commands:<br>
    - <span class="cmd-highlight">whoami</span>    : Developer profile & background<br>
    - <span class="cmd-highlight">projects</span>  : List all cloud & security projects<br>
    - <span class="cmd-highlight">skills</span>    : Display technical matrix & tools<br>
    - <span class="cmd-highlight">certs</span>     : View verified cloud certifications<br>
    - <span class="cmd-highlight">contact</span>   : Display email & social handles<br>
    - <span class="cmd-highlight">clear</span>     : Clear terminal history<br>
    - <span class="cmd-highlight">sudo</span>      : Execute superuser query`,
    
    whoami: () => `Ritik Sah — Cloud Infrastructure & Cybersecurity Specialist<br>
    Education: KFA Business School & IT, Kathmandu, Nepal<br>
    Focus: AWS Architecture, Terraform IaC, Hardened Linux Systems, Docker Microservices.`,
    
    projects: () => projectsData.map((p, i) => `[${i+1}] ${p.title} (${p.category.toUpperCase()})`).join('<br>'),
    
    skills: () => `TECHNICAL STACK MATRIX:<br>
    - AWS Cloud      : EC2, S3, VPC, RDS, Auto Scaling, Route53, Lambda (85%)<br>
    - Linux Systems  : Ubuntu Server, Hardening, Bash, Systemd, Auditd (95%)<br>
    - Containers     : Docker, Docker Compose, Kubernetes k3s (80%)<br>
    - Infrastructure : Terraform IaC, GitHub Actions GitOps (75%)<br>
    - Security       : Nmap, Wireshark, UFW, Fail2ban, Lynis (85%)`,
    
    certs: () => `VERIFIED CERTIFICATIONS:<br>
    [1] AWS Cloud Practitioner — Amazon Web Services (2025)<br>
    [2] Certified in Cybersecurity (CC) — ISC² (2025)<br>
    [3] Linux Essentials — Linux Professional Institute (2024)`,
    
    contact: () => `CONTACT DETAILS:<br>
    - Email    : hritiksah38@gmail.com<br>
    - LinkedIn : https://www.linkedin.com/in/ritik-sah-aws/<br>
    - GitHub   : https://github.com/hritiksah00`,
    
    sudo: () => `<span style="color:#EF4444">Permission denied: User 'ritik' is already running root privileges in this cloud context.</span>`
  };

  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      const commandStr = input.value.trim().toLowerCase();
      if (!commandStr) return;

      // Append user command line
      const line = document.createElement('div');
      line.className = 'terminal-line';
      line.innerHTML = `<span class="prompt">ritik@cloud-box:~$</span> ${commandStr}`;
      history.appendChild(line);

      // Process command
      const responseLine = document.createElement('div');
      responseLine.className = 'terminal-line';

      if (commandStr === 'clear') {
        history.innerHTML = '';
      } else if (commands[commandStr]) {
        responseLine.innerHTML = commands[commandStr]();
        history.appendChild(responseLine);
      } else {
        responseLine.innerHTML = `<span style="color:#EF4444">Command not found: '${commandStr}'. Type 'help' for available commands.</span>`;
        history.appendChild(responseLine);
      }

      input.value = '';
      body.scrollTop = body.scrollHeight;
    }
  });
}

// ─── BACKGROUND PARTICLE CANVAS ────────────────────────────
function initParticleCanvas() {
  const canvas = document.getElementById('cloud-canvas');
  const ctx = canvas.getContext('2d');

  let width = canvas.width = window.innerWidth;
  let height = canvas.height = window.innerHeight;

  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  const particles = Array.from({ length: 45 }, () => ({
    x: Math.random() * width,
    y: Math.random() * height,
    radius: Math.random() * 2 + 1,
    vx: (Math.random() - 0.5) * 0.4,
    vy: (Math.random() - 0.5) * 0.4
  }));

  function animate() {
    ctx.clearRect(0, 0, width, height);

    const isLight = document.documentElement.getAttribute('data-theme') === 'light';
    const nodeColor = isLight ? 'rgba(139, 115, 85, ' : 'rgba(56, 189, 248, ';

    // Draw lines
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 130) {
          ctx.beginPath();
          ctx.strokeStyle = `${nodeColor}${1 - dist / 130 * 0.8})`;
          ctx.lineWidth = 0.6;
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.stroke();
        }
      }
    }

    // Draw & update dots
    particles.forEach(p => {
      p.x += p.vx;
      p.y += p.vy;

      if (p.x < 0 || p.x > width) p.vx *= -1;
      if (p.y < 0 || p.y > height) p.vy *= -1;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      ctx.fillStyle = `${nodeColor}0.8)`;
      ctx.fill();
    });

    requestAnimationFrame(animate);
  }

  animate();
}

// ─── THEME TOGGLE ──────────────────────────────────────────
function initThemeToggle() {
  const toggleBtn = document.getElementById('theme-toggle');
  const icon = toggleBtn.querySelector('.theme-icon');

  toggleBtn.addEventListener('click', () => {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    
    document.documentElement.setAttribute('data-theme', newTheme);
    icon.textContent = newTheme === 'light' ? '☀️' : '🌙';
  });
}

// ─── CONTACT FORM & COPY BUTTONS ───────────────────────────
function initContactForm() {
  const form = document.getElementById('contact-form');
  const feedback = document.getElementById('form-feedback');

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    
    if (form.checkValidity()) {
      feedback.className = 'form-feedback success';
      feedback.textContent = '✓ Message received! Thank you for reaching out, Ritik will respond within 24 hours.';
      form.reset();
      
      setTimeout(() => {
        feedback.style.display = 'none';
      }, 6000);
    }
  });
}

function initCopyButtons() {
  const copyBtns = document.querySelectorAll('.btn-copy');
  copyBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const textToCopy = btn.dataset.copy;
      navigator.clipboard.writeText(textToCopy).then(() => {
        const origText = btn.textContent;
        btn.textContent = 'Copied!';
        btn.style.borderColor = 'var(--accent-emerald)';
        btn.style.color = 'var(--accent-emerald)';
        
        setTimeout(() => {
          btn.textContent = origText;
          btn.style.borderColor = '';
          btn.style.color = '';
        }, 2000);
      });
    });
  });
}
