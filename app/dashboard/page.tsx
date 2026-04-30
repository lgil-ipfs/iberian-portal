import { currentUser } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { REDIRECTS } from '@/lib/redirects'
import { INSURANCE_PLACEHOLDERS } from '@/data/insurance'
import { CANADIAN_BANKS } from '@/data/banking'

export default async function DashboardPage() {
  const user = await currentUser()
  if (!user) redirect('/sign-in')

  const firstName = user.firstName || user.emailAddresses[0].emailAddress

  return (
    <main style={{
      fontFamily: "'Jost', sans-serif",
      background: '#FAF8F4',
      minHeight: '100vh',
      color: '#1A120E'
    }}>

      {/* HEADER */}
      <header style={{
        background: '#4A1019',
        display: 'flex',
        alignItems: 'stretch',
        justifyContent: 'space-between',
        height: '56px',
        position: 'sticky',
        top: 0,
        zIndex: 100,
        padding: '0 2rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <span style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: '16px',
            color: '#D4B86A',
            letterSpacing: '0.05em'
          }}>
            Iberian Pacific
          </span>
          <span style={{
            width: '1px',
            height: '28px',
            background: 'rgba(196,154,46,0.2)'
          }} />
          <span style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: '15px',
            color: '#D4B86A',
            fontStyle: 'italic'
          }}>
            Welcome, {firstName}
          </span>
        </div>
      </header>

      {/* BODY */}
      <div style={{ maxWidth: '1060px', margin: '0 auto', padding: '2.5rem 2rem 4rem' }}>

        {/* Welcome strip */}
        <div style={{
          display: 'flex',
          alignItems: 'flex-end',
          justifyContent: 'space-between',
          marginBottom: '3rem',
          paddingBottom: '2rem',
          borderBottom: '0.5px solid rgba(107,31,42,0.1)'
        }}>
          <div>
            <p style={{ fontSize: '9px', fontWeight: 500, letterSpacing: '0.24em', textTransform: 'uppercase', color: '#B8962E', marginBottom: '10px' }}>
              Your financial overview
            </p>
            <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '38px', fontWeight: 300, color: '#4A1019', lineHeight: 1.1 }}>
              Good morning,<br /><em>{firstName}.</em>
            </h1>
            <div style={{ width: '32px', height: '1px', background: '#B8962E', margin: '1rem 0 1.5rem' }} />
            <p style={{ fontSize: '14px', color: '#4A3830', lineHeight: 1.75, fontWeight: 300 }}>
              Everything you hold with us — your investments, your protection, your planning — gathered here for you.
            </p>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '52px', fontWeight: 300, color: 'rgba(107,31,42,0.12)', lineHeight: 1 }}>
              {new Date().getDate()}
            </div>
            <div style={{ fontSize: '9px', fontWeight: 500, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#7A6860' }}>
              {new Date().toLocaleDateString('en-CA', { month: 'long', year: 'numeric' })}
            </div>
          </div>
        </div>

        {/* Investment Accounts */}
        <p style={{ fontSize: '9px', fontWeight: 500, letterSpacing: '0.24em', textTransform: 'uppercase', color: '#B8962E', marginBottom: '10px' }}>
          Registered &amp; non-registered
        </p>
        <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '22px', fontWeight: 300, color: '#4A1019', marginBottom: '2rem', paddingBottom: '1rem', borderBottom: '0.5px solid rgba(107,31,42,0.1)' }}>
          Investment accounts
        </h2>

        <div style={{ background: '#fff', border: '0.5px solid rgba(107,31,42,0.1)', borderRadius: '4px', overflow: 'hidden', marginBottom: '2.5rem' }}>
          {[
            { type: 'Registered · Retirement', name: 'Registered Retirement Savings Plan', abbr: 'RRSP' },
            { type: 'Registered · Tax-Free', name: 'Tax-Free Savings Account', abbr: 'TFSA' },
            { type: 'Registered · Home Buying', name: 'First Home Savings Account', abbr: 'FHSA' },
            { type: 'Non-Registered', name: 'Open Investment Account', abbr: 'Unrestricted' },
          ].map((acct, i, arr) => (
            <div key={acct.abbr} style={{
              display: 'flex',
              alignItems: 'center',
              gap: '1.5rem',
              padding: '1.25rem 2rem',
              borderBottom: i < arr.length - 1 ? '0.5px solid rgba(107,31,42,0.07)' : 'none',
            }}>
              <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#3B7D4A', flexShrink: 0 }} />
              <div style={{ fontSize: '9px', fontWeight: 500, letterSpacing: '0.18em', textTransform: 'uppercase', color: '#7A6860', minWidth: '130px' }}>
                {acct.type}
              </div>
              <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '18px', fontWeight: 400, color: '#1A120E', flex: 1 }}>
                {acct.name}
              </div>
              <div style={{ fontSize: '11px', color: '#7A6860', fontWeight: 300, minWidth: '100px', textAlign: 'right' }}>
                {acct.abbr}
              </div>
              <a href={REDIRECTS.investments.monarch} target="_blank" rel="noopener noreferrer" style={{
                fontSize: '10px', fontWeight: 500, letterSpacing: '0.1em', textTransform: 'uppercase',
                color: '#6B1F2A', textDecoration: 'none', whiteSpace: 'nowrap'
              }}>
                View investments →
              </a>
            </div>
          ))}
        </div>

        {/* Insurance */}
        <p style={{ fontSize: '9px', fontWeight: 500, letterSpacing: '0.24em', textTransform: 'uppercase', color: '#B8962E', marginBottom: '10px' }}>
          Your protection plans
        </p>
        <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '22px', fontWeight: 300, color: '#4A1019', marginBottom: '2rem', paddingBottom: '1rem', borderBottom: '0.5px solid rgba(107,31,42,0.1)' }}>
          Insurance coverage
        </h2>

        <div style={{ background: '#fff', border: '0.5px solid rgba(107,31,42,0.1)', borderRadius: '4px', overflow: 'hidden', marginBottom: '2.5rem' }}>
          {INSURANCE_PLACEHOLDERS.map((plan, i, arr) => (
            <div key={plan.carrier} style={{
              display: 'flex',
              alignItems: 'center',
              gap: '1.5rem',
              padding: '1.25rem 2rem',
              borderBottom: i < arr.length - 1 ? '0.5px solid rgba(107,31,42,0.07)' : 'none',
            }}>
              <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#3B7D4A', flexShrink: 0 }} />
              <div style={{ fontSize: '9px', fontWeight: 500, letterSpacing: '0.18em', textTransform: 'uppercase', color: '#7A6860', minWidth: '130px' }}>
                {plan.type}
              </div>
              <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '18px', fontWeight: 400, color: '#1A120E', flex: 1 }}>
                {plan.name}
              </div>
              <div style={{ fontSize: '11px', color: '#7A6860', fontWeight: 300, minWidth: '100px', textAlign: 'right' }}>
                {plan.carrier}
              </div>
              {plan.portalUrl ? (
                <a href={plan.portalUrl} target="_blank" rel="noopener noreferrer" style={{
                  fontSize: '10px', fontWeight: 500, letterSpacing: '0.1em', textTransform: 'uppercase',
                  color: '#6B1F2A', textDecoration: 'none', whiteSpace: 'nowrap'
                }}>
                  Review coverage →
                </a>
              ) : (
                <span style={{ fontSize: '10px', color: '#7A6860', fontStyle: 'italic', whiteSpace: 'nowrap' }}>
                  Coming soon
                </span>
              )}
            </div>
          ))}
        </div>

        {/* Banking */}
        <p style={{ fontSize: '9px', fontWeight: 500, letterSpacing: '0.24em', textTransform: 'uppercase', color: '#B8962E', marginBottom: '10px' }}>
          Courtesy redirects
        </p>
        <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '22px', fontWeight: 300, color: '#4A1019', marginBottom: '2rem', paddingBottom: '1rem', borderBottom: '0.5px solid rgba(107,31,42,0.1)' }}>
          Your banking
        </h2>

        <div style={{ background: '#fff', border: '0.5px solid rgba(107,31,42,0.1)', borderRadius: '4px', overflow: 'hidden', marginBottom: '2.5rem' }}>
          {CANADIAN_BANKS.map((bank, i, arr) => (
            <div key={bank.id} style={{
              display: 'flex',
              alignItems: 'center',
              gap: '1.5rem',
              padding: '1.25rem 2rem',
              borderBottom: i < arr.length - 1 ? '0.5px solid rgba(107,31,42,0.07)' : 'none',
            }}>
              <div style={{ fontSize: '9px', fontWeight: 500, letterSpacing: '0.18em', textTransform: 'uppercase', color: '#7A6860', minWidth: '60px' }}>
                {bank.logo}
              </div>
              <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '18px', fontWeight: 400, color: '#1A120E', flex: 1 }}>
                {bank.name}
              </div>
              <a href={bank.portalUrl} target="_blank" rel="noopener noreferrer" style={{
                fontSize: '10px', fontWeight: 500, letterSpacing: '0.1em', textTransform: 'uppercase',
                color: '#6B1F2A', textDecoration: 'none', whiteSpace: 'nowrap'
              }}>
                Online banking →
              </a>
            </div>
          ))}
        </div>

      </div>
    </main>
  )
}
