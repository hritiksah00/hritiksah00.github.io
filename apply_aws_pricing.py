import re

def apply_pricing():
    with open('index.html', 'r') as f:
        html = f.read()

    # Old calculatePrice function replacement regex
    old_calc_pattern = r'// Official AWS Pricing Calculator Math Logic\s*function calculatePrice\(\)\s*\{.*?\n        \}'
    
    new_calc_func = '''// Real-World AWS Pricing Dynamic Calculator
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

            // 1. Scope Summary Tier Name
            if (summaryTierEl && scopeName) {
                summaryTierEl.innerText = scopeName;
            }

            // 2. Compute Node Count Calculation ($30.37 per node, per month)
            let nodeCost = 0;
            let nodesCount = parseInt(nodesSlider.value) || 0;

            if (scopeType === 'static') {
                nodesSlider.disabled = true;
                nodesSlider.classList.add('opacity-40', 'cursor-not-allowed');
                if (nodeValEl) nodeValEl.innerText = 'Disabled (Static)';
                if (summaryNodesEl) summaryNodesEl.innerText = 'N/A (Static CDN)';
            } else {
                nodesSlider.disabled = false;
                nodesSlider.classList.remove('opacity-40', 'cursor-not-allowed');
                nodeCost = nodesCount * 30.37;
                if (nodeValEl) nodeValEl.innerText = nodesCount + (nodesCount === 1 ? ' Node' : ' Nodes');
                if (summaryNodesEl) summaryNodesEl.innerText = nodesCount + (nodesCount === 1 ? ' Node' : ' Nodes');
            }

            // 3. Traffic Request Volume (RPM) Formula: (SliderValue * 43200 / 1000) * 0.085
            const requestsRPM = parseFloat(requestsSlider.value) || 0;
            if (reqValEl) reqValEl.innerText = requestsRPM + 'K RPM';
            const trafficCost = (requestsRPM * 43200 / 1000) * 0.085;

            // 4. Architecture Enhancements Checkboxes
            let addonsTotal = 0;
            const chkFailover = document.getElementById('addonFailover');
            const chkHardening = document.getElementById('addonHardening');
            const chkDatabase = document.getElementById('addonDatabase');

            if (chkFailover && chkFailover.checked) addonsTotal += parseFloat(chkFailover.value) || 25.00;
            if (chkHardening && chkHardening.checked) addonsTotal += parseFloat(chkHardening.value) || 125.00;
            if (chkDatabase && chkDatabase.checked) addonsTotal += parseFloat(chkDatabase.value) || 46.72;

            if (summaryAddonCostEl) {
                summaryAddonCostEl.innerText = '$' + addonsTotal.toLocaleString('en-US', {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2
                });
            }

            // 5. Total Price Calculation
            const grandTotal = scopeBaseCost + nodeCost + trafficCost + addonsTotal;

            if (totalPriceEl) {
                totalPriceEl.innerText = '$' + grandTotal.toLocaleString('en-US', {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2
                }) + '/mo';
            }
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

    html = re.sub(old_calc_pattern, new_calc_func, html, flags=re.DOTALL)

    with open('index.html', 'w') as f:
        f.write(html)

    with open('portfolio.html', 'w') as f:
        f.write(html)

    print('Successfully applied calculateTotal() script to index.html and portfolio.html!')

if __name__ == '__main__':
    apply_pricing()
