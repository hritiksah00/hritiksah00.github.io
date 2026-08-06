import re

def update_estimator():
    with open('index.html', 'r') as f:
        html = f.read()

    # 1. Replace Scope Radios
    radios_old = '''<label class="cursor-pointer relative">
                                    <input type="radio" name="archTier" value="2.50" data-tier="cdn" class="peer sr-only" checked onchange="calculatePrice()">
                                    <div class="p-4 rounded-xl border peer-checked:border-stone-900 peer-checked:ring-1 peer-checked:ring-stone-900 transition-all h-full flex flex-col gap-2 border-stone-200 bg-stone-50 hover:bg-stone-100">
                                        <div class="w-8 h-8 rounded-lg bg-sky-100 text-sky-800 flex items-center justify-center shadow-xs">
                                            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"></path></svg>
                                        </div>
                                        <span class="font-semibold text-stone-900 tier-name text-sm">Static CDN Deployment</span>
                                        <span class="text-xs text-stone-500">AWS CloudFront + S3 + ACM SSL + Route 53.</span>
                                    </div>
                                </label>

                                <label class="cursor-pointer relative">
                                    <input type="radio" name="archTier" value="54.00" data-tier="havpc" class="peer sr-only" onchange="calculatePrice()">
                                    <div class="p-4 rounded-xl border peer-checked:border-stone-900 peer-checked:ring-1 peer-checked:ring-stone-900 transition-all h-full flex flex-col gap-2 border-stone-200 bg-stone-50 hover:bg-stone-100">
                                        <div class="w-8 h-8 rounded-lg bg-stone-900 text-white flex items-center justify-center shadow-xs">
                                            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M3 15a4 4 0 004 4h9a5 5 0 001-9.999 5.002 5.002 0 00-9.78 2.096A4.001 4.001 0 003 15z"></path></svg>
                                        </div>
                                        <span class="font-semibold text-stone-900 tier-name text-sm">High-Availability AWS VPC</span>
                                        <span class="text-xs text-stone-500">EC2 ASG + ALB + Terraform IaC + RDS.</span>
                                    </div>
                                </label>

                                <label class="cursor-pointer relative">
                                    <input type="radio" name="archTier" value="185.00" data-tier="enterprise" class="peer sr-only" onchange="calculatePrice()">
                                    <div class="p-4 rounded-xl border peer-checked:border-stone-900 peer-checked:ring-1 peer-checked:ring-stone-900 transition-all h-full flex flex-col gap-2 border-stone-200 bg-stone-50 hover:bg-stone-100">
                                        <div class="w-8 h-8 rounded-lg bg-emerald-950 text-white flex items-center justify-center shadow-xs">
                                            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path></svg>
                                        </div>
                                        <span class="font-semibold text-stone-900 tier-name text-sm">Zero-Trust Security Stack</span>
                                        <span class="text-xs text-stone-500">CIS Hardened + WireGuard + Auditd.</span>
                                    </div>
                                </label>'''

    radios_new = '''<label class="cursor-pointer relative">
                                    <input type="radio" name="archTier" value="1.00" data-type="static" data-name="Static CDN Deployment" class="peer sr-only" checked>
                                    <div class="p-4 rounded-xl border peer-checked:border-stone-900 peer-checked:ring-1 peer-checked:ring-stone-900 transition-all h-full flex flex-col gap-2 border-stone-200 bg-stone-50 hover:bg-stone-100">
                                        <div class="w-8 h-8 rounded-lg bg-sky-100 text-sky-800 flex items-center justify-center shadow-xs">
                                            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"></path></svg>
                                        </div>
                                        <span class="font-semibold text-stone-900 tier-name text-sm">Static CDN Deployment</span>
                                        <span class="text-xs text-stone-500">AWS CloudFront + S3 ($1.00/mo base).</span>
                                    </div>
                                </label>

                                <label class="cursor-pointer relative">
                                    <input type="radio" name="archTier" value="48.00" data-type="vpc" data-name="High-Availability AWS VPC" class="peer sr-only">
                                    <div class="p-4 rounded-xl border peer-checked:border-stone-900 peer-checked:ring-1 peer-checked:ring-stone-900 transition-all h-full flex flex-col gap-2 border-stone-200 bg-stone-50 hover:bg-stone-100">
                                        <div class="w-8 h-8 rounded-lg bg-stone-900 text-white flex items-center justify-center shadow-xs">
                                            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M3 15a4 4 0 004 4h9a5 5 0 001-9.999 5.002 5.002 0 00-9.78 2.096A4.001 4.001 0 003 15z"></path></svg>
                                        </div>
                                        <span class="font-semibold text-stone-900 tier-name text-sm">High-Availability AWS VPC</span>
                                        <span class="text-xs text-stone-500">1 ALB + 1 NAT Gateway ($48.00/mo base).</span>
                                    </div>
                                </label>

                                <label class="cursor-pointer relative">
                                    <input type="radio" name="archTier" value="25.00" data-type="zerotrust" data-name="Zero-Trust Security Stack" class="peer sr-only">
                                    <div class="p-4 rounded-xl border peer-checked:border-stone-900 peer-checked:ring-1 peer-checked:ring-stone-900 transition-all h-full flex flex-col gap-2 border-stone-200 bg-stone-50 hover:bg-stone-100">
                                        <div class="w-8 h-8 rounded-lg bg-emerald-950 text-white flex items-center justify-center shadow-xs">
                                            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path></svg>
                                        </div>
                                        <span class="font-semibold text-stone-900 tier-name text-sm">Zero-Trust Security Stack</span>
                                        <span class="text-xs text-stone-500">AWS WAF + Security Hub ($25.00/mo base).</span>
                                    </div>
                                </label>'''

    html = html.replace(radios_old, radios_new)

    # 2. Replace Checkboxes with values
    chk_old = '''<label class="flex items-center gap-3 cursor-pointer group">
                                    <input type="checkbox" id="addonFailover" class="peer sr-only" onchange="calculatePrice()">
                                    <div class="w-5 h-5 border rounded flex items-center justify-center peer-checked:bg-stone-900 peer-checked:border-stone-900 transition-colors border-stone-300 bg-white">
                                        <iconify-icon icon="solar:check-read-linear" class="w-3.5 h-3.5 opacity-0 peer-checked:opacity-100 text-white"></iconify-icon>
                                    </div>
                                    <span class="text-sm text-stone-700 group-hover:text-stone-900">Multi-Region Route 53 Automatic Failover (+$350/mo)</span>
                                </label>

                                <label class="flex items-center gap-3 cursor-pointer group">
                                    <input type="checkbox" id="addonHardening" class="peer sr-only" onchange="calculatePrice()">
                                    <div class="w-5 h-5 border rounded flex items-center justify-center peer-checked:bg-stone-900 peer-checked:border-stone-900 transition-colors border-stone-300 bg-white">
                                        <iconify-icon icon="solar:check-read-linear" class="w-3.5 h-3.5 opacity-0 peer-checked:opacity-100 text-white"></iconify-icon>
                                    </div>
                                    <span class="text-sm text-stone-700 group-hover:text-stone-900">Automated CIS Level 1 Hardening &amp; Lynis Compliance Audit (+$250/mo)</span>
                                </label>

                                <label class="flex items-center gap-3 cursor-pointer group">
                                    <input type="checkbox" id="addonDatabase" class="peer sr-only" onchange="calculatePrice()">
                                    <div class="w-5 h-5 border rounded flex items-center justify-center peer-checked:bg-stone-300 peer-checked:border-stone-900 transition-colors border-stone-300 bg-white">
                                        <iconify-icon icon="solar:check-read-linear" class="w-3.5 h-3.5 opacity-0 peer-checked:opacity-100 text-stone-900"></iconify-icon>
                                    </div>
                                    <span class="text-sm text-stone-700 group-hover:text-stone-900">Managed RDS Multi-AZ Database Cluster (+$400/mo)</span>
                                </label>'''

    chk_new = '''<label class="flex items-center gap-3 cursor-pointer group">
                                    <input type="checkbox" id="addonFailover" value="25.00" class="peer sr-only">
                                    <div class="w-5 h-5 border rounded flex items-center justify-center peer-checked:bg-stone-900 peer-checked:border-stone-900 transition-colors border-stone-300 bg-white">
                                        <svg class="w-3.5 h-3.5 opacity-0 peer-checked:opacity-100 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"></path></svg>
                                    </div>
                                    <span class="text-sm text-stone-700 group-hover:text-stone-900">Multi-Region Route 53 Automatic Failover (+$25.00/mo)</span>
                                </label>

                                <label class="flex items-center gap-3 cursor-pointer group">
                                    <input type="checkbox" id="addonHardening" value="125.00" class="peer sr-only">
                                    <div class="w-5 h-5 border rounded flex items-center justify-center peer-checked:bg-stone-900 peer-checked:border-stone-900 transition-colors border-stone-300 bg-white">
                                        <svg class="w-3.5 h-3.5 opacity-0 peer-checked:opacity-100 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"></path></svg>
                                    </div>
                                    <span class="text-sm text-stone-700 group-hover:text-stone-900">Automated CIS Level 1 Hardening &amp; Sync Compliance Audit (+$125.00/mo)</span>
                                </label>

                                <label class="flex items-center gap-3 cursor-pointer group">
                                    <input type="checkbox" id="addonDatabase" value="46.72" class="peer sr-only">
                                    <div class="w-5 h-5 border rounded flex items-center justify-center peer-checked:bg-stone-900 peer-checked:border-stone-900 transition-colors border-stone-300 bg-white">
                                        <svg class="w-3.5 h-3.5 opacity-0 peer-checked:opacity-100 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"></path></svg>
                                    </div>
                                    <span class="text-sm text-stone-700 group-hover:text-stone-900">Managed RDS Multi-AZ Database Cluster (+$46.72/mo)</span>
                                </label>'''

    html = html.replace(chk_old, chk_new)

    # 3. Update JavaScript logic
    calc_func_old = '''function calculatePrice() {
            const tierRadio = document.querySelector('input[name="archTier"]:checked');
            const tierBasePrice = parseFloat(tierRadio.value);
            
            const tierCard = tierRadio.nextElementSibling;
            const tierName = tierCard.querySelector('.tier-name').innerText;
            document.getElementById('summaryTier').innerText = tierName;

            const nodes = parseInt(document.getElementById('nodes').value);
            const requests = parseInt(document.getElementById('requests').value);

            document.getElementById('nodeVal').innerText = nodes + ' Nodes';
            document.getElementById('reqVal').innerText = requests + 'K RPM';
            document.getElementById('summaryNodes').innerText = nodes + ' Nodes';

            let baseCost = tierBasePrice + (nodes * 90) + (requests * 3);
            
            let addonCost = 0;
            if(document.getElementById('addonFailover').checked) addonCost += 350;
            if(document.getElementById('addonHardening').checked) addonCost += 250;
            if(document.getElementById('addonDatabase').checked) addonCost += 400;

            document.getElementById('summaryAddonCost').innerText = '$' + addonCost.toLocaleString();

            const setupFee = 300;
            const total = Math.floor(baseCost + setupFee + addonCost);
            
            document.getElementById('totalPrice').innerText = '$' + total.toLocaleString() + '/mo';
        }'''

    calc_func_new = '''// Real-World AWS Pricing Dynamic Calculator
        function calculateTotal() {
            const selectedScope = document.querySelector('input[name="archTier"]:checked');
            if (!selectedScope) return;

            const scopeBaseCost = parseFloat(selectedScope.value) || 0;
            const scopeType = selectedScope.getAttribute('data-type');
            const scopeName = selectedScope.getAttribute('data-name');

            const nodesSlider = document.getElementById('nodes');
            const requestsSlider = document.getElementById('requests');

            const nodeValEl = document.getElementById('nodeVal');
            const reqValEl = document.getElementById('reqVal');
            const summaryTierEl = document.getElementById('summaryTier');
            const summaryNodesEl = document.getElementById('summaryNodes');
            const summaryAddonCostEl = document.getElementById('summaryAddonCost');
            const totalPriceEl = document.getElementById('totalPrice');

            // 1. Update Scope Summary Name
            summaryTierEl.innerText = scopeName;

            // 2. Compute Node Count Calculation ($30.37/node/mo)
            let nodeCost = 0;
            let nodesCount = parseInt(nodesSlider.value) || 0;

            if (scopeType === 'static') {
                nodesSlider.disabled = true;
                nodesSlider.classList.add('opacity-40', 'cursor-not-allowed');
                nodeValEl.innerText = 'Disabled (Static)';
                summaryNodesEl.innerText = 'N/A (Static CDN)';
            } else {
                nodesSlider.disabled = false;
                nodesSlider.classList.remove('opacity-40', 'cursor-not-allowed');
                nodeCost = nodesCount * 30.37;
                nodeValEl.innerText = nodesCount + (nodesCount === 1 ? ' Node' : ' Nodes');
                summaryNodesEl.innerText = nodesCount + (nodesCount === 1 ? ' Node' : ' Nodes');
            }

            // 3. Traffic Request Volume (RPM) Formula: (SliderValue * 43200 / 1000) * 0.085
            const requestsRPM = parseFloat(requestsSlider.value) || 0;
            reqValEl.innerText = requestsRPM + 'K RPM';
            const trafficCost = (requestsRPM * 43200 / 1000) * 0.085;

            // 4. Architecture Enhancements Checkboxes
            let addonsTotal = 0;
            const chkFailover = document.getElementById('addonFailover');
            const chkHardening = document.getElementById('addonHardening');
            const chkDatabase = document.getElementById('addonDatabase');

            if (chkFailover && chkFailover.checked) addonsTotal += parseFloat(chkFailover.value);
            if (chkHardening && chkHardening.checked) addonsTotal += parseFloat(chkHardening.value);
            if (chkDatabase && chkDatabase.checked) addonsTotal += parseFloat(chkDatabase.value);

            summaryAddonCostEl.innerText = '$' + addonsTotal.toLocaleString('en-US', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
            });

            // 5. Total Price Calculation
            const grandTotal = scopeBaseCost + nodeCost + trafficCost + addonsTotal;

            // Format string to 2 decimal places with thousand separators
            totalPriceEl.innerText = '$' + grandTotal.toLocaleString('en-US', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
            }) + '/mo';
        }

        // Attach Event Listeners
        document.addEventListener('DOMContentLoaded', () => {
            // Scope Radio Buttons
            document.querySelectorAll('input[name="archTier"]').forEach(radio => {
                radio.addEventListener('change', calculateTotal);
            });

            // Sliders (input event for instant updates while dragging)
            const nodesSlider = document.getElementById('nodes');
            const requestsSlider = document.getElementById('requests');
            if (nodesSlider) nodesSlider.addEventListener('input', calculateTotal);
            if (requestsSlider) requestsSlider.addEventListener('input', calculateTotal);

            // Checkboxes
            ['addonFailover', 'addonHardening', 'addonDatabase'].forEach(id => {
                const el = document.getElementById(id);
                if (el) el.addEventListener('change', calculateTotal);
            });

            // Run initial calculation
            calculateTotal();
        });'''

    if 'calculatePrice' in html:
        html = html.replace(calc_func_old, calc_func_new)

    html = html.replace('window.addEventListener(\'load\', () => {\n            calculatePrice();\n        });', '')

    with open('index.html', 'w') as f:
        f.write(html)

    with open('portfolio.html', 'w') as f:
        f.write(html)

    print('Successfully updated calculator logic in index.html and portfolio.html!')

if __name__ == '__main__':
    update_estimator()
