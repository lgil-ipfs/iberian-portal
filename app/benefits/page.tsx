import { currentUser } from '@clerk/nextjs/server'
import { UserButton } from '@clerk/nextjs'
import { redirect } from 'next/navigation'
import { INSURANCE_PLACEHOLDERS, STAGES, getStageIndex, type InsurancePlan, type RequirementItem, type RequirementStatus } from '@/data/insurance'

function statusBadge(status: RequirementStatus, submittedDate?: string) {
  const configs = {
    pending: {
      bg: 'rgba(220, 80, 40, 0.08)',
      border: 'rgba(220, 80, 40, 0.25)',
      color: '#b33a1a',
      label: 'Action Required',
    },
    submitted: {
      bg: 'rgba(59, 110, 200, 0.08)',
      border: 'rgba(59, 110, 200, 0.25)',
      color: '#1e50a8',
      label: submittedDate ? `Submitted ${submittedDate}` : 'Submitted',
    },
    received: {
      bg: 'rgba(34, 140, 80, 0.08)',
      border: 'rgba(34, 140, 80, 0.25)',
      color: '#186038',
      label: 'Received ✓',
    },
    waived: {
      bg: 'rgba(150, 150, 150, 0.08)',
      border: 'rgba(150, 150, 150, 0.25)',
      color: '#666',
      label: 'Waived',
    },
  }
  const c = configs[status]
  return (
    <span style={{
      fontSize: '10px',
      fontWeight: 700,
      letterSpacing: '0.06em',
      textTransform: 'uppercase',
      padding: '3px 10px',
      borderRadius: '999px',
      background: c.bg,
      border: `1px solid ${c.border}`,
      color: c.color,
      whiteSpace: 'nowrap',
    }}>
      {c.label}
    </span>
  )
}

function RequirementRow({ req }: { req: RequirementItem }) {
  const dotColor = req.status === 'received' ? '#22803F'
    : req.status === 'submitted' ? '#1e50a8'
    : req.status === 'waived' ? '#aaa'
    : '#cc4a1a'

  return (
    <div style={{
      display: 'flex',
      alignItems: 'flex-start',
      gap: '14px',
      padding: '14px 0',
      borderBottom: '1px solid rgba(0,0,0,0.05)',
    }}>
      <div style={{
        width: '8px',
        height: '8px',
        borderRadius: '50%',
        background: dotColor,
        marginTop: '5px',
        flexShrink: 0,
      }} />
      <div style={{ flex: 1 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '12px', flexWrap: 'wrap' }}>
          <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--charcoal)' }}>{req.label}</div>
          {statusBadge(req.status, req.submittedDate)}
        </div>
        <div style={{ fontSize: '12px', color: '#888', marginTop: '3px', lineHeight: 1.5 }}>{req.description}</div>
      </div>
    </div>
  )
}

function PolicyTrackerCard({ plan }: { plan: InsurancePlan }) {
  const activeIdx = getStageIndex(plan.underwritingStage)
  const activeReqs = plan.underwritingStage === 'initial_requirements'
    ? plan.initialRequirements
    : plan.underwritingStage === 'followup_requirements'
    ? plan.followupRequirements
    : undefined

  const pendingCount = activeReqs?.filter((r) => r.status === 'pending').length ?? 0

  const typeColor: Record<string, string> = {
    'Life Insurance': '#6B2737',
    'Critical Illness': '#1a4a6b',
    'Income Protection': '#2a5a3a',
  }
  const accentColor = typeColor[plan.type] ?? 'var(--maroon)'

  return (
    <div style={{
      background: '#fff',
      borderRadius: 'var(--radius)',
      border: '1px solid rgba(0,0,0,0.06)',
      boxShadow: 'var(--shadow-sm)',
      overflow: 'hidden',
      marginBottom: '32px',
    }}>
      {/* Card header */}
      <div style={{
        background: accentColor,
        padding: '1.5rem 2rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '12px',
      }}>
        <div>
          <div style={{ fontSize: '10px', fontWeight: 700, color: 'rgba(255,255,255,0.65)', letterSpacing: '0.14em', textTransform: 'uppercase', marginBottom: '6px' }}>
            {plan.type} · {plan.carrier}
          </div>
          <div style={{ fontSize: '22px', fontFamily: 'var(--font-display)', fontWeight: 600, color: '#fff' }}>
            {plan.name}
          </div>
        </div>
        <div style={{ textAlign: 'right' }}>
          {plan.coverageAmount && (
            <div style={{ fontSize: '24px', fontFamily: 'var(--font-display)', fontWeight: 700, color: '#fff', lineHeight: 1 }}>
              {plan.coverageAmount}
            </div>
          )}
          {plan.premium && (
            <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.65)', marginTop: '4px', fontWeight: 500 }}>
              {plan.premium} premium
            </div>
          )}
        </div>
      </div>

      <div style={{ padding: '2rem' }}>
        {/* Tracker */}
        <div style={{ marginBottom: activeReqs ? '2rem' : '1.5rem' }}>
          <div style={{ fontSize: '11px', fontWeight: 700, color: '#aaa', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '1.25rem' }}>
            Application Progress
          </div>
          <div style={{ overflowX: 'auto', paddingBottom: '8px' }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', minWidth: '640px' }}>
              {STAGES.map((stage, i) => {
                const isComplete = i < activeIdx
                const isActive = i === activeIdx
                const isPending = i > activeIdx

                return (
                  <div key={stage.key} style={{ display: 'flex', alignItems: 'flex-start', flex: 1 }}>
                    {/* Node + label */}
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '64px', flexShrink: 0 }}>
                      <div style={{
                        width: '40px',
                        height: '40px',
                        borderRadius: '50%',
                        background: isComplete ? '#22803F' : isActive ? 'var(--gold)' : '#fff',
                        border: isComplete ? '2.5px solid #22803F' : isActive ? '2.5px solid var(--gold)' : '2px solid #ddd',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: isComplete || isActive ? '#fff' : '#ccc',
                        fontSize: isComplete ? '16px' : '13px',
                        fontWeight: 700,
                        flexShrink: 0,
                        boxShadow: isActive ? '0 0 0 5px rgba(201,168,76,0.18)' : 'none',
                        animation: isActive ? 'tracker-pulse 2.2s ease-out infinite' : 'none',
                        position: 'relative',
                        zIndex: 1,
                      }}>
                        {isComplete ? '✓' : i + 1}
                      </div>
                      <div style={{
                        fontSize: '10px',
                        textAlign: 'center',
                        marginTop: '8px',
                        lineHeight: 1.3,
                        fontWeight: isActive ? 700 : 400,
                        color: isComplete ? '#22803F' : isActive ? 'var(--maroon)' : '#bbb',
                        maxWidth: '64px',
                      }}>
                        {stage.shortLabel}
                      </div>
                    </div>
                    {/* Connector line */}
                    {i < STAGES.length - 1 && (
                      <div style={{
                        flex: 1,
                        height: '2px',
                        marginTop: '19px',
                        background: isComplete ? '#22803F' : 'rgba(0,0,0,0.08)',
                        transition: 'background 0.4s ease',
                      }} />
                    )}
                  </div>
                )
              })}
            </div>
          </div>
          {/* Active stage description */}
          <div style={{
            marginTop: '1rem',
            padding: '10px 14px',
            background: 'var(--cream)',
            borderRadius: '8px',
            borderLeft: '3px solid var(--gold)',
            fontSize: '13px',
            color: '#555',
          }}>
            <strong style={{ color: 'var(--maroon)' }}>{STAGES[activeIdx]?.label}:</strong>{' '}
            {STAGES[activeIdx]?.description}
          </div>
        </div>

        {/* Active requirements */}
        {activeReqs && activeReqs.length > 0 && (
          <div style={{ marginBottom: '1.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '0.5rem' }}>
              <div style={{ fontSize: '11px', fontWeight: 700, color: '#aaa', letterSpacing: '0.12em', textTransform: 'uppercase' }}>
                {plan.underwritingStage === 'followup_requirements' ? 'Follow-up' : 'Outstanding'} Requirements
              </div>
              {pendingCount > 0 && (
                <span style={{
                  fontSize: '10px',
                  fontWeight: 700,
                  background: 'rgba(220,80,40,0.1)',
                  color: '#b33a1a',
                  border: '1px solid rgba(220,80,40,0.2)',
                  borderRadius: '999px',
                  padding: '2px 8px',
                }}>
                  {pendingCount} action{pendingCount > 1 ? 's' : ''} needed
                </span>
              )}
            </div>
            <div>
              {activeReqs.map((req) => (
                <RequirementRow key={req.id} req={req} />
              ))}
            </div>
          </div>
        )}

        {/* Advisor note */}
        {plan.advisorNote && (
          <div style={{
            padding: '12px 16px',
            background: 'rgba(201,168,76,0.06)',
            borderRadius: '8px',
            border: '1px solid rgba(201,168,76,0.2)',
            marginBottom: '1.5rem',
          }}>
            <div style={{ fontSize: '10px', fontWeight: 700, color: 'var(--gold)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '4px' }}>
              Advisor Note
            </div>
            <p style={{ fontSize: '13px', color: '#666', margin: 0, lineHeight: 1.6 }}>{plan.advisorNote}</p>
          </div>
        )}

        {/* CTA */}
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <a
            href={`/benefits/${plan.id}`}
            className="btn btn-secondary"
            style={{ fontSize: '13px', padding: '10px 22px' }}
          >
            View Full Policy Details &rarr;
          </a>
        </div>
      </div>
    </div>
  )
}

export default async function BenefitsPage() {
  const user = await currentUser()
  if (!user) redirect('/sign-in')

  const totalPending = INSURANCE_PLACEHOLDERS.reduce((acc, plan) => {
    const reqs = plan.underwritingStage === 'initial_requirements'
      ? plan.initialRequirements
      : plan.underwritingStage === 'followup_requirements'
      ? plan.followupRequirements
      : []
    return acc + (reqs?.filter((r) => r.status === 'pending').length ?? 0)
  }, 0)

  return (
    <div className="portal-root" style={{ background: 'var(--cream)', minHeight: '100vh' }}>

      {/* TOPBAR */}
      <div style={{ background: 'var(--maroon)', color: 'rgba(255,255,255,0.9)', fontSize: '13px', height: 'var(--nav-top-h)', display: 'flex', alignItems: 'center' }}>
        <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
          <div style={{ fontWeight: 500, letterSpacing: '0.02em' }}>Private Client Portal</div>
          <div style={{ display: 'flex', gap: '20px', fontWeight: 600 }}>
            <a href="https://iberianpacific.ca/contact" style={{ color: 'inherit' }}>Support</a>
            <a href="https://iberianpacific.ca/services" style={{ color: 'inherit' }}>Services</a>
          </div>
        </div>
      </div>

      {/* MAIN NAV */}
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
              <a href="/dashboard" style={{ color: 'inherit' }}>Overview</a>
              <a href="/education" style={{ color: 'inherit' }}>Education</a>
              <a href="/benefits" style={{ color: 'var(--white)', borderBottom: '2px solid var(--gold)', paddingBottom: '4px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                Benefits Plan
                {totalPending > 0 && (
                  <span style={{
                    fontSize: '10px',
                    fontWeight: 700,
                    background: '#cc4a1a',
                    color: '#fff',
                    borderRadius: '999px',
                    padding: '1px 7px',
                    lineHeight: '16px',
                  }}>
                    {totalPending}
                  </span>
                )}
              </a>
              <a href="https://iberianpacific.ca/insights" style={{ color: 'inherit' }}>Insights</a>
            </nav>
            <div style={{ paddingLeft: '15px', borderLeft: '1px solid rgba(255,255,255,0.1)' }}>
              <UserButton />
            </div>
          </div>
        </div>
      </header>

      {/* PAGE BODY */}
      <main className="container" style={{ padding: '4rem 24px' }}>

        {/* Page header */}
        <section style={{ marginBottom: '4rem' }}>
          <div className="kicker" style={{ color: 'var(--gold)', fontWeight: 700, fontSize: '13px', letterSpacing: '0.22em', textTransform: 'uppercase', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ width: '30px', height: '2px', background: 'linear-gradient(90deg, var(--gold), transparent)' }}></span>
            Protection Portfolio
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '24px' }}>
            <div>
              <h1 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', color: 'var(--maroon-deep)', marginBottom: '1rem', fontWeight: 700 }}>
                Your Benefits <span style={{ fontStyle: 'italic', fontWeight: 400 }}>Plan.</span>
              </h1>
              <p style={{ fontSize: '17px', color: '#666', maxWidth: '580px', lineHeight: 1.65, fontWeight: 300 }}>
                Track the status of each insurance application in real time. We surface every active requirement so nothing falls through the cracks on your path to coverage.
              </p>
            </div>
            {totalPending > 0 && (
              <div style={{
                background: 'rgba(220,80,40,0.06)',
                border: '1px solid rgba(220,80,40,0.2)',
                borderRadius: '12px',
                padding: '1rem 1.5rem',
                textAlign: 'center',
                minWidth: '160px',
              }}>
                <div style={{ fontSize: '36px', fontFamily: 'var(--font-display)', fontWeight: 700, color: '#b33a1a', lineHeight: 1 }}>
                  {totalPending}
                </div>
                <div style={{ fontSize: '11px', fontWeight: 700, color: '#b33a1a', letterSpacing: '0.1em', textTransform: 'uppercase', marginTop: '4px' }}>
                  Action{totalPending > 1 ? 's' : ''} Required
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Policy tracker cards */}
        <section>
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '2.5rem' }}>
            <h2 style={{ fontSize: '22px', color: 'var(--maroon-deep)', margin: 0 }}>Active Applications</h2>
            <div style={{ flex: 1, height: '1px', background: 'rgba(107, 39, 55, 0.1)' }}></div>
          </div>
          {INSURANCE_PLACEHOLDERS.map((plan) => (
            <PolicyTrackerCard key={plan.id} plan={plan} />
          ))}
        </section>

        {/* Questions CTA */}
        <section style={{ marginTop: '3rem', textAlign: 'center', padding: '3rem 2rem', background: 'var(--maroon-deep)', borderRadius: 'var(--radius)', color: '#fff' }}>
          <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--gold)', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: '1rem' }}>
            Questions About Your Coverage?
          </div>
          <h3 style={{ fontSize: '28px', fontFamily: 'var(--font-display)', color: '#fff', marginBottom: '1rem', fontWeight: 600 }}>
            We are always one message away.
          </h3>
          <p style={{ color: 'rgba(255,255,255,0.65)', marginBottom: '1.5rem', maxWidth: '480px', margin: '0 auto 1.5rem', lineHeight: 1.6 }}>
            If you have questions about your applications, outstanding requirements, or your coverage options, reach out directly.
          </p>
          <a href="https://iberianpacific.ca/contact" className="btn btn-primary" style={{ fontSize: '14px' }}>
            Contact Your Advisor
          </a>
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
