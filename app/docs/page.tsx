export default function DocsPage() {
  return (
    <main className="bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex gap-12">
          {/* Sidebar */}
          <aside className="hidden lg:block w-64 flex-shrink-0">
            <nav className="sticky top-24">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">Getting Started</p>
              <ul className="space-y-2 text-sm mb-6">
                <li><a href="#quickstart" className="text-indigo-600 font-medium">Quickstart</a></li>
                <li><a href="#adding-vendors" className="text-gray-600 hover:text-gray-900">Adding Vendors</a></li>
                <li><a href="#onboarding-portal" className="text-gray-600 hover:text-gray-900">Onboarding Portal</a></li>
              </ul>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">API Reference</p>
              <ul className="space-y-2 text-sm mb-6">
                <li><a href="#api-vendors" className="text-gray-600 hover:text-gray-900">Vendors</a></li>
                <li><a href="#api-requirements" className="text-gray-600 hover:text-gray-900">Requirements</a></li>
                <li><a href="#api-upload" className="text-gray-600 hover:text-gray-900">File Upload</a></li>
              </ul>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">MCP API</p>
              <ul className="space-y-2 text-sm">
                <li><a href="#mcp-overview" className="text-gray-600 hover:text-gray-900">Overview</a></li>
                <li><a href="#mcp-tools" className="text-gray-600 hover:text-gray-900">Available Tools</a></li>
              </ul>
            </nav>
          </aside>

          {/* Content */}
          <div className="flex-1 min-w-0 prose prose-gray max-w-none">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">VendorGate Documentation</h1>
            <p className="text-lg text-gray-600 mb-12">Everything you need to get vendors compliant and payments unblocked.</p>

            {/* Quickstart */}
            <section id="quickstart" className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Quickstart</h2>
              <div className="bg-gray-50 border border-gray-200 rounded-xl p-6 mb-4">
                <ol className="space-y-3 text-sm text-gray-700">
                  <li className="flex gap-3"><span className="font-bold text-indigo-600">1.</span><span>Sign up and log in to the VendorGate dashboard</span></li>
                  <li className="flex gap-3"><span className="font-bold text-indigo-600">2.</span><span>Click &quot;Add Vendor&quot; — enter name, email, phone, and set a compliance deadline</span></li>
                  <li className="flex gap-3"><span className="font-bold text-indigo-600">3.</span><span>Copy the onboarding link and send it to your vendor</span></li>
                  <li className="flex gap-3"><span className="font-bold text-indigo-600">4.</span><span>Vendor submits documents via the secure /onboard/[token] portal</span></li>
                  <li className="flex gap-3"><span className="font-bold text-indigo-600">5.</span><span>Review and approve each document in the dashboard</span></li>
                  <li className="flex gap-3"><span className="font-bold text-indigo-600">6.</span><span>Once all requirements are approved, vendor status changes to ✅ Approved</span></li>
                </ol>
              </div>
            </section>

            {/* Vendor portal guide */}
            <section id="onboarding-portal" className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Vendor Onboarding Portal</h2>
              <p className="text-gray-600 mb-4">The vendor portal is accessible at <code className="bg-gray-100 px-2 py-0.5 rounded text-sm">/onboard/[token]</code> — no login required for vendors.</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { req: 'W-9', desc: 'Vendors upload their IRS W-9 form (PDF or image). Auto-validated file type.' },
                  { req: 'COI', desc: 'Certificate of Insurance upload with expiration date field.' },
                  { req: 'Terms/NDA', desc: 'Vendor reviews and signs with a typed signature + timestamp.' },
                  { req: 'Bank Details', desc: 'Routing and account numbers. Masked after entry for security.' },
                  { req: 'Business License', desc: 'License upload + license number + expiration date.' },
                ].map((item) => (
                  <div key={item.req} className="bg-white border border-gray-200 rounded-lg p-4">
                    <h4 className="font-semibold text-gray-900 mb-1">{item.req}</h4>
                    <p className="text-sm text-gray-600">{item.desc}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* API Reference */}
            <section id="api-vendors" className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">API Reference</h2>
              <p className="text-gray-600 mb-4">All API endpoints are under <code className="bg-gray-100 px-2 py-0.5 rounded text-sm">/api/v1/</code>. Authentication via Bearer token (Supabase JWT).</p>

              {[
                {
                  method: 'GET', path: '/api/v1/vendors',
                  desc: 'List all vendors for authenticated user',
                  response: '{ vendors: Vendor[] }',
                },
                {
                  method: 'POST', path: '/api/v1/vendors',
                  desc: 'Create a new vendor',
                  body: '{ name, email, phone?, deadline? }',
                  response: '{ vendor: Vendor }',
                },
                {
                  method: 'GET', path: '/api/v1/vendors/[id]',
                  desc: 'Get a single vendor with requirements',
                  response: '{ vendor: Vendor & { requirements: Requirement[] } }',
                },
                {
                  method: 'PATCH', path: '/api/v1/vendors/[id]',
                  desc: 'Update vendor fields',
                  body: '{ name?, email?, status?, deadline? }',
                  response: '{ vendor: Vendor }',
                },
                {
                  method: 'DELETE', path: '/api/v1/vendors/[id]',
                  desc: 'Delete a vendor and all requirements',
                  response: '{ success: true }',
                },
                {
                  method: 'PATCH', path: '/api/v1/vendors/[id]/requirements',
                  desc: 'Approve or reject a requirement',
                  body: '{ requirementId, status: "approved" | "rejected" }',
                  response: '{ requirement: Requirement }',
                },
              ].map((endpoint) => (
                <div key={endpoint.path} className="border border-gray-200 rounded-lg mb-3 overflow-hidden">
                  <div className="flex items-center gap-3 px-4 py-3 bg-gray-50 border-b border-gray-200">
                    <span className={`text-xs font-bold px-2 py-1 rounded ${
                      endpoint.method === 'GET' ? 'bg-green-100 text-green-800' :
                      endpoint.method === 'POST' ? 'bg-blue-100 text-blue-800' :
                      endpoint.method === 'PATCH' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {endpoint.method}
                    </span>
                    <code className="text-sm font-mono text-gray-800">{endpoint.path}</code>
                  </div>
                  <div className="px-4 py-3 text-sm text-gray-600">
                    <p>{endpoint.desc}</p>
                    {endpoint.body && <p className="mt-1"><strong>Body:</strong> <code className="bg-gray-100 px-1 rounded">{endpoint.body}</code></p>}
                    <p className="mt-1"><strong>Response:</strong> <code className="bg-gray-100 px-1 rounded">{endpoint.response}</code></p>
                  </div>
                </div>
              ))}
            </section>

            {/* MCP API */}
            <section id="mcp-overview" className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">MCP API</h2>
              <p className="text-gray-600 mb-4">
                VendorGate implements the Model Context Protocol (MCP) at <code className="bg-gray-100 px-2 py-0.5 rounded text-sm">/api/mcp</code>.
                This allows AI agents to interact with vendor compliance data.
              </p>

              <h3 className="text-lg font-semibold text-gray-900 mb-3" id="mcp-tools">Available Tools</h3>
              <div className="space-y-3">
                {[
                  { tool: 'list_vendors', desc: 'List all vendors with their compliance status. Optional status filter.' },
                  { tool: 'get_vendor', desc: 'Get a single vendor by ID with full requirement details.' },
                  { tool: 'check_compliance', desc: 'Check if a specific vendor is compliant and payment-cleared.' },
                  { tool: 'get_stats', desc: 'Get aggregate compliance stats: total vendors, compliance rate, overdue count.' },
                ].map((tool) => (
                  <div key={tool.tool} className="border border-gray-200 rounded-lg p-4">
                    <code className="font-mono text-sm text-indigo-700 font-bold">{tool.tool}</code>
                    <p className="text-sm text-gray-600 mt-1">{tool.desc}</p>
                  </div>
                ))}
              </div>

              <div className="mt-6 bg-gray-900 text-gray-100 rounded-xl p-6 text-sm font-mono overflow-x-auto">
                <p className="text-gray-400 mb-2">// Example MCP request</p>
                <pre>{JSON.stringify({
                  jsonrpc: '2.0',
                  method: 'tools/call',
                  params: {
                    name: 'check_compliance',
                    arguments: { vendor_id: 'uuid-here' }
                  },
                  id: 1
                }, null, 2)}</pre>
              </div>
            </section>
          </div>
        </div>
      </div>
    </main>
  )
}
