import re

def update_contact_form():
    with open('index.html', 'r') as f:
        html = f.read()

    # 1. Match old form
    form_start = html.find('<form id="contactForm"')
    form_end = html.find('</form>', form_start) + len('</form>')
    
    old_form_code = html[form_start:form_end]

    new_form_html = '''<form id="contactForm" action="https://api.web3forms.com/submit" method="POST" class="space-y-6">
                            <!-- Web3Forms Access Key Credentials -->
                            <input type="hidden" name="access_key" value="6fbf5a35-5b6f-4f6f-8cf6-37952b60b482">
                            <!-- Honeypot Anti-Spam Botcheck -->
                            <input type="checkbox" name="botcheck" class="hidden" style="display: none;">

                            <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                <div class="space-y-2">
                                    <label class="text-xs font-semibold text-stone-900 uppercase tracking-wider">Your Name</label>
                                    <input type="text" name="name" required pattern="^[a-zA-Z\\s]+$" title="Please enter only letters and spaces" class="w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-stone-900 border-stone-300 bg-white text-sm" placeholder="e.g. Sarah Connor">
                                </div>
                                <div class="space-y-2">
                                    <label class="text-xs font-semibold text-stone-900 uppercase tracking-wider">Your Email</label>
                                    <input type="email" name="email" required class="w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-stone-900 border-stone-300 bg-white text-sm" placeholder="sarah@example.com">
                                </div>
                            </div>

                            <div class="space-y-2">
                                <label class="text-xs font-semibold text-stone-900 uppercase tracking-wider">Topic / Opportunity</label>
                                <select name="subject" class="w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-stone-900 border-stone-300 bg-white text-sm">
                                    <option value="AWS Cloud / Deployment Project">AWS Cloud / Deployment Project</option>
                                    <option value="DevOps &amp; Terraform Automation">DevOps &amp; Terraform Automation</option>
                                    <option value="Linux Security Hardening">Linux Security Hardening</option>
                                    <option value="Internship / Job Opportunity">Internship / Job Opportunity</option>
                                    <option value="Other Inquiry">Other Inquiry</option>
                                </select>
                            </div>

                            <div class="space-y-2">
                                <label class="text-xs font-semibold text-stone-900 uppercase tracking-wider">Message</label>
                                <textarea name="message" rows="4" required class="w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-stone-900 border-stone-300 bg-white text-sm" placeholder="Hi Ritik, I would like to connect regarding..."></textarea>
                            </div>

                            <button type="submit" id="contactSubmitBtn" class="w-full font-semibold py-4 rounded-lg transition-all shadow-md bg-stone-900 text-white hover:bg-stone-800 text-sm cursor-pointer flex items-center justify-center gap-2">
                                <span id="contactBtnText">Send Message</span>
                            </button>
                            
                            <!-- Status Notification Alert -->
                            <div id="contactStatus" class="hidden p-4 rounded-xl text-xs font-medium text-center transition-all duration-300"></div>
                        </form>'''

    html = html.replace(old_form_code, new_form_html)

    # 2. Add JavaScript Handler
    js_web3forms = '''
        // Web3Forms Asynchronous AJAX Contact Form Handler
        document.addEventListener('DOMContentLoaded', () => {
            const contactForm = document.getElementById('contactForm');
            const submitBtn = document.getElementById('contactSubmitBtn');
            const btnText = document.getElementById('contactBtnText');
            const statusMsg = document.getElementById('contactStatus');

            if (contactForm) {
                contactForm.addEventListener('submit', function (e) {
                    e.preventDefault();

                    // Native HTML5 Validation Check
                    if (!contactForm.checkValidity()) {
                        contactForm.reportValidity();
                        return;
                    }

                    // Set Button Loading State
                    submitBtn.disabled = true;
                    submitBtn.classList.add('opacity-75', 'cursor-not-allowed');
                    btnText.innerText = 'Sending...';

                    const formData = new FormData(contactForm);

                    fetch('https://api.web3forms.com/submit', {
                        method: 'POST',
                        body: formData
                    })
                    .then(async (response) => {
                        let json = await response.json();
                        if (response.status === 200 && json.success) {
                            // Success Handler
                            contactForm.reset();
                            statusMsg.className = 'p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs text-center font-medium shadow-2xs block';
                            statusMsg.innerText = '✓ Thank you! Your message has been sent successfully. I will respond to your email at hritiksah38@gmail.com within 24 hours.';
                            
                            // Fade out success message after 5 seconds
                            setTimeout(() => {
                                statusMsg.className = 'hidden p-4 rounded-xl text-xs font-medium text-center transition-all duration-300';
                            }, 5000);
                        } else {
                            throw new Error(json.message || 'Something went wrong. Please try again.');
                        }
                    })
                    .catch((error) => {
                        // Error Handler
                        statusMsg.className = 'p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs text-center font-medium shadow-2xs block';
                        statusMsg.innerText = '✕ Error: ' + (error.message || 'Unable to send message. Please try again later.');
                    })
                    .finally(() => {
                        // Restore Button State
                        submitBtn.disabled = false;
                        submitBtn.classList.remove('opacity-75', 'cursor-not-allowed');
                        btnText.innerText = 'Send Message';
                    });
                });
            }
        });'''

    if 'Web3Forms Asynchronous AJAX' not in html:
        html = html.replace('</script>', js_web3forms + '\n    </script>')

    with open('index.html', 'w') as f:
        f.write(html)

    with open('portfolio.html', 'w') as f:
        f.write(html)

    print('Successfully upgraded contact form to Web3Forms in index.html and portfolio.html!')

if __name__ == '__main__':
    update_contact_form()
