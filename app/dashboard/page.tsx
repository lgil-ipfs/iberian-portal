import { currentUser } from '@clerk/nextjs/server'
import { UserButton } from '@clerk/nextjs'
import { redirect } from 'next/navigation'
import { REDIRECTS } from '@/lib/redirects'
import { INSURANCE_PLACEHOLDERS } from '@/data/insurance'
import { CANADIAN_BANKS } from '@/data/banking'

export default async function DashboardPage() {
  const user = await currentUser()
  if (!user) redirect('/sign-in')

  const firstName = user.firstName || user.emailAddresses[0].emailAddress.split('@')[0]

  return (
    <div className="portal-root" style={{ background: 'var(--cream)', minHeight: '100vh' }}>
      
      {/* 1. TOPBAR */}
      <div style={{ background: 'var(--maroon)', color: 'rgba(255,255,255,0.9)', fontSize: '13px', height: 'var(--nav-top-h)', display: 'flex', alignItems: 'center' }}>
        <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
          <div style={{ fontWeight: 500, letterSpacing: '0.02em' }}>
            Private Client Portal
          </div>
          <div style={{ display: 'flex', gap: '20px', fontWeight: 600 }}>
            <a href="https://iberianpacific.ca/contact" style={{ color: 'inherit' }}>Support</a>
            <a href="https://iberianpacific.ca/services" style={{ color: 'inherit' }}>Services</a>
          </div>
        </div>
      </div>

      {/* 2. MAIN NAV */}
      <header style={{ background: 'var(--charcoal)', height: 'var(--nav-h)', display: 'flex', alignItems: 'center', position: 'sticky', top: 0, zIndex: 100, borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            <img 
              src="https://cdn.prod.website-files.com/68ed2588f300fc2737bceebf/68ed30864b7c7327a36e3c8b_IPFS-Logo-c.svg" 
              alt="Iberian Pacific" 
              style={{ height: '36px' }} 
            />
            <span style={{ fontFamily: 'var(--font-display)', color: 'var(--white)', fontSize: '22px', fontWeight: 700, letterSpacing: '0.04em' }}>
              Iberian Pacific
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '25px' }}>
            <nav style={{ display: 'flex', gap: '25px', color: 'rgba(255,255,255,0.85)', fontSize: '14px', fontWeight: 500 }}>
              <a href="/dashboard" style={{ color: 'var(--white)', borderBottom: '2px solid var(--gold)', paddingBottom: '4px' }}>Overview</a>
              <a href="#investments" style={{ color: 'inherit' }}>Investments</a>
              <a href="#protection" style={{ color: 'inherit' }}>Protection</a>
            </nav>
            <div style={{ paddingLeft: '15px', borderLeft: '1px solid rgba(255,255,255,0.1)' }}>
              <UserButton />
            </div>
          </div>
        </div>
      </header>

      {/* 3. DASHBOARD BODY */}
      <main className="container" style={{ padding: '4rem 24px' }}>
        
        {/* Welcome Section */}
        <section style={{ marginBottom: '5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
            <div>
              <div className="kicker" style={{ color: 'var(--gold)', fontWeight: 700, fontSize: '13px', letterSpacing: '0.22em', textTransform: 'uppercase', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{ width: '30px', height: '2px', background: 'linear-gradient(90deg, var(--gold), transparent)' }}></span>
                Private Wealth Overview
              </div>
              <h1 style={{ fontSize: 'clamp(2.5rem, 5vw, 3.5rem)', color: 'var(--maroon-deep)', marginBottom: '1.5rem', fontWeight: 700 }}>
                Good morning, <br />
                <span style={{ fontStyle: 'italic', fontWeight: 400 }}>{firstName}.</span>
              </h1>
              <p style={{ fontSize: '18px', color: '#555', maxWidth: '600px', lineHeight: 1.6, fontWeight: 300 }}>
                Welcome to your private dashboard. Here you can monitor your portfolios, review your protection plans, and access secure banking redirects.
              </p>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: '64px', color: 'rgba(107, 39, 55, 0.08)', fontWeight: 700, lineHeight: 1 }}>
                {new Date().getDate()}
              </div>
              <div style={{ fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.15em', color: 'var(--maroon)', opacity: 0.6 }}>
                {new Date().toLocaleDateString('en-CA', { month: 'long', year: 'numeric' })}
              </div>
            </div>
          </div>
        </section>

        {/* 4. INVESTMENT ACCOUNTS */}
        <section id="investments" style={{ marginBottom: '4.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '2.5rem' }}>
            <h2 style={{ fontSize: '28px', color: 'var(--maroon-deep)', margin: 0 }}>Investment Accounts</h2>
            <div style={{ flex: 1, height: '1px', background: 'rgba(107, 39, 55, 0.1)' }}></div>
          </div>

          <div className="grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '24px' }}>
            {[
              { type: 'Registered · Retirement', name: 'RRSP', full: 'Registered Retirement Savings Plan', desc: 'Long-term tax-deferred growth for your retirement future.' },
              { type: 'Registered · Tax-Free', name: 'TFSA', full: 'Tax-Free Savings Account', desc: 'Flexible tax-free growth for any financial goal.' },
              { type: 'Registered · First Home', name: 'FHSA', full: 'First Home Savings Account', desc: 'Tax-advantaged saving for your first property purchase.' },
              { type: 'Non-Registered', name: 'Open Account', full: 'Unrestricted Investment Account', desc: 'Flexible, liquid investments with no contribution limits.' },
            ].map((acct) => (
              <div key={acct.name} className="card" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', height: '100%' }}>
                <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--gold)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '12px' }}>
                  {acct.type}
                </div>
                <h3 style={{ fontSize: '22px', color: 'var(--maroon)', marginBottom: '10px' }}>{acct.full}</h3>
                <p style={{ fontSize: '14px', color: '#666', lineHeight: 1.6, marginBottom: '2rem', flex: 1 }}>{acct.desc}</p>
                <div style={{ borderTop: '1px solid rgba(0,0,0,0.05)', paddingTop: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '12px', fontWeight: 600, color: '#999' }}>ID: {acct.name}-XXXX</span>
                  <a 
                    href={REDIRECTS.investments.monarch} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="btn btn-primary"
                    style={{ padding: '10px 20px', fontSize: '13px' }}
                  >
                    View Holdings
                  </a>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 5. INSURANCE & PROTECTION */}
        <section id="protection" style={{ marginBottom: '4.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '2.5rem' }}>
            <h2 style={{ fontSize: '28px', color: 'var(--maroon-deep)', margin: 0 }}>Insurance & Protection</h2>
            <div style={{ flex: 1, height: '1px', background: 'rgba(107, 39, 55, 0.1)' }}></div>
          </div>

          <div style={{ background: '#fff', borderRadius: 'var(--radius)', border: '1px solid rgba(0,0,0,0.06)', overflow: 'hidden', boxShadow: 'var(--shadow-sm)' }}>
            {INSURANCE_PLACEHOLDERS.map((plan, i, arr) => (
              <div key={plan.carrier} style={{ 
                padding: '1.5rem 2.5rem', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'space-between',
                borderBottom: i < arr.length - 1 ? '1px solid rgba(0,0,0,0.05)' : 'none',
                transition: 'background 0.2s ease'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                  <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: plan.portalUrl ? '#3B7D4A' : '#D1D1D1' }}></div>
                  <div>
                    <div style={{ fontSize: '10px', fontWeight: 700, color: 'var(--gold)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>{plan.type}</div>
                    <div style={{ fontSize: '18px', color: 'var(--maroon)', fontWeight: 600 }}>{plan.name}</div>
                  </div>
                </div>
                <div style={{ textAlign: 'right', display: 'flex', alignItems: 'center', gap: '40px' }}>
                  <div style={{ fontSize: '14px', color: '#777', fontWeight: 500 }}>{plan.carrier}</div>
                  {plan.portalUrl ? (
                    <a href={plan.portalUrl} target="_blank" rel="noopener noreferrer" className="btn btn-secondary" style={{ padding: '8px 18px', fontSize: '12px' }}>
                      Carrier Portal
                    </a>
                  ) : (
                    <span style={{ fontSize: '12px', color: '#999', fontStyle: 'italic' }}>Pending Review</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 6. BANKING REDIRECTS */}
        <section style={{ marginBottom: '2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '2.5rem' }}>
            <h2 style={{ fontSize: '28px', color: 'var(--maroon-deep)', margin: 0 }}>Courtesy Banking Links</h2>
            <div style={{ flex: 1, height: '1px', background: 'rgba(107, 39, 55, 0.1)' }}></div>
          </div>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '20px' }}>
            {CANADIAN_BANKS.map((bank) => (
              <a 
                key={bank.id} 
                href={bank.portalUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className="card"
                style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '15px', textDecoration: 'none' }}
              >
                <div style={{ width: '40px', height: '40px', background: 'var(--cream)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px', fontWeight: 700, color: 'var(--maroon)' }}>
                  {bank.logo}
                </div>
                <div>
                  <div style={{ fontSize: '16px', fontWeight: 600, color: 'var(--maroon)' }}>{bank.name}</div>
                  <div style={{ fontSize: '11px', color: 'var(--gold)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Sign In &rarr;</div>
                </div>
              </a>
            ))}
          </div>
        </section>

      </main>

      {/* FOOTER */}
      <footer style={{ background: 'var(--charcoal)', color: 'rgba(255,255,255,0.6)', padding: '4rem 0', borderTop: '4px solid var(--gold)' }}>
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <img 
                src="https://cdn.prod.website-files.com/68ed2588f300fc2737bceebf/68ed30864b7c7327a36e3c8b_IPFS-Logo-c.svg" 
                alt="Iberian Pacific" 
                style={{ height: '32px', filter: 'brightness(0) invert(1)', opacity: 0.8 }} 
              />
              <span style={{ fontFamily: 'var(--font-display)', color: 'var(--white)', fontSize: '20px', fontWeight: 600 }}>Iberian Pacific</span>
            </div>
            <div style={{ display: 'flex', gap: '30px', fontSize: '14px' }}>
              <a href="https://iberianpacific.ca/privacy" style={{ color: 'inherit' }}>Privacy Policy</a>
              <a href="https://iberianpacific.ca/terms" style={{ color: 'inherit' }}>Terms of Service</a>
              <a href="https://iberianpacific.ca/disclaimers" style={{ color: 'inherit' }}>Disclaimers</a>
            </div>
          </div>
          <div style={{ fontSize: '13px', lineHeight: 1.8 }}>
            <p>Mutual funds are offered through Monarch Wealth Corporation. Insurance distributed through Customplan Financial Advisors Inc. Serving BC and Ontario.</p>
            <p style={{ marginTop: '1rem' }}>&copy; {new Date().getFullYear()} Iberian Pacific Financial Services. All rights reserved.</p>
          </div>
        </div>
      </footer>

    </div>
  )
}
